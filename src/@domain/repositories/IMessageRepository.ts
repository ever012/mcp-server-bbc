import { Message } from "../entities/Message.js";

export interface IMessageRepository {
  send(message: Message): Promise<void>;
}

