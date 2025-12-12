import { PhoneNumber } from "../value-objects/PhoneNumber.js";

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

