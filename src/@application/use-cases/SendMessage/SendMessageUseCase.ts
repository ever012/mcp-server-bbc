import { Message } from "../../../@domain/entities/Message";
import { IMessageRepository } from "../../../@domain/repositories/IMessageRepository";
import { PhoneNumber } from "../../../@domain/value-objects/PhoneNumber";
import { SendMessageDTO } from "./SendMessageDTO";

export class SendMessageUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(dto: SendMessageDTO): Promise<void> {
    const phoneNumber = new PhoneNumber(dto.number);
    const message = new Message(phoneNumber, dto.message, dto.media);
    await this.messageRepository.send(message);
  }
}

