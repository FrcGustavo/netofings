import os from 'node:os';
import { execSync } from 'node:child_process';
import NetofingsAgent from '../src/index';

type NetworkTotals = {
    rxBytes: number;
    txBytes: number;
};

type ThroughputSample = {
    totalBytes: number;
    timestampMs: number;
};

function getNetworkTotals(): NetworkTotals {
    try {
        const output = execSync('netstat -ibn', {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        });

        const lines = output.split('\n').filter(Boolean);
        const header = lines.find((line) => line.includes('Name') && line.includes('Ibytes') && line.includes('Obytes'));

        if (!header) {
            return { rxBytes: 0, txBytes: 0 };
        }

        const headerColumns = header.trim().split(/\s+/);
        const nameIndex = headerColumns.indexOf('Name');
        const inBytesIndex = headerColumns.indexOf('Ibytes');
        const outBytesIndex = headerColumns.indexOf('Obytes');

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
            if (!name || name === 'lo0') {
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
    id: 'ac8b4a34-3d0e-4985-8634-23e78d8ac1aa',
    name: 'Agent1',
    username: 'Gustavo',
    interval: 5000,
    host: 'mqtt://localhost'
});

agent.connect();

let previousThroughputSample: ThroughputSample | null = null;

agent.addMetric('cpu', () => {
    const cpus = os.cpus();

    const totalIdle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const totalTick = cpus.reduce((acc, cpu) => acc + Object.values(cpu.times).reduce((sum, time) => sum + time, 0), 0);

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;

    if (total === 0) {
        return 0;
    }

    const usagePercent = (1 - idle / total) * 100;
    return Number(usagePercent.toFixed(2));
});

agent.addMetric('memory', () => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();

    if (totalMem === 0) {
        return 0;
    }

    const usagePercent = ((totalMem - freeMem) / totalMem) * 100;
    return Number(usagePercent.toFixed(2));
});

agent.addMetric('network', () => {
    const { rxBytes, txBytes } = getNetworkTotals();
    const totalBytes = rxBytes + txBytes;
    const now = Date.now();

    if (!previousThroughputSample) {
        previousThroughputSample = { totalBytes, timestampMs: now };
        return 0;
    }

    const elapsedSeconds = (now - previousThroughputSample.timestampMs) / 1000;
    const deltaBytes = Math.max(0, totalBytes - previousThroughputSample.totalBytes);

    previousThroughputSample = { totalBytes, timestampMs: now };

    if (elapsedSeconds <= 0) {
        return 0;
    }

    const mbps = (deltaBytes * 8) / (elapsedSeconds * 1_000_000);
    return Number(mbps.toFixed(2));
}); 