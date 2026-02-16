import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_search",
    "Search the Obsidian vault content using a text query. Supports scoping to a path, limiting results, choosing output format, including match context, and case-sensitive matching.",
    {
      query: z.string().describe("The search query string"),
      path: z.string().optional().describe("Vault-relative path to scope the search to"),
      limit: z.number().optional().describe("Maximum number of results to return"),
      format: z.enum(["text", "json"]).optional().describe("Output format: 'text' (default) or 'json'"),
      matches: z.boolean().optional().describe("If true, include matching line context in results"),
      case_sensitive: z.boolean().optional().describe("If true, perform case-sensitive search"),
    },
    async ({ query, path, limit, format, matches, case_sensitive }) => {
      const params: Record<string, string> = { query };

      if (path) {
        params.path = path;
      }

      if (limit !== undefined) {
        params.limit = String(limit);
      }

      if (format) {
        params.format = format;
      }

      const flags: string[] = [];

      if (matches) {
        flags.push("--matches");
      }

      if (case_sensitive) {
        flags.push("--case");
      }

      const result = await cli.exec("search", params, flags.length > 0 ? flags : undefined);

      if (result.exitCode !== 0) {
        return { content: [{ type: "text" as const, text: result.stderr || result.stdout }], isError: true };
      }

      return { content: [{ type: "text" as const, text: result.stdout }] };
    },
  );
}
