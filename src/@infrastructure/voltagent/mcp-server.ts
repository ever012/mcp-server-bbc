import { MCPServer } from "@voltagent/mcp-server";

export const createMcpServer = () => {
  return new MCPServer({
    name: "voltagent-example",
    version: "0.1.0",
    description: "VoltAgent MCP stdio example",
    protocols: {
      stdio: true,
      http: true,
      sse: true,
    },
    filterTools: ({ items }) => {
      return items;
    },
  });
};

