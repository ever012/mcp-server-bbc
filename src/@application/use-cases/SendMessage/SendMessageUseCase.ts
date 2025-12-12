import { Message } from "../../../@domain/entities/Message.js";
import { IMessageRepository } from "../../../@domain/repositories/IMessageRepository.js";
import { PhoneNumber } from "../../../@domain/value-objects/PhoneNumber.js";
import { SendMessageDTO } from "./SendMessageDTO.js";

export class SendMessageUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(dto: SendMessageDTO): Promise<void> {
    const phoneNumber = new PhoneNumber(dto.number);
    const message = new Message(phoneNumber, dto.message, dto.media);
    await this.messageRepository.send(message);
  }
}

