import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_create",
    "Create a new file in the Obsidian vault. Optionally provide content, a template, or overwrite an existing file.",
    {
      name: z
        .string()
        .optional()
        .describe("Name for the new file (e.g. 'My Note')"),
      path: z
        .string()
        .optional()
        .describe(
          "Path for the new file relative to vault root (e.g. 'folder/My Note.md')",
        ),
      content: z.string().optional().describe("Initial content for the file"),
      template: z
        .string()
        .optional()
        .describe("Name of an Obsidian template to apply to the new file"),
      overwrite: z
        .boolean()
        .optional()
        .describe("If true, overwrite the file if it already exists"),
    },
    async ({ name, path, content, template, overwrite }) => {
      const params: Record<string, string> = {};
      if (name) params.name = name;
      if (path) params.path = path;
      if (content) params.content = content;
      if (template) params.template = template;

      const flags: string[] = [];
      if (overwrite) flags.push("--overwrite");

      const result = await cli.exec("create", params, flags);
      return cliResponse(result);
    },
  );
}
