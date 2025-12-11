import { createBot, MemoryDB, createProvider } from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";
import type { BotProvider } from "@builderbot/bot";
// Bot type is inferred from handleCtx

export interface BuilderBotInstance {
  bot: any;
  provider: BotProvider;
  setBot(bot: any): void;
  handleCtx: any;
  httpServer: any;
}

let builderBotInstance: BuilderBotInstance | null = null;

export async function getBuilderBotInstance(flows: any[] = []): Promise<BuilderBotInstance> {
  if (builderBotInstance && builderBotInstance.bot) {
    return builderBotInstance;
  }

  const provider = createProvider(BaileysProvider);
  
  const { handleCtx, httpServer } = await createBot({
    database: new MemoryDB(),
    provider,
    flow: flows,
  });

  // Capturamos el bot desde handleCtx cuando se use
  const instance: BuilderBotInstance = {
    bot: null,
    provider,
    handleCtx: (handler: (bot: any, req: any, res: any) => Promise<void>) => {
      return handleCtx(async (bot: any, req: any, res: any) => {
        // Guardamos el bot la primera vez que se usa
        if (!instance.bot) {
          instance.bot = bot;
        }
        return handler(bot, req, res);
      });
    },
    httpServer,
    setBot(bot: any) {
      instance.bot = bot;
    },
  };

  builderBotInstance = instance;
  return builderBotInstance;
}
