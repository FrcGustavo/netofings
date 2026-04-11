import { runCli } from './cli';

runCli().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`netofings: ${message}`);
  process.exitCode = 1;
});
