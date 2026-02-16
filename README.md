# Obsidian MCP Server

[![npm version](https://badge.fury.io/js/obsidian-mcp.svg)](https://www.npmjs.com/package/obsidian-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that provides AI agents with read/write access to Obsidian vaults through the official Obsidian CLI (v1.12+).

## Features

- **19 MCP Tools** covering vault management, file operations, search, tags, properties, tasks, links, templates, plugins, and more
- **Resource Templates** for browsing vault files as MCP resources
- **Type-safe** TypeScript implementation with Zod validation
- **Shared helpers** eliminating boilerplate across tools
- **Validation guards** preventing runtime errors from missing parameters

## Prerequisites

- [Obsidian](https://obsidian.md/) desktop app v1.12 or later (must be running)
- [Bun](https://bun.sh/) runtime
- [Claude Code](https://code.claude.com/) or another MCP-compatible client

## Installation

### Global Installation (Recommended)

```bash
claude mcp add obsidian-mcp --scope user -- bun run /path/to/obsidian-mcp/src/index.ts
```

With a specific vault:

```bash
claude mcp add obsidian-mcp --scope user \
  --env OBSIDIAN_VAULT=YourVaultName \
  -- bun run /path/to/obsidian-mcp/src/index.ts
```

### Local Development

```bash
git clone https://github.com/yourusername/obsidian-mcp.git
cd obsidian-mcp
bun install
bun run src/index.ts
```

## Configuration

Set these environment variables to customize behavior:

- `OBSIDIAN_VAULT` — Default vault name (optional, uses active vault if unset)
- `OBSIDIAN_CLI_PATH` — Path to `obsidian` binary (defaults to `"obsidian"`)

## Available Tools

### Vault Management

- `obsidian_vault` — Get vault info or list all vaults

### File Operations

- `obsidian_files` — List files/folders or get info on specific items
- `obsidian_read` — Read file content
- `obsidian_write` — Write or replace full file content
- `obsidian_create` — Create new file with optional template
- `obsidian_edit` — Append or prepend content
- `obsidian_manage_file` — Move or delete files

### Search & Discovery

- `obsidian_search` — Full-text search with filters
- `obsidian_tags` — List tags or find notes by tag
- `obsidian_links` — Analyze backlinks, outgoing links, orphans, unresolved links, deadends

### Metadata & Structure

- `obsidian_properties` — CRUD operations on frontmatter properties
- `obsidian_outline` — Get heading structure of a note
- `obsidian_tasks` — List or update tasks

### Daily Notes & Templates

- `obsidian_daily` — Read or modify today's daily note
- `obsidian_templates` — List or read templates

### Vault Features

- `obsidian_bookmarks` — List bookmarked items
- `obsidian_plugins` — Manage community plugins
- `obsidian_workspace` — Manage workspace layouts
- `obsidian_command` — Run arbitrary Obsidian commands

## Usage Examples

### Read a note

```typescript
// Using obsidian_read tool
{
  "path": "Projects/AI Research.md"
}
```

### Write content to a file

```typescript
// Using obsidian_write tool
{
  "path": "Daily/2026-02-17.md",
  "content": "# Meeting Notes\n\n- Discussed MCP server architecture"
}
```

### Search vault

```typescript
// Using obsidian_search tool
{
  "query": "machine learning",
  "path": "Projects",
  "limit": 10
}
```

### Append to daily note

```typescript
// Using obsidian_daily tool
{
  "action": "append",
  "content": "\n## New Section\n\nContent here"
}
```

## Architecture

```
obsidian-mcp/
├── src/
│   ├── index.ts              # Entry point, server setup
│   ├── cli.ts                # ObsidianCLI wrapper class
│   ├── config.ts             # Environment-based configuration
│   ├── helpers.ts            # Shared response/validation helpers
│   ├── tools/
│   │   ├── index.ts          # Tool registration barrel
│   │   └── *.ts              # 19 individual tool modules
│   └── resources/
│       └── vault.ts          # Resource template for vault files
├── package.json
├── tsconfig.json
└── CLAUDE.md                 # Project-specific AI instructions
```

## Development

### Commands

```bash
# Run server
bun run src/index.ts

# Build
bun build src/index.ts --outdir dist --target bun

# Type check
bunx tsc --noEmit

# Test with MCP Inspector
bunx @modelcontextprotocol/inspector bun run src/index.ts
```

### Adding a New Tool

1. Create `src/tools/your_tool.ts`:

```typescript
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import { cliResponse } from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_your_tool",
    "Tool description for AI agents",
    {
      param: z.string().describe("Parameter description"),
    },
    async ({ param }) => {
      const result = await cli.exec("command", { param });
      return cliResponse(result);
    },
  );
}
```

2. Register in `src/tools/index.ts`:

```typescript
import { register as yourTool } from "./your_tool.js";
// Add to registrations array
```

## How It Works

The server communicates with Obsidian via the official CLI, which uses IPC to interact with the running desktop app. Each tool wraps a specific CLI command, handling parameter validation, error responses, and output formatting according to the MCP specification.

Key components:

- **ObsidianCLI** — Spawns `obsidian` processes with proper argument formatting
- **Shared helpers** — `cliResponse()`, `errorResponse()`, `fileOrPathSchema`, etc.
- **Validation guards** — Explicit checks for conditional parameters before CLI invocation
- **Resource template** — Exposes vault files as browseable MCP resources

## Limitations

- Requires Obsidian desktop app to be running (CLI uses IPC)
- No direct file system access (all operations go through Obsidian CLI)
- Some operations may be slower than direct file manipulation

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`jj new` or `git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Submit a pull request

## License

MIT © [Your Name]

## Resources

- [Obsidian CLI Documentation](https://help.obsidian.md/CLI)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Code MCP Docs](https://code.claude.com/docs/en/mcp)

## Changelog

### 0.1.0 (2026-02-17)

- Initial release
- 19 MCP tools covering core Obsidian operations
- Resource templates for vault file browsing
- Shared helpers and validation guards
