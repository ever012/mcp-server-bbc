import { getBuilderBotInstance } from "./builderbot-provider.js";
import { BuilderBotMessageRepository } from "./BuilderBotMessageRepository.js";
import { BuilderBotBlacklistRepository } from "./BuilderBotBlacklistRepository.js";
import { BuilderBotFlowRepository } from "./BuilderBotFlowRepository.js";
import { SendMessageUseCase } from "../../@application/use-cases/SendMessage/SendMessageUseCase.js";
import { ManageBlacklistUseCase } from "../../@application/use-cases/ManageBlacklist/ManageBlacklistUseCase.js";
import { TriggerFlowUseCase } from "../../@application/use-cases/TriggerFlow/TriggerFlowUseCase.js";
import { MessageController } from "../../@interface/http/controllers/MessageController.js";
import { BlacklistController } from "../../@interface/http/controllers/BlacklistController.js";
import { FlowController } from "../../@interface/http/controllers/FlowController.js";


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

