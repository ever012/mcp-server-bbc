import { Context } from "hono";
import { TriggerFlowUseCase } from "../../../@application/use-cases/TriggerFlow/TriggerFlowUseCase";
import { TriggerFlowDTO } from "../../../@application/use-cases/TriggerFlow/TriggerFlowDTO";

export class FlowController {
  constructor(private readonly triggerFlowUseCase: TriggerFlowUseCase) {}

  async triggerFlow(c: Context): Promise<Response> {
    try {
      const body = await c.req.json();
      const dto: TriggerFlowDTO = {
        number: body.number,
        name: body.name,
      };

      if (!dto.number || !dto.name) {
        return c.json({ error: "number and name are required" }, 400);
      }

      await this.triggerFlowUseCase.execute(dto);
      return c.json({ status: "trigger" }, 200);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Unknown error" },
        500
      );
    }
  }
}

