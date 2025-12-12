import { Hono } from "hono";
import { MessageController } from "../controllers/MessageController.js";
import { BlacklistController } from "../controllers/BlacklistController.js";
import { FlowController } from "../controllers/FlowController.js";

export function createBuilderBotRoutes(
  messageController: MessageController,
  blacklistController: BlacklistController,
  flowController: FlowController
): Hono {
  const router = new Hono();

  router.post("/v1/messages", async (c) => {
    return messageController.sendMessage(c);
  });

  router.post("/v1/blacklist", async (c) => {
    return blacklistController.manageBlacklist(c);
  });

  router.post("/v1/register", async (c) => {
    return flowController.triggerFlow(c);
  });

  return router;
}

