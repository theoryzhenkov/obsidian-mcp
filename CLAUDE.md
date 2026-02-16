# Obsidian MCP Server

MCP server wrapping the Obsidian CLI (v1.12+) for AI agent access to vaults.

## Stack

- **Runtime**: Bun
- **Language**: TypeScript (strict)
- **MCP SDK**: `@modelcontextprotocol/sdk`
- **Validation**: Zod
- **Transport**: StdioServerTransport

## Architecture

- `src/index.ts` — Entry point, server setup
- `src/cli.ts` — `ObsidianCLI` class wrapping CLI process spawning
- `src/config.ts` — Env-based config (`OBSIDIAN_VAULT`, `OBSIDIAN_CLI_PATH`)
- `src/tools/` — 18 tool modules, each exports `register(server, cli)`
- `src/tools/index.ts` — Barrel that registers all tools
- `src/resources/vault.ts` — Resource template for vault files

## Commands

- `bun run src/index.ts` — Run server
- `bun build src/index.ts --outdir dist --target bun` — Build
- `bunx tsc --noEmit` — Type check
- `bunx @modelcontextprotocol/inspector bun run src/index.ts` — Test with MCP Inspector

## Environment Variables

- `OBSIDIAN_VAULT` — Default vault name (optional)
- `OBSIDIAN_CLI_PATH` — Path to `obsidian` binary (defaults to `"obsidian"`)
