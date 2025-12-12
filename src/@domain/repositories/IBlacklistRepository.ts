import { BlacklistEntry, BlacklistStatus } from "../entities/BlacklistEntry.js";
import { PhoneNumber } from "../value-objects/PhoneNumber.js";

export interface IBlacklistRepository {
  add(number: PhoneNumber): Promise<void>;
  remove(number: PhoneNumber): Promise<void>;
  getStatus(number: PhoneNumber): Promise<BlacklistStatus>;
}

