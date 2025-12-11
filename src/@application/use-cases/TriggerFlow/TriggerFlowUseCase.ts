import { IFlowRepository } from "../../../@domain/repositories/IFlowRepository";
import { PhoneNumber } from "../../../@domain/value-objects/PhoneNumber";
import { TriggerFlowDTO } from "./TriggerFlowDTO";

export class TriggerFlowUseCase {
  constructor(private readonly flowRepository: IFlowRepository) {}

  async execute(dto: TriggerFlowDTO): Promise<void> {
    const phoneNumber = new PhoneNumber(dto.number);
    await this.flowRepository.trigger("EVENT_REGISTER", {
      from: phoneNumber,
      name: dto.name,
    });
  }
}

