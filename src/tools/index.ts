import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ObsidianCLI } from "../cli.js";

import { register as vault } from "./vault.js";
import { register as files } from "./files.js";
import { register as read } from "./read.js";
import { register as create } from "./create.js";
import { register as edit } from "./edit.js";
import { register as manageFile } from "./manage_file.js";
import { register as search } from "./search.js";
import { register as tags } from "./tags.js";
import { register as properties } from "./properties.js";
import { register as daily } from "./daily.js";
import { register as tasks } from "./tasks.js";
import { register as links } from "./links.js";
import { register as outline } from "./outline.js";
import { register as templates } from "./templates.js";
import { register as bookmarks } from "./bookmarks.js";
import { register as plugins } from "./plugins.js";
import { register as workspace } from "./workspace.js";
import { register as write } from "./write.js";
import { register as commands } from "./commands.js";

const registrations = [
  vault,
  files,
  read,
  create,
  write,
  edit,
  manageFile,
  search,
  tags,
  properties,
  daily,
  tasks,
  links,
  outline,
  templates,
  bookmarks,
  plugins,
  workspace,
  commands,
];

export function registerAllTools(server: McpServer, cli: ObsidianCLI): void {
  for (const register of registrations) {
    register(server, cli);
  }
}
