import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_tasks",
    "List or update tasks in Obsidian vault files. List tasks from a specific file, or update a task's status by its number.",
    {
      action: z.enum(["list", "update"]).describe("Whether to list tasks or update a task status"),
      file: z.string().optional().describe("File name containing the tasks (e.g. 'My Note')"),
      path: z
        .string()
        .optional()
        .describe("Path to the file relative to vault root (e.g. 'folder/My Note.md')"),
      task: z
        .number()
        .optional()
        .describe("Task number to update (required for update action)"),
      status: z
        .string()
        .optional()
        .describe("New status for the task (e.g. 'x' for done, ' ' for open)"),
    },
    async ({ action, file, path, task, status }) => {
      const fileOrPath: Record<string, string> = {};
      if (file) fileOrPath.file = file;
      if (path) fileOrPath.path = path;

      if (action === "list") {
        const result = await cli.exec("tasks", fileOrPath);

        if (result.exitCode !== 0) {
          return {
            content: [{ type: "text", text: result.stderr || result.stdout }],
            isError: true,
          };
        }

        return { content: [{ type: "text", text: result.stdout }] };
      }

      const params: Record<string, string> = {
        task: String(task!),
        ...fileOrPath,
      };
      if (status) params.status = status;

      const result = await cli.exec("task", params);

      if (result.exitCode !== 0) {
        return { content: [{ type: "text", text: result.stderr || result.stdout }], isError: true };
      }

      return { content: [{ type: "text", text: result.stdout }] };
    },
  );
}
