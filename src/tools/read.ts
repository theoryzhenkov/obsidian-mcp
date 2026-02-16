import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse, fileOrPathSchema, buildFileOrPath } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_read",
    "Read the content of a file in the Obsidian vault. Provide either a file name or a path relative to the vault root.",
    fileOrPathSchema,
    async ({ file, path }) => {
      const params = buildFileOrPath(file, path);
      const result = await cli.exec("read", params);
      return cliResponse(result);
    },
  );
}
