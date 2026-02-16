import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse, errorResponse } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_daily",
    "Interact with today's daily note in the Obsidian vault. Read the daily note, or append/prepend content to it.",
    {
      action: z
        .enum(["read", "append", "prepend"])
        .describe("Action to perform on the daily note"),
      content: z
        .string()
        .optional()
        .describe(
          "Content to append or prepend (required for append/prepend actions)",
        ),
      inline: z
        .boolean()
        .optional()
        .describe(
          "If true, insert content inline without adding a newline separator",
        ),
    },
    async ({ action, content, inline }) => {
      if (action === "read") {
        const result = await cli.exec("daily:read");
        return cliResponse(result);
      }

      if (!content) {
        return errorResponse(`'content' is required for '${action}' action`);
      }

      const flags: string[] = [];
      if (inline) flags.push("--inline");

      const command = action === "append" ? "daily:append" : "daily:prepend";
      const result = await cli.exec(command, { content }, flags);
      return cliResponse(result);
    },
  );
}
