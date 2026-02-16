import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";

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
        .describe("Content to append or prepend (required for append/prepend actions)"),
      inline: z
        .boolean()
        .optional()
        .describe("If true, insert content inline without adding a newline separator"),
    },
    async ({ action, content, inline }) => {
      const flags: string[] = [];
      if (inline) flags.push("--inline");

      let result;

      if (action === "read") {
        result = await cli.exec("daily:read");
      } else {
        const params: Record<string, string> = { content: content! };
        const command = action === "append" ? "daily:append" : "daily:prepend";
        result = await cli.exec(command, params, flags);
      }

      if (result.exitCode !== 0) {
        return { content: [{ type: "text", text: result.stderr || result.stdout }], isError: true };
      }

      return { content: [{ type: "text", text: result.stdout }] };
    },
  );
}
