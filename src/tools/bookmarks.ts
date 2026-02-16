import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_bookmarks",
    "Manage Obsidian bookmarks. Use 'list' to retrieve all bookmarked items in the vault.",
    {
      action: z
        .enum(["list"])
        .describe("The bookmark operation to perform. Currently supports 'list'"),
    },
    async ({ action }) => {
      let result;

      switch (action) {
        case "list":
          result = await cli.exec("bookmarks");
          break;
      }

      if (result.exitCode !== 0) {
        return { content: [{ type: "text" as const, text: result.stderr || result.stdout }], isError: true };
      }

      return { content: [{ type: "text" as const, text: result.stdout }] };
    },
  );
}
