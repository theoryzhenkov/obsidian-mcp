import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_manage_file",
    "Move or delete a file in the Obsidian vault. For move operations, provide a destination path.",
    {
      action: z.enum(["move", "delete"]).describe("Whether to move or delete the file"),
      file: z.string().optional().describe("File name to manage (e.g. 'My Note')"),
      path: z
        .string()
        .optional()
        .describe("Path to the file relative to vault root (e.g. 'folder/My Note.md')"),
      to: z
        .string()
        .optional()
        .describe("Destination path for the move operation (e.g. 'new-folder/My Note.md')"),
    },
    async ({ action, file, path, to }) => {
      const fileOrPath: Record<string, string> = {};
      if (file) fileOrPath.file = file;
      if (path) fileOrPath.path = path;

      if (action === "move") {
        const result = await cli.exec("move", { ...fileOrPath, to: to! });

        if (result.exitCode !== 0) {
          return {
            content: [{ type: "text", text: result.stderr || result.stdout }],
            isError: true,
          };
        }

        return { content: [{ type: "text", text: result.stdout }] };
      }

      const result = await cli.exec("delete", fileOrPath);

      if (result.exitCode !== 0) {
        return { content: [{ type: "text", text: result.stderr || result.stdout }], isError: true };
      }

      return { content: [{ type: "text", text: result.stdout }] };
    },
  );
}
