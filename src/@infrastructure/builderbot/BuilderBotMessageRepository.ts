import { Message } from "../../@domain/entities/Message";
import { IMessageRepository } from "../../@domain/repositories/IMessageRepository";
import { getBuilderBotInstance } from "./builderbot-provider";

export class BuilderBotMessageRepository implements IMessageRepository {
  async send(message: Message): Promise<void> {
    const instance = await getBuilderBotInstance();
    
    if (!instance.bot) {
      throw new Error("BuilderBot bot instance is not initialized");
    }

    const options = message.media ? { media: message.media } : {};
    await instance.bot.sendMessage(message.number.toString(), message.content, options);
  }
}

