import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse, fileOrPathSchema, buildFileOrPath } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_edit",
    "Append or prepend content to an existing file in the Obsidian vault. Use 'inline' to insert without adding a newline separator.",
    {
      action: z
        .enum(["append", "prepend"])
        .describe("Whether to append or prepend the content"),
      ...fileOrPathSchema,
      content: z.string().describe("Content to append or prepend to the file"),
      inline: z
        .boolean()
        .optional()
        .describe(
          "If true, insert content inline without adding a newline separator",
        ),
    },
    async ({ action, file, path, content, inline }) => {
      const params: Record<string, string> = {
        ...buildFileOrPath(file, path),
        content,
      };

      const flags: string[] = [];
      if (inline) flags.push("--inline");

      const command = action === "append" ? "append" : "prepend";
      const result = await cli.exec(command, params, flags);
      return cliResponse(result);
    },
  );
}
