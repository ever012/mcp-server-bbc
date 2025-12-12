import { PhoneNumber } from "../value-objects/PhoneNumber.js";

export class Message {
  constructor(
    public readonly number: PhoneNumber,
    public readonly content: string,
    public readonly media?: string
  ) {
    if (!content || content.trim().length === 0) {
      throw new Error("Message content cannot be empty");
    }
  }
}

