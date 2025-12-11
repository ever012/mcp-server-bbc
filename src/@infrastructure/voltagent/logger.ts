import { createPinoLogger } from "@voltagent/logger";

export const logger = createPinoLogger({
  name: "with-mcp-server",
  level: "debug",
});

