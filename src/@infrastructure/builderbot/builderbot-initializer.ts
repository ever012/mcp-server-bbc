import { getBuilderBotInstance } from "./builderbot-provider";
import { BuilderBotMessageRepository } from "./BuilderBotMessageRepository";
import { BuilderBotBlacklistRepository } from "./BuilderBotBlacklistRepository";
import { BuilderBotFlowRepository } from "./BuilderBotFlowRepository";
import { SendMessageUseCase } from "../../@application/use-cases/SendMessage/SendMessageUseCase";
import { ManageBlacklistUseCase } from "../../@application/use-cases/ManageBlacklist/ManageBlacklistUseCase";
import { TriggerFlowUseCase } from "../../@application/use-cases/TriggerFlow/TriggerFlowUseCase";
import { MessageController } from "../../@interface/http/controllers/MessageController";
import { BlacklistController } from "../../@interface/http/controllers/BlacklistController";
import { FlowController } from "../../@interface/http/controllers/FlowController";

export interface BuilderBotServices {
  messageController: MessageController;
  blacklistController: BlacklistController;
  flowController: FlowController;
  initializeBot(): Promise<void>;
}

export async function createBuilderBotServices(flows: any[] = []): Promise<BuilderBotServices> {
  // Inicializamos BuilderBot (pero el bot solo estará disponible cuando se use handleCtx)
  const instance = await getBuilderBotInstance(flows);

  // Creamos los repositorios
  const messageRepository = new BuilderBotMessageRepository();
  const blacklistRepository = new BuilderBotBlacklistRepository();
  const flowRepository = new BuilderBotFlowRepository();

  // Creamos los use cases
  const sendMessageUseCase = new SendMessageUseCase(messageRepository);
  const manageBlacklistUseCase = new ManageBlacklistUseCase(blacklistRepository);
  const triggerFlowUseCase = new TriggerFlowUseCase(flowRepository);

  // Creamos los controllers
  const messageController = new MessageController(sendMessageUseCase);
  const blacklistController = new BlacklistController(manageBlacklistUseCase);
  const flowController = new FlowController(triggerFlowUseCase);

  return {
    messageController,
    blacklistController,
    flowController,
    async initializeBot() {
      // Inicializamos el bot usando handleCtx para capturarlo
      // Esto se hace cuando se hace la primera petición o podemos forzarlo aquí
      // Por ahora, el bot se capturará en la primera petición HTTP
    },
  };
}

