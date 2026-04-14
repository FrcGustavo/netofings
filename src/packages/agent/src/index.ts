import os from "node:os";
import EventEmitter from "node:events";
import util from "node:util";
import mqtt, { type MqttClient } from "mqtt";
import { parsePayload } from "./utils";

type NetofingsAgentProps = {
  username: string;
  token: string;
  name: string;
  interval: number;
  host: string;
};

type MetricValue = number | string | boolean | null;

type MetricCallback = (error: Error | null, value: MetricValue) => void;
type MetricFunction = () => MetricValue | Promise<MetricValue>;
type CallbackMetricFunction = (callback: MetricCallback) => void;
type NormalizedMetricFunction = () => Promise<MetricValue>;

type Message = {
  agent: {
    username: string;
    name: string;
    hostname: string;
    pid: number;
  };
  metrics: {
    type: string;
    value: MetricValue;
  }[];
  timestamp: number;
};

class NetofingsAgent extends EventEmitter {
  private options: NetofingsAgentProps;
  private started: boolean;
  private client: MqttClient | null;
  private timer: NodeJS.Timeout | null;
  metrics: Map<string, NormalizedMetricFunction>;

  constructor(props: NetofingsAgentProps) {
    super();
    this.options = {
      username: props.username,
      token: props.token,
      name: props.name,
      interval: props.interval,
      host: props.host,
    };
    this.started = false;
    this.client = null;
    this.timer = null;
    this.metrics = new Map();
  }

  private normalizeMetricFn = (
    fn: MetricFunction | CallbackMetricFunction,
  ): NormalizedMetricFunction => {
    if (fn.length === 1) {
      return util.promisify(
        fn as CallbackMetricFunction,
      ) as NormalizedMetricFunction;
    }

    return () => Promise.resolve((fn as MetricFunction)());
  };

  addMetric(type: string, fn: MetricFunction | CallbackMetricFunction) {
    this.metrics.set(type, this.normalizeMetricFn(fn));
  }

  removeMetric(type: string) {
    this.metrics.delete(type);
  }

  connect() {
    if (!this.started) {
      this.client = mqtt.connect(this.options.host, {
        username: this.options.username,
        password: this.options.token,
      });
      this.started = true;

      this.client.subscribe("agent/message");
      this.client.subscribe("agent/connected");
      this.client.subscribe("agent/disconnected");

      this.client.on("connect", () => {
        this.emit("connect");

        this.timer = setInterval(async () => {
          if (this.metrics.size > 0) {
            const message: Message = {
              agent: {
                username: this.options.username,
                name: this.options.name,
                hostname: os.hostname(),
                pid: process.pid,
              },
              metrics: [],
              timestamp: new Date().getTime(),
            };

            for (const [type, fn] of this.metrics) {
              const value = await Promise.resolve(fn());
              message.metrics.push({ type, value });
            }

            this.client?.publish("agent/message", JSON.stringify(message));
            this.emit("agent/message", message);
          }
        }, this.options.interval);
      });

      this.client.on("message", (topic, payload) => {
        const parsedPayload = parsePayload(payload);
        let broadcast = false;

        switch (topic) {
          case "agent/connected":
          case "agent/disconnected":
          case "agent/message":
            broadcast = Boolean(parsedPayload && parsedPayload.agent);
            break;
        }

        if (broadcast) {
          this.emit(topic, parsedPayload);
        }
      });

      this.client?.on("error", () => this.disconnect());
    }
  }

  disconnect() {
    if (this.started) {
      clearInterval(this.timer as NodeJS.Timeout);
      this.started = false;
      this.emit("disconnect");
      this.client?.end();
    }
  }
}

export default NetofingsAgent;
