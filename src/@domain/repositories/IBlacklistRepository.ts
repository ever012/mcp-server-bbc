import { BlacklistEntry, BlacklistStatus } from "../entities/BlacklistEntry";
import { PhoneNumber } from "../value-objects/PhoneNumber";

export interface IBlacklistRepository {
  add(number: PhoneNumber): Promise<void>;
  remove(number: PhoneNumber): Promise<void>;
  getStatus(number: PhoneNumber): Promise<BlacklistStatus>;
}

