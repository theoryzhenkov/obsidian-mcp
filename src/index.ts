import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { ObsidianCLI } from "./cli.js";
import { registerAllTools } from "./tools/index.js";
import { registerResources } from "./resources/vault.js";

const config = loadConfig();
const cli = new ObsidianCLI(config);

const server = new McpServer({
  name: "obsidian-mcp",
  version: "0.1.0",
});

registerAllTools(server, cli);
registerResources(server, cli);

const transport = new StdioServerTransport();
await server.connect(transport);
