import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse, fileOrPathSchema, buildFileOrPath } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_links",
    "Analyze links in the Obsidian vault. Use 'backlinks' to find all notes linking to a given file. Use 'outgoing' to list all links from a given file. Use 'unresolved' to find broken/unresolved links across the vault. Use 'orphans' to find notes with no incoming links. Use 'deadends' to find notes with no outgoing links.",
    {
      action: z
        .enum(["backlinks", "outgoing", "unresolved", "orphans", "deadends"])
        .describe("The link analysis operation to perform"),
      ...fileOrPathSchema,
    },
    async ({ action, file, path }) => {
      const fileOrPath = buildFileOrPath(file, path);

      switch (action) {
        case "backlinks":
          return cliResponse(await cli.exec("backlinks", fileOrPath));
        case "outgoing":
          return cliResponse(await cli.exec("links", fileOrPath));
        case "unresolved":
          return cliResponse(await cli.exec("unresolved"));
        case "orphans":
          return cliResponse(await cli.exec("orphans"));
        case "deadends":
          return cliResponse(await cli.exec("deadends"));
      }
    },
  );
}
