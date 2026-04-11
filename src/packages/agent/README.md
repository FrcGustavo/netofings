# @netofings/agent

Reusable agent package that collects host metrics and publishes them through MQTT.

## What it does

- Connects to an MQTT broker.
- Registers metric functions (`addMetric`).
- Sends periodic `agent/message` payloads with metric values.
- Emits broker events like `agent/connected`, `agent/disconnected`, and `agent/message`.

## Installation

Inside the monorepo this package is consumed as a workspace dependency.

If needed as standalone package:

```bash
npm install @netofings/agent
```

## Quick example

```ts
import NetofingsAgent from '@netofings/agent';

const agent = new NetofingsAgent({
	id: 'my-agent-id',
	username: 'my-user',
	name: 'My Agent',
	interval: 5000,
	host: 'mqtt://localhost',
});

agent.addMetric('cpu', () => 12.3);
agent.connect();
```

## Included example

The example at `examples/index.ts` publishes:

- `cpu` (% usage)
- `memory` (% usage)
- `network` (throughput in Mbps)

Run it with:

```bash
npm run example --workspace=@netofings/agent
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm run lint`
- `npm run format`
- `npm run format:check`

## Notes

- Package format is ESM.
- Main entrypoint is `dist/index.js`.
