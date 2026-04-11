declare module '@netofings/agent' {
  export type MetricValue = string | number | boolean | null;

  export interface AgentDescriptor {
    uuid: string;
    username: string;
    name: string;
    hostname: string;
    pid: number;
  }

  export interface ConnectedPayload {
    agent: AgentDescriptor;
  }

  export interface DisconnectedPayload {
    agent: AgentDescriptor;
  }

  export interface MetricPayload {
    type: string;
    value: MetricValue;
  }

  export interface AgentMessagePayload {
    agent: AgentDescriptor;
    metrics: MetricPayload[];
    timestamp: number;
  }

  export interface AgentOptions {
    name?: string;
    username?: string;
    interval?: number;
    mqtt?: {
      host?: string;
    };
  }

  class NetofingsAgent {
    constructor(opts?: AgentOptions);
    connect(): void;
    disconnect(): void;
    on(event: 'agent/connected', handler: (payload: ConnectedPayload) => void): this;
    on(event: 'agent/disconnected', handler: (payload: DisconnectedPayload) => void): this;
    on(event: 'agent/message', handler: (payload: AgentMessagePayload) => void): this;
  }

  export = NetofingsAgent;
}
