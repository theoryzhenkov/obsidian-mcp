import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ObsidianCLI } from "../cli.js";
import {
  cliResponse,
  errorResponse,
  fileOrPathSchema,
  buildFileOrPath,
} from "../helpers.js";

export function register(server: McpServer, cli: ObsidianCLI): void {
  server.tool(
    "obsidian_tasks",
    "List or update tasks in Obsidian vault files. List tasks from a specific file, or update a task's status by its number.",
    {
      action: z
        .enum(["list", "update"])
        .describe("Whether to list tasks or update a task status"),
      ...fileOrPathSchema,
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
      const fileOrPath = buildFileOrPath(file, path);

      if (action === "list") {
        const result = await cli.exec("tasks", fileOrPath);
        return cliResponse(result);
      }

      if (task === undefined) {
        return errorResponse("'task' is required for 'update' action");
      }

      const params: Record<string, string> = {
        task: String(task),
        ...fileOrPath,
      };
      if (status) params.status = status;

      const result = await cli.exec("task", params);
      return cliResponse(result);
    },
  );
}
