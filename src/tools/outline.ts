import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_outline",
    "Get the heading structure and outline of an Obsidian vault file. Returns the hierarchical list of headings, useful for understanding document structure before reading specific sections.",
    {
      file: z
        .string()
        .optional()
        .describe("File name to outline (e.g. 'My Note')"),
      path: z
        .string()
        .optional()
        .describe("Vault-relative path to the file (e.g. 'folder/My Note.md')"),
      format: z
        .enum(["text", "json"])
        .optional()
        .describe("Output format: 'text' (default) or 'json'"),
    },
    async ({ file, path, format }) => {
      const params: Record<string, string> = {};
      if (file) params.file = file;
      if (path) params.path = path;
      if (format) params.format = format;

      const result = await cli.exec("outline", params);

      if (result.exitCode !== 0) {
        return { content: [{ type: "text" as const, text: result.stderr || result.stdout }], isError: true };
      }

      return { content: [{ type: "text" as const, text: result.stdout }] };
    },
  );
}
