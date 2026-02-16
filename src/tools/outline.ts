import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse, fileOrPathSchema, buildFileOrPath } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_outline",
    "Get the heading structure and outline of an Obsidian vault file. Returns the hierarchical list of headings, useful for understanding document structure before reading specific sections.",
    {
      ...fileOrPathSchema,
      format: z
        .enum(["text", "json"])
        .optional()
        .describe("Output format: 'text' (default) or 'json'"),
    },
    async ({ file, path, format }) => {
      const params = buildFileOrPath(file, path);
      if (format) params.format = format;

      const result = await cli.exec("outline", params);
      return cliResponse(result);
    },
  );
}
