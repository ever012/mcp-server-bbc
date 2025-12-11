import { Message } from "../entities/Message";

export interface IMessageRepository {
  send(message: Message): Promise<void>;
}

