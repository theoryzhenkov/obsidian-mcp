import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_links",
    "Analyze links in the Obsidian vault. Use 'backlinks' to find all notes linking to a given file. Use 'outgoing' to list all links from a given file. Use 'unresolved' to find broken/unresolved links across the vault. Use 'orphans' to find notes with no incoming links. Use 'deadends' to find notes with no outgoing links.",
    {
      action: z
        .enum(["backlinks", "outgoing", "unresolved", "orphans", "deadends"])
        .describe("The link analysis operation to perform"),
      file: z
        .string()
        .optional()
        .describe("File name to analyze (e.g. 'My Note'). Required for 'backlinks' and 'outgoing'"),
      path: z
        .string()
        .optional()
        .describe("Vault-relative path to analyze (e.g. 'folder/My Note.md'). Required for 'backlinks' and 'outgoing'"),
    },
    async ({ action, file, path }) => {
      let result;

      const fileOrPath: Record<string, string> = {};
      if (file) fileOrPath.file = file;
      if (path) fileOrPath.path = path;

      switch (action) {
        case "backlinks":
          result = await cli.exec("backlinks", fileOrPath);
          break;
        case "outgoing":
          result = await cli.exec("links", fileOrPath);
          break;
        case "unresolved":
          result = await cli.exec("unresolved");
          break;
        case "orphans":
          result = await cli.exec("orphans");
          break;
        case "deadends":
          result = await cli.exec("deadends");
          break;
      }

      if (result.exitCode !== 0) {
        return { content: [{ type: "text" as const, text: result.stderr || result.stdout }], isError: true };
      }

      return { content: [{ type: "text" as const, text: result.stdout }] };
    },
  );
}
