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
    "obsidian_write",
    "Write or replace the full content of a file in the Obsidian vault. If the file exists, its content is completely replaced. If the file does not exist, it is created. Use this for full content replacement — for partial modifications, read the file first, modify the content, then write it back.",
    {
      ...fileOrPathSchema,
      content: z.string().describe("The full content to write to the file"),
    },
    async ({ file, path, content }) => {
      if (!file && !path) {
        return errorResponse("Either 'file' or 'path' is required");
      }

      const params: Record<string, string> = {
        ...buildFileOrPath(file, path),
        content,
      };

      const result = await cli.exec("create", params, ["--overwrite"]);
      return cliResponse(result);
    },
  );
}
