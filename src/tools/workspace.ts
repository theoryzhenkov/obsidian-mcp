import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse, errorResponse } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_workspace",
    "Manage Obsidian workspaces and tab layouts. Use 'list' to see all saved workspaces. Use 'open' to switch to a saved workspace. Use 'save' to save the current workspace layout under a name.",
    {
      action: z
        .enum(["list", "open", "save"])
        .describe("The workspace operation to perform"),
      name: z
        .string()
        .optional()
        .describe("Workspace name. Required for 'open' and 'save' actions"),
    },
    async ({ action, name }) => {
      if (action !== "list" && !name) {
        return errorResponse(`'name' is required for '${action}' action`);
      }

      let result;

      switch (action) {
        case "list":
          result = await cli.exec("workspaces");
          break;
        case "open":
          result = await cli.exec("workspace:open", { name: name! });
          break;
        case "save":
          result = await cli.exec("workspace:save", { name: name! });
          break;
      }

      return cliResponse(result);
    },
  );
}
