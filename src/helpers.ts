import { z } from "zod";
import type { CLIResult } from "./cli.js";

export interface ToolResponse {
  [key: string]: unknown;
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

export function cliResponse(result: CLIResult): ToolResponse {
  if (result.exitCode !== 0) {
    return {
      content: [{ type: "text", text: result.stderr || result.stdout }],
      isError: true,
    };
  }
  return { content: [{ type: "text", text: result.stdout }] };
}

export function errorResponse(message: string): ToolResponse {
  return { content: [{ type: "text", text: message }], isError: true };
}

export const fileOrPathSchema = {
  file: z.string().optional().describe("File name (e.g. 'My Note')"),
  path: z
    .string()
    .optional()
    .describe("Vault-relative path (e.g. 'folder/My Note.md')"),
};

export function buildFileOrPath(
  file?: string,
  path?: string,
): Record<string, string> {
  const params: Record<string, string> = {};
  if (file) params.file = file;
  if (path) params.path = path;
  return params;
}
