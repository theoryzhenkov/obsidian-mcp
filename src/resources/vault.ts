import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ObsidianCLI } from "../cli.js";

export function registerResources(server: McpServer, cli: ObsidianCLI): void {
  const template = new ResourceTemplate("obsidian://vault/{path}", {
    list: async () => {
      const result = await cli.exec("files");
      if (result.exitCode !== 0) return { resources: [] };

      const files = result.stdout.trim().split("\n").filter(Boolean);
      return {
        resources: files.map((f) => ({
          uri: `obsidian://vault/${f}`,
          name: f,
          mimeType: "text/markdown",
        })),
      };
    },
  });

  server.resource(
    "vault-file",
    template,
    { description: "Read a file from the Obsidian vault by path" },
    async (uri, variables) => {
      const path = variables.path as string;
      const result = await cli.exec("read", { path });

      if (result.exitCode !== 0) {
        throw new Error(result.stderr || result.stdout);
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: result.stdout,
          },
        ],
      };
    },
  );
}
