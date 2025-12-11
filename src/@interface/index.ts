import { VoltAgent } from "@voltagent/core";
import { honoServer } from "@voltagent/server-hono";
import { logger } from "../@infrastructure/voltagent/logger";
import { assistant } from "../@infrastructure/voltagent/agents/assistant";
import { createMcpServer } from "../@infrastructure/voltagent/mcp-server";
import { getBuilderBotInstance } from "../@infrastructure/builderbot/builderbot-provider";
import { BuilderBotMessageRepository } from "../@infrastructure/builderbot/BuilderBotMessageRepository";
import { BuilderBotBlacklistRepository } from "../@infrastructure/builderbot/BuilderBotBlacklistRepository";
import { BuilderBotFlowRepository } from "../@infrastructure/builderbot/BuilderBotFlowRepository";
import { SendMessageUseCase } from "../@application/use-cases/SendMessage/SendMessageUseCase";
import { ManageBlacklistUseCase } from "../@application/use-cases/ManageBlacklist/ManageBlacklistUseCase";
import { TriggerFlowUseCase } from "../@application/use-cases/TriggerFlow/TriggerFlowUseCase";
// Bot type is inferred from handleCtx callback

async function main() {
  // Inicializar BuilderBot primero
  const builderBotInstance = await getBuilderBotInstance([]);

  // Crear repositorios
  const messageRepository = new BuilderBotMessageRepository();
  const blacklistRepository = new BuilderBotBlacklistRepository();
  const flowRepository = new BuilderBotFlowRepository();

  // Crear use cases
  const sendMessageUseCase = new SendMessageUseCase(messageRepository);
  const manageBlacklistUseCase = new ManageBlacklistUseCase(blacklistRepository);
  const triggerFlowUseCase = new TriggerFlowUseCase(flowRepository);

  // Registrar rutas de BuilderBot usando handleCtx
  // POST /v1/messages
  builderBotInstance.provider.server.post("/v1/messages", builderBotInstance.handleCtx(async (bot: any, req: any, res: any) => {
    builderBotInstance.setBot(bot);
    try {
      const { number, message, media } = req.body;
      if (!number || !message) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "number and message are required" }));
      }

      const dto = { number, message, media };
      await sendMessageUseCase.execute(dto);
      
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "send" }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }));
    }
  }));

  // POST /v1/blacklist
  builderBotInstance.provider.server.post("/v1/blacklist", builderBotInstance.handleCtx(async (bot: any, req: any, res: any) => {
    builderBotInstance.setBot(bot);
    try {
      const { number, intent } = req.body;
      if (!number || !intent) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "number and intent are required" }));
      }

      if (intent !== "add" && intent !== "remove") {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "intent must be 'add' or 'remove'" }));
      }

      const dto = { number, intent };
      await manageBlacklistUseCase.execute(dto);
      
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "ok", number, intent }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }));
    }
  }));

  // POST /v1/register
  builderBotInstance.provider.server.post("/v1/register", builderBotInstance.handleCtx(async (bot: any, req: any, res: any) => {
    builderBotInstance.setBot(bot);
    try {
      const { number, name } = req.body;
      if (!number || !name) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "number and name are required" }));
      }

      const dto = { number, name };
      await triggerFlowUseCase.execute(dto);
      
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "trigger" }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }));
    }
  }));

  // Iniciar servidor HTTP de BuilderBot en puerto 3001
  builderBotInstance.httpServer(3001);

  // Crear servidor Hono para VoltAgent en puerto 3141
  const server = honoServer({ port: 3141 });

  // Crear instancia de VoltAgent
  const mcpServer = createMcpServer();
  new VoltAgent({
    agents: {
      assistant,
    },
    mcpServers: {
      mcpServer,
    },
    server,
    logger,
  });

  logger.info("BuilderBot API running on port 3001: /v1/messages, /v1/blacklist, /v1/register");
  logger.info("VoltAgent MCP server running on port 3141");
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
