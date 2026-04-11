import { Command } from 'commander';
import { z } from 'zod';
import { monitorOptionsSchema, runMonitor } from './commands/monitor';

const rawMonitorSchema = z.object({
  host: z.string().min(1),
  interval: z.coerce.number().int().positive(),
});

function assertValidMonitorOptions(input: unknown) {
  const parsed = rawMonitorSchema.safeParse(input);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
    throw new Error(`Invalid monitor options (${details})`);
  }

  return monitorOptionsSchema.parse(parsed.data);
}

export async function runCli(argv: string[] = process.argv): Promise<void> {
  const program = new Command();

  program
    .name('netofings')
    .description('Modern CLI client for Netofings')
    .version('0.1.0');

  program
    .command('monitor')
    .description('Watch connected agents and their metrics in real time')
    .option('--host <url>', 'MQTT broker host', 'mqtt://localhost')
    .option('--interval <ms>', 'Sampling interval in milliseconds', '5000')
    .action(async (rawOptions: { host: string; interval: string }) => {
      const options = assertValidMonitorOptions(rawOptions);
      await runMonitor(options);
    });

  await program.parseAsync(argv);
}
