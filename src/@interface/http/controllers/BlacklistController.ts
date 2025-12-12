import { Context } from "hono";
import { ManageBlacklistUseCase } from "../../../@application/use-cases/ManageBlacklist/ManageBlacklistUseCase.js";
import { ManageBlacklistDTO } from "../../../@application/use-cases/ManageBlacklist/ManageBlacklistDTO.js";

export class BlacklistController {
  constructor(private readonly manageBlacklistUseCase: ManageBlacklistUseCase) {}

  async manageBlacklist(c: Context): Promise<Response> {
    try {
      const body = await c.req.json();
      const dto: ManageBlacklistDTO = {
        number: body.number,
        intent: body.intent,
      };

      if (!dto.number || !dto.intent) {
        return c.json({ error: "number and intent are required" }, 400);
      }

      if (dto.intent !== "add" && dto.intent !== "remove") {
        return c.json({ error: "intent must be 'add' or 'remove'" }, 400);
      }

      await this.manageBlacklistUseCase.execute(dto);
      return c.json({ status: "ok", number: dto.number, intent: dto.intent }, 200);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Unknown error" },
        500
      );
    }
  }
}

