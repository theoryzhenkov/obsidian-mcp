import type { Config } from "./config.js";

export interface CLIResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class ObsidianCLI {
  private readonly vault?: string;
  private readonly cliPath: string;

  constructor(config: Config) {
    this.vault = config.vault;
    this.cliPath = config.cliPath;
  }

  async exec(
    command: string,
    params?: Record<string, string>,
    flags?: string[],
  ): Promise<CLIResult> {
    const args: string[] = [];

    if (this.vault) {
      args.push(`vault=${this.vault}`);
    }

    args.push(command);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        args.push(`${key}=${value}`);
      }
    }

    if (flags) {
      args.push(...flags);
    }

    const proc = Bun.spawn([this.cliPath, ...args], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);

    const exitCode = await proc.exited;

    return { stdout, stderr, exitCode };
  }

  async execJSON<T>(
    command: string,
    params?: Record<string, string>,
    flags?: string[],
  ): Promise<T> {
    const allFlags = [...(flags ?? []), "--json"];
    const result = await this.exec(command, params, allFlags);

    if (result.exitCode !== 0) {
      throw new Error(
        `CLI command '${command}' failed (exit ${result.exitCode}): ${result.stderr || result.stdout}`,
      );
    }

    return JSON.parse(result.stdout) as T;
  }
}
