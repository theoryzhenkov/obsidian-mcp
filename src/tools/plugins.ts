import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_plugins",
    "Manage Obsidian community plugins. Use 'list' to see all installed plugins. Use 'info' to get details about a specific plugin. Use 'enable'/'disable' to toggle a plugin. Use 'install'/'uninstall' to add or remove a plugin.",
    {
      action: z
        .enum(["list", "info", "enable", "disable", "install", "uninstall"])
        .describe("The plugin management operation to perform"),
      plugin: z
        .string()
        .optional()
        .describe("Plugin ID. Required for all actions except 'list'"),
    },
    async ({ action, plugin }) => {
      let result;

      switch (action) {
        case "list":
          result = await cli.exec("plugins");
          break;
        case "info":
          result = await cli.exec("plugin", { plugin: plugin! });
          break;
        case "enable":
          result = await cli.exec("plugin:enable", { plugin: plugin! });
          break;
        case "disable":
          result = await cli.exec("plugin:disable", { plugin: plugin! });
          break;
        case "install":
          result = await cli.exec("plugin:install", { plugin: plugin! });
          break;
        case "uninstall":
          result = await cli.exec("plugin:uninstall", { plugin: plugin! });
          break;
      }

      if (result.exitCode !== 0) {
        return { content: [{ type: "text" as const, text: result.stderr || result.stdout }], isError: true };
      }

      return { content: [{ type: "text" as const, text: result.stdout }] };
    },
  );
}
