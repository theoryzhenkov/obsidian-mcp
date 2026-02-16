import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_command",
    "Execute an arbitrary Obsidian command by its command ID. This provides access to any registered Obsidian command, including those from core features and community plugins.",
    {
      id: z
        .string()
        .describe(
          "The command ID to execute (e.g. 'editor:toggle-bold', 'app:reload')",
        ),
    },
    async ({ id }) => {
      const result = await cli.exec("command", { id });
      return cliResponse(result);
    },
  );
}
