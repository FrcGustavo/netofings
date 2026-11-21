# @netofings/cli

Terminal client for Netofings with real-time monitoring.

## Available command

- `netofings monitor --host mqtt://localhost --interval 5000`

`monitor` subscribes to agent events and displays metrics as an interactive TUI. Export `NETOFINGS_AGENT_TOKEN` with a valid agent token to connect to the broker.

## Controls (monitor)

- `q` or `esc`: exit
- `left` and `right`: move across agents
- `up` and `down`: move across metrics

## Local development

From repository root:

```bash
make cli ARGS='--help'
make cli ARGS='monitor'
```

From this directory, `make up ARGS='monitor'` runs the same Docker command. To use Node.js on the host:

```bash
make install
make dev ARGS='monitor'
```

## Development

```bash
make build
make test
npm run typecheck
```

## Notes

- Built with `commander`, `ink`, and `asciichart`.
- Output binary is `dist/bin.js`.
- Running `make dev` without arguments prints help. Pass CLI arguments with `make dev ARGS='--help'`.
