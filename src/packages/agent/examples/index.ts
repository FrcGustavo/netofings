import os from "node:os";
import { execSync } from "node:child_process";
import NetofingsAgent from "../src/index";

const agentToken = process.env.NETOFINGS_AGENT_TOKEN;

if (!agentToken) {
  throw new Error(
    "NETOFINGS_AGENT_TOKEN is required to authenticate with the MQTT broker.",
  );
}

type NetworkTotals = {
  rxBytes: number;
  txBytes: number;
};

type ThroughputSample = {
  totalBytes: number;
  timestampMs: number;
};

type CpuSample = {
  idle: number;
  total: number;
};

function getCpuSample(): CpuSample {
  const cpus = os.cpus();

  const idle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
  const total = cpus.reduce(
    (acc, cpu) =>
      acc + Object.values(cpu.times).reduce((sum, time) => sum + time, 0),
    0,
  );

  return {
    idle,
    total,
  };
}

function getNetworkTotals(): NetworkTotals {
  try {
    const output = execSync("netstat -ibn", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });

    const lines = output.split("\n").filter(Boolean);
    const header = lines.find(
      (line) =>
        line.includes("Name") &&
        line.includes("Ibytes") &&
        line.includes("Obytes"),
    );

    if (!header) {
      return { rxBytes: 0, txBytes: 0 };
    }

    const headerColumns = header.trim().split(/\s+/);
    const nameIndex = headerColumns.indexOf("Name");
    const inBytesIndex = headerColumns.indexOf("Ibytes");
    const outBytesIndex = headerColumns.indexOf("Obytes");

    if (nameIndex < 0 || inBytesIndex < 0 || outBytesIndex < 0) {
      return { rxBytes: 0, txBytes: 0 };
    }

    const byInterface = new Map<string, { rxBytes: number; txBytes: number }>();

    for (const line of lines) {
      if (line === header) {
        continue;
      }

      const columns = line.trim().split(/\s+/);
      if (columns.length <= outBytesIndex) {
        continue;
      }

      const name = columns[nameIndex];
      if (!name || name === "lo0") {
        continue;
      }

      const rxBytes = Number(columns[inBytesIndex]);
      const txBytes = Number(columns[outBytesIndex]);

      if (!Number.isFinite(rxBytes) || !Number.isFinite(txBytes)) {
        continue;
      }

      const current = byInterface.get(name) ?? { rxBytes: 0, txBytes: 0 };
      current.rxBytes = Math.max(current.rxBytes, rxBytes);
      current.txBytes = Math.max(current.txBytes, txBytes);
      byInterface.set(name, current);
    }

    let totalRx = 0;
    let totalTx = 0;

    for (const value of byInterface.values()) {
      totalRx += value.rxBytes;
      totalTx += value.txBytes;
    }

    return { rxBytes: totalRx, txBytes: totalTx };
  } catch {
    return { rxBytes: 0, txBytes: 0 };
  }
}

const agent = new NetofingsAgent({
  name: "Agent1",
  username: "Gustavo",
  token: agentToken,
  interval: 5000,
  host: "mqtt://localhost",
});

agent.connect();

let previousThroughputSample: ThroughputSample | null = null;
let previousCpuSample: CpuSample | null = null;

agent.addMetric("cpu", () => {
  const currentCpuSample = getCpuSample();

  if (!previousCpuSample) {
    previousCpuSample = currentCpuSample;
    return 0;
  }

  const idleDelta = currentCpuSample.idle - previousCpuSample.idle;
  const totalDelta = currentCpuSample.total - previousCpuSample.total;

  previousCpuSample = currentCpuSample;

  if (totalDelta <= 0) {
    return 0;
  }

  const usagePercent = (1 - idleDelta / totalDelta) * 100;
  return Number(usagePercent.toFixed(2));
});

agent.addMetric("memory", () => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  if (totalMem === 0) {
    return 0;
  }

  const usagePercent = ((totalMem - freeMem) / totalMem) * 100;
  return Number(usagePercent.toFixed(2));
});

agent.addMetric("network", () => {
  const { rxBytes, txBytes } = getNetworkTotals();
  const totalBytes = rxBytes + txBytes;
  const now = Date.now();

  if (!previousThroughputSample) {
    previousThroughputSample = { totalBytes, timestampMs: now };
    return 0;
  }

  const elapsedSeconds = (now - previousThroughputSample.timestampMs) / 1000;
  const deltaBytes = Math.max(
    0,
    totalBytes - previousThroughputSample.totalBytes,
  );

  previousThroughputSample = { totalBytes, timestampMs: now };

  if (elapsedSeconds <= 0) {
    return 0;
  }

  const mbps = (deltaBytes * 8) / (elapsedSeconds * 1_000_000);
  return Number(mbps.toFixed(2));
});
