import os from 'node:os';
import NetofingsAgent from '../src/index';

type NetworkInterfaceInfoWithStats = os.NetworkInterfaceInfo & {
    tx_bytes?: number;
    rx_bytes?: number;
};

const agent = new NetofingsAgent({ 
    uuid: 'ca24780d-c193-4373-81be-096b85648920',
    username: 'Agent1',
    interval: 5000,
    host: 'mqtt://localhost'
});

agent.connect();

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
    const interfaces = os.networkInterfaces();
    let totalBytesSent = 0;
    let totalBytesReceived = 0;

    for (const iface of Object.values(interfaces)) {
        if (iface) {
            for (const net of iface) {
                if (!net.internal) {
                    const networkInfo = net as NetworkInterfaceInfoWithStats;
                    totalBytesSent += networkInfo.tx_bytes || 0;
                    totalBytesReceived += networkInfo.rx_bytes || 0;
                }
            }
        }
    }

    const totalBytes = totalBytesSent + totalBytesReceived;

    if (totalBytes === 0) {
        return 0;
    }

    const usagePercent = (totalBytes / (1024 * 1024 * 1024)) * 100; // Convert to GB and calculate percentage
    return Number(usagePercent.toFixed(2));
}); 