export interface Config {
  vault?: string;
  cliPath: string;
}

export function loadConfig(): Config {
  return {
    vault: process.env.OBSIDIAN_VAULT,
    cliPath: process.env.OBSIDIAN_CLI_PATH ?? "obsidian",
  };
}
