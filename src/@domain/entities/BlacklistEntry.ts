import { PhoneNumber } from "../value-objects/PhoneNumber";

export enum BlacklistStatus {
  BLOCKED = "blocked",
  ALLOWED = "allowed",
}

export class BlacklistEntry {
  constructor(
    public readonly number: PhoneNumber,
    public readonly status: BlacklistStatus
  ) {}
}

