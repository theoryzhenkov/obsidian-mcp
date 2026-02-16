import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_vault",
    "Retrieve Obsidian vault information or list all available vaults. Use 'info' to get details about the current vault (name, path, stats). Use 'list' to enumerate all vaults known to Obsidian.",
    {
      action: z
        .enum(["info", "list"])
        .describe(
          "'info' returns current vault details; 'list' returns all available vaults",
        ),
    },
    async ({ action }) => {
      const result = await cli.exec(action === "info" ? "vault" : "vaults");
      return cliResponse(result);
    },
  );
}
