import { IFlowRepository } from "../../@domain/repositories/IFlowRepository";
import { PhoneNumber } from "../../@domain/value-objects/PhoneNumber";
import { getBuilderBotInstance } from "./builderbot-provider";

export class BuilderBotFlowRepository implements IFlowRepository {
  async trigger(event: string, data: { from: PhoneNumber; [key: string]: unknown }): Promise<void> {
    const instance = await getBuilderBotInstance();
    
    if (!instance.bot) {
      throw new Error("BuilderBot bot instance is not initialized");
    }

    await instance.bot.dispatch(event, {
      from: data.from.toString(),
      ...data,
    });
  }
}

