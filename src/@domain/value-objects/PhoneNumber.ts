export class PhoneNumber {
  private readonly value: string;

  constructor(number: string) {
    if (!number || number.trim().length === 0) {
      throw new Error("Phone number cannot be empty");
    }
    // Validación básica: solo números y caracteres permitidos
    const cleaned = number.replace(/\s+/g, "");
    if (!/^[\d+\-()]+$/.test(cleaned)) {
      throw new Error("Invalid phone number format");
    }
    this.value = cleaned;
  }

  toString(): string {
    return this.value;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}

