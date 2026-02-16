import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse, errorResponse } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_tags",
    "Query tags in the Obsidian vault. Use 'list' to get all tags with their usage counts. Use 'get' to find all notes tagged with a specific tag (requires 'tag' parameter).",
    {
      action: z
        .enum(["list", "get"])
        .describe(
          "'list' returns all tags; 'get' returns notes for a specific tag",
        ),
      tag: z
        .string()
        .optional()
        .describe("The tag to look up (required when action is 'get')"),
    },
    async ({ action, tag }) => {
      let result;

      switch (action) {
        case "list":
          result = await cli.exec("tags");
          break;
        case "get":
          if (!tag) return errorResponse("'tag' is required for 'get' action");
          result = await cli.exec("tag", { tag });
          break;
      }

      return cliResponse(result);
    },
  );
}
