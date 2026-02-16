import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse } from "../helpers.js";

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
        .describe(
          "Vault-relative path. Required for 'file_info' and 'folder_info'; optional filter for list operations",
        ),
    },
    async ({ action, path }) => {
      const commandMap = {
        list_files: "files",
        list_folders: "folders",
        file_info: "file",
        folder_info: "folder",
      } as const;

      const result = await cli.exec(
        commandMap[action],
        path ? { path } : undefined,
      );
      return cliResponse(result);
    },
  );
}
