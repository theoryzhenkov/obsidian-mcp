import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_properties",
    "Manage frontmatter properties on Obsidian notes. Use 'list' to see all properties (optionally for a specific file/path). Use 'read' to get a property value, 'set' to create/update a property, and 'remove' to delete a property. The 'property' param is required for read/set/remove; 'value' is required for set.",
    {
      action: z
        .enum(["list", "read", "set", "remove"])
        .describe("The property operation to perform"),
      file: z.string().optional().describe("Vault-relative file path to target"),
      path: z.string().optional().describe("Vault-relative folder path to scope the operation"),
      property: z.string().optional().describe("Property name (required for read, set, remove)"),
      value: z.string().optional().describe("Property value to set (required for 'set' action)"),
    },
    async ({ action, file, path, property, value }) => {
      const optionalFileOrPath: Record<string, string> = {};
      if (file) {
        optionalFileOrPath.file = file;
      }
      if (path) {
        optionalFileOrPath.path = path;
      }

      const params = Object.keys(optionalFileOrPath).length > 0 ? optionalFileOrPath : undefined;

      let result;

      switch (action) {
        case "list":
          result = await cli.exec("properties", params);
          break;
        case "read":
          result = await cli.exec("property:read", { property: property!, ...optionalFileOrPath });
          break;
        case "set":
          result = await cli.exec("property:set", { property: property!, value: value!, ...optionalFileOrPath });
          break;
        case "remove":
          result = await cli.exec("property:remove", { property: property!, ...optionalFileOrPath });
          break;
      }

      if (result.exitCode !== 0) {
        return { content: [{ type: "text" as const, text: result.stderr || result.stdout }], isError: true };
      }

      return { content: [{ type: "text" as const, text: result.stdout }] };
    },
  );
}
