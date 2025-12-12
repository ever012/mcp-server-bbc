import { BlacklistStatus } from "../../@domain/entities/BlacklistEntry.js";
import { IBlacklistRepository } from "../../@domain/repositories/IBlacklistRepository.js";
import { PhoneNumber } from "../../@domain/value-objects/PhoneNumber.js";
import { getBuilderBotInstance } from "./builderbot-provider.js";

export class BuilderBotBlacklistRepository implements IBlacklistRepository {
  async add(number: PhoneNumber): Promise<void> {
    const instance = await getBuilderBotInstance();
    
    if (!instance.bot) {
      throw new Error("BuilderBot bot instance is not initialized");
    }

    instance.bot.blacklist.add(number.toString());
  }

  async remove(number: PhoneNumber): Promise<void> {
    const instance = await getBuilderBotInstance();
    
    if (!instance.bot) {
      throw new Error("BuilderBot bot instance is not initialized");
    }

    instance.bot.blacklist.remove(number.toString());
  }

  async getStatus(number: PhoneNumber): Promise<BlacklistStatus> {
    const instance = await getBuilderBotInstance();
    
    if (!instance.bot) {
      throw new Error("BuilderBot bot instance is not initialized");
    }

    // Asumimos que si no está en blacklist, está allowed
    // BuilderBot no tiene un método directo para verificar, así que retornamos ALLOWED por defecto
    // Esto puede mejorarse si BuilderBot expone un método para verificar
    return BlacklistStatus.ALLOWED;
  }
}

