import { Context } from "hono";
import { SendMessageUseCase } from "../../../@application/use-cases/SendMessage/SendMessageUseCase.js";
import { SendMessageDTO } from "../../../@application/use-cases/SendMessage/SendMessageDTO.js";

export class MessageController {
  constructor(private readonly sendMessageUseCase: SendMessageUseCase) {}

  async sendMessage(c: Context): Promise<Response> {
    try {
      const body = await c.req.json();
      const dto: SendMessageDTO = {
        number: body.number,
        message: body.message,
        media: body.media,
      };

      if (!dto.number || !dto.message) {
        return c.json({ error: "number and message are required" }, 400);
      }

      await this.sendMessageUseCase.execute(dto);
      return c.json({ status: "send" }, 200);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Unknown error" },
        500
      );
    }
  }
}

