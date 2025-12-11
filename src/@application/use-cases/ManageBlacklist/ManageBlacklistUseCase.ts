import { IBlacklistRepository } from "../../../@domain/repositories/IBlacklistRepository";
import { PhoneNumber } from "../../../@domain/value-objects/PhoneNumber";
import { ManageBlacklistDTO } from "./ManageBlacklistDTO";

export class ManageBlacklistUseCase {
  constructor(private readonly blacklistRepository: IBlacklistRepository) {}

  async execute(dto: ManageBlacklistDTO): Promise<void> {
    const phoneNumber = new PhoneNumber(dto.number);

    if (dto.intent === "add") {
      await this.blacklistRepository.add(phoneNumber);
    } else if (dto.intent === "remove") {
      await this.blacklistRepository.remove(phoneNumber);
    } else {
      throw new Error(`Invalid intent: ${dto.intent}. Must be 'add' or 'remove'`);
    }
  }
}

