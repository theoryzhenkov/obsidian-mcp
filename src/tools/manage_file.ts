import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import {
  cliResponse,
  errorResponse,
  fileOrPathSchema,
  buildFileOrPath,
} from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_manage_file",
    "Move or delete a file in the Obsidian vault. For move operations, provide a destination path.",
    {
      action: z
        .enum(["move", "delete"])
        .describe("Whether to move or delete the file"),
      ...fileOrPathSchema,
      to: z
        .string()
        .optional()
        .describe(
          "Destination path for the move operation (e.g. 'new-folder/My Note.md')",
        ),
    },
    async ({ action, file, path, to }) => {
      const fileOrPath = buildFileOrPath(file, path);

      if (action === "move") {
        if (!to) {
          return errorResponse("'to' is required for 'move' action");
        }
        const result = await cli.exec("move", { ...fileOrPath, to });
        return cliResponse(result);
      }

      const result = await cli.exec("delete", fileOrPath);
      return cliResponse(result);
    },
  );
}
