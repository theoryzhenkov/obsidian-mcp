import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_files",
    "List files and folders in the Obsidian vault, or get detailed info about a specific file or folder. Use 'list_files' / 'list_folders' to browse the vault structure (optionally scoped to a path). Use 'file_info' / 'folder_info' to inspect a specific item (requires 'path').",
    {
      action: z
        .enum(["list_files", "list_folders", "file_info", "folder_info"])
        .describe("The operation to perform"),
      path: z
        .string()
        .optional()
        .describe("Vault-relative path. Required for 'file_info' and 'folder_info'; optional filter for list operations"),
    },
    async ({ action, path }) => {
      let result;

      switch (action) {
        case "list_files":
          result = await cli.exec("files", path ? { path } : undefined);
          break;
        case "list_folders":
          result = await cli.exec("folders", path ? { path } : undefined);
          break;
        case "file_info":
          result = await cli.exec("file", path ? { path } : undefined);
          break;
        case "folder_info":
          result = await cli.exec("folder", path ? { path } : undefined);
          break;
      }

      if (result.exitCode !== 0) {
        return { content: [{ type: "text" as const, text: result.stderr || result.stdout }], isError: true };
      }

      return { content: [{ type: "text" as const, text: result.stdout }] };
    },
  );
}
