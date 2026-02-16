import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse, errorResponse, buildFileOrPath } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_properties",
    "Manage frontmatter properties on Obsidian notes. Use 'list' to see all properties (optionally for a specific file/path). Use 'read' to get a property value, 'set' to create/update a property, and 'remove' to delete a property. The 'property' param is required for read/set/remove; 'value' is required for set.",
    {
      action: z
        .enum(["list", "read", "set", "remove"])
        .describe("The property operation to perform"),
      file: z
        .string()
        .optional()
        .describe("Vault-relative file path to target"),
      path: z
        .string()
        .optional()
        .describe("Vault-relative folder path to scope the operation"),
      property: z
        .string()
        .optional()
        .describe("Property name (required for read, set, remove)"),
      value: z
        .string()
        .optional()
        .describe("Property value to set (required for 'set' action)"),
    },
    async ({ action, file, path, property, value }) => {
      const fileOrPath = buildFileOrPath(file, path);
      const params =
        Object.keys(fileOrPath).length > 0 ? fileOrPath : undefined;

      let result;

      switch (action) {
        case "list":
          result = await cli.exec("properties", params);
          break;
        case "read":
          if (!property)
            return errorResponse("'property' is required for 'read' action");
          result = await cli.exec("property:read", { property, ...fileOrPath });
          break;
        case "set":
          if (!property)
            return errorResponse("'property' is required for 'set' action");
          if (!value)
            return errorResponse("'value' is required for 'set' action");
          result = await cli.exec("property:set", {
            property,
            value,
            ...fileOrPath,
          });
          break;
        case "remove":
          if (!property)
            return errorResponse("'property' is required for 'remove' action");
          result = await cli.exec("property:remove", {
            property,
            ...fileOrPath,
          });
          break;
      }

      return cliResponse(result);
    },
  );
}
