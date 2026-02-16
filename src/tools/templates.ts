import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse, errorResponse } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_templates",
    "Manage Obsidian vault templates. Use 'list' to enumerate all available templates. Use 'read' to get the content of a specific template by name.",
    {
      action: z
        .enum(["list", "read"])
        .describe(
          "'list' returns all available templates; 'read' returns the content of a specific template",
        ),
      name: z
        .string()
        .optional()
        .describe("Template name. Required for 'read' action"),
    },
    async ({ action, name }) => {
      let result;

      switch (action) {
        case "list":
          result = await cli.exec("templates");
          break;
        case "read":
          if (!name)
            return errorResponse("'name' is required for 'read' action");
          result = await cli.exec("template:read", { name });
          break;
      }

      return cliResponse(result);
    },
  );
}
