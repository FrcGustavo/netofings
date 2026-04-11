# @netofings/cli

Terminal client for Netofings with real-time monitoring.

## Available command

- `netofings monitor --host mqtt://localhost --interval 5000`

`monitor` subscribes to agent events and displays metrics as an interactive TUI.

## Controls (monitor)

- `q` or `esc`: exit
- `left` and `right`: move across agents
- `up` and `down`: move across metrics

## Local development

From repository root:

```bash
npm run build --workspace=@netofings/cli
npm run dev --workspace=@netofings/cli
```

From this folder:

```bash
npm run build
npm run dev
```

## Development

```bash
npm run build
npm run test
npm run typecheck
```

## Notes

- Built with `commander`, `ink`, and `asciichart`.
- Output binary is `dist/bin.js`.
- Running `npm run dev` without a subcommand prints help.
