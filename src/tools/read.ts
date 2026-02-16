import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_read",
    "Read the content of a file in the Obsidian vault. Provide either a file name or a path relative to the vault root.",
    {
      file: z.string().optional().describe("File name to read (e.g. 'My Note')"),
      path: z
        .string()
        .optional()
        .describe("Path to the file relative to vault root (e.g. 'folder/My Note.md')"),
    },
    async ({ file, path }) => {
      const params: Record<string, string> = {};
      if (file) params.file = file;
      if (path) params.path = path;

      const result = await cli.exec("read", params);

      if (result.exitCode !== 0) {
        return { content: [{ type: "text", text: result.stderr || result.stdout }], isError: true };
      }

      return { content: [{ type: "text", text: result.stdout }] };
    },
  );
}
