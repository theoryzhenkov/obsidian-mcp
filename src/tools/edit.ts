import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_edit",
    "Append or prepend content to an existing file in the Obsidian vault. Use 'inline' to insert without adding a newline separator.",
    {
      action: z.enum(["append", "prepend"]).describe("Whether to append or prepend the content"),
      file: z.string().optional().describe("File name to edit (e.g. 'My Note')"),
      path: z
        .string()
        .optional()
        .describe("Path to the file relative to vault root (e.g. 'folder/My Note.md')"),
      content: z.string().describe("Content to append or prepend to the file"),
      inline: z
        .boolean()
        .optional()
        .describe("If true, insert content inline without adding a newline separator"),
    },
    async ({ action, file, path, content, inline }) => {
      const params: Record<string, string> = { content };
      if (file) params.file = file;
      if (path) params.path = path;

      const flags: string[] = [];
      if (inline) flags.push("--inline");

      const command = action === "append" ? "append" : "prepend";
      const result = await cli.exec(command, params, flags);

      if (result.exitCode !== 0) {
        return { content: [{ type: "text", text: result.stderr || result.stdout }], isError: true };
      }

      return { content: [{ type: "text", text: result.stdout }] };
    },
  );
}
