import { PhoneNumber } from "../value-objects/PhoneNumber";

export interface IFlowRepository {
  trigger(event: string, data: { from: PhoneNumber; [key: string]: unknown }): Promise<void>;
}

