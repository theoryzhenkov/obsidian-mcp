import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_bookmarks",
    "List all bookmarked items in the Obsidian vault.",
    {},
    async () => {
      const result = await cli.exec("bookmarks");
      return cliResponse(result);
    },
  );
}
