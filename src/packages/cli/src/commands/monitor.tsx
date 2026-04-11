import React, { useEffect, useMemo, useRef, useState } from 'react';
import NetofingsAgent from '@netofings/agent';
import asciichart from 'asciichart';
import { Box, render, Text, useApp, useInput } from 'ink';
import { z } from 'zod';
import type {
  AgentDescriptor,
  AgentMessagePayload,
  ConnectedPayload,
  DisconnectedPayload,
  MetricValue,
} from '@netofings/agent';
import { toClockTime } from '../utils/time';

export const monitorOptionsSchema = z.object({
  host: z.string().min(1),
  interval: z.number().int().positive(),
});

export type MonitorOptions = z.infer<typeof monitorOptionsSchema>;

type MetricPoint = {
  value: number;
  timestamp: string;
};

type MetricStore = Map<string, Map<string, MetricPoint[]>>;

const WINDOW_SIZE = 20;

function toNumeric(value: MetricValue): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }

  if (typeof value === 'string') {
    const asNumber = Number(value);
    if (Number.isFinite(asNumber)) {
      return asNumber;
    }
  }

  return null;
}

function MonitorApp({ options }: { options: MonitorOptions }) {
  const { exit } = useApp();
  const [tick, setTick] = useState(0);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);

  const agentsRef = useRef<Map<string, AgentDescriptor>>(new Map());
  const metricsRef = useRef<MetricStore>(new Map());

  useInput((input, key) => {
    if (input === 'q' || key.escape || key.ctrl && input === 'c') {
      exit();
      return;
    }

    if (input === 'j' || key.downArrow) {
      setSelectedMetricIndex((value) => value + 1);
      return;
    }

    if (input === 'k' || key.upArrow) {
      setSelectedMetricIndex((value) => Math.max(0, value - 1));
      return;
    }

    if (key.leftArrow) {
      setSelectedAgentIndex((value) => Math.max(0, value - 1));
      setSelectedMetricIndex(0);
      return;
    }

    if (key.rightArrow) {
      setSelectedAgentIndex((value) => value + 1);
      setSelectedMetricIndex(0);
    }
  });

  useEffect(() => {
    const client = new NetofingsAgent({
      mqtt: { host: options.host },
      interval: options.interval,
    });

    const rerender = () => setTick((value) => value + 1);

    const onConnected = (payload: ConnectedPayload) => {
      const { uuid } = payload.agent;
      if (!agentsRef.current.has(uuid)) {
        agentsRef.current.set(uuid, payload.agent);
        metricsRef.current.set(uuid, new Map());
      }
      rerender();
    };

    const onDisconnected = (payload: DisconnectedPayload) => {
      const { uuid } = payload.agent;
      agentsRef.current.delete(uuid);
      metricsRef.current.delete(uuid);
      rerender();
    };

    const onMessage = (payload: AgentMessagePayload) => {
      const { uuid } = payload.agent;

      if (!agentsRef.current.has(uuid)) {
        agentsRef.current.set(uuid, payload.agent);
      }

      if (!metricsRef.current.has(uuid)) {
        metricsRef.current.set(uuid, new Map());
      }

      const agentMetrics = metricsRef.current.get(uuid);
      if (!agentMetrics) {
        return;
      }

      for (const metric of payload.metrics) {
        const metricValue = toNumeric(metric.value);
        if (metricValue === null) {
          continue;
        }

        if (!agentMetrics.has(metric.type)) {
          agentMetrics.set(metric.type, []);
        }

        const points = agentMetrics.get(metric.type);
        if (!points) {
          continue;
        }

        points.push({
          value: metricValue,
          timestamp: toClockTime(payload.timestamp),
        });

        if (points.length > WINDOW_SIZE) {
          points.splice(0, points.length - WINDOW_SIZE);
        }
      }

      rerender();
    };

    client.on('agent/connected', onConnected);
    client.on('agent/disconnected', onDisconnected);
    client.on('agent/message', onMessage);
    client.connect();

    return () => {
      client.disconnect();
    };
  }, [options.host, options.interval]);

  const snapshot = useMemo(() => {
    const agents = Array.from(agentsRef.current.values());
    const boundedAgentIndex = Math.min(selectedAgentIndex, Math.max(0, agents.length - 1));
    const selectedAgent = agents[boundedAgentIndex];

    const selectedAgentMetrics = selectedAgent
      ? metricsRef.current.get(selectedAgent.uuid) ?? new Map<string, MetricPoint[]>()
      : new Map<string, MetricPoint[]>();

    const metricEntries = Array.from(selectedAgentMetrics.entries());
    const boundedMetricIndex = Math.min(selectedMetricIndex, Math.max(0, metricEntries.length - 1));
    const selectedMetric = metricEntries[boundedMetricIndex];

    const values = selectedMetric ? selectedMetric[1].map((point) => point.value) : [];
    const chart = values.length >= 2
      ? asciichart.plot(values, { height: 8 })
      : 'Waiting for numeric metric values...';

    return {
      agents,
      selectedAgentIndex: boundedAgentIndex,
      metricEntries,
      selectedMetricIndex: boundedMetricIndex,
      selectedMetric,
      chart,
    };
  }, [selectedAgentIndex, selectedMetricIndex, tick]);

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan">Netofings Monitor</Text>
      <Text dimColor>Host: {options.host} | Interval: {options.interval}ms</Text>
      <Text dimColor>Keys: q exit | left/right agent | up/down metric</Text>
      <Box marginTop={1} flexDirection="row">
        <Box width="40%" flexDirection="column" marginRight={2}>
          <Text bold>Agents</Text>
          {snapshot.agents.length === 0 && <Text dimColor>No connected agents yet</Text>}
          {snapshot.agents.map((agent, index) => (
            <Text key={agent.uuid} color={index === snapshot.selectedAgentIndex ? 'green' : undefined}>
              {index === snapshot.selectedAgentIndex ? '>' : ' '} {agent.name} ({agent.pid})
            </Text>
          ))}

          <Box marginTop={1} flexDirection="column">
            <Text bold>Metrics</Text>
            {snapshot.metricEntries.length === 0 && <Text dimColor>No metrics yet</Text>}
            {snapshot.metricEntries.map(([metric], index) => (
              <Text key={metric} color={index === snapshot.selectedMetricIndex ? 'yellow' : undefined}>
                {index === snapshot.selectedMetricIndex ? '>' : ' '} {metric}
              </Text>
            ))}
          </Box>
        </Box>

        <Box width="60%" flexDirection="column">
          <Text bold>
            {snapshot.selectedMetric ? `${snapshot.selectedMetric[0]} (last ${snapshot.selectedMetric[1].length})` : 'Chart'}
          </Text>
          <Text>{snapshot.chart}</Text>
        </Box>
      </Box>
    </Box>
  );
}

export async function runMonitor(options: MonitorOptions): Promise<void> {
  const app = render(<MonitorApp options={options} />);
  await app.waitUntilExit();
}
