export default class Util {
  static formatCpfCnpj(value: string) {
    value = value.replace(/\D/g, "");
    if (value.length > 14) value = value.slice(0, 14);

    if (value.length <= 11) {
      // CPF
      return value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      // CNPJ
      return value
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
  }

  static validateCpfOrCnpj(value: string): boolean {
    if (!value) return false;

    const onlyDigits: string = value.replace(/\D+/g, "");

    // ---------------- CPF ----------------
    if (onlyDigits.length === 11) {
      if (/^(\d)\1{10}$/.test(onlyDigits)) return false;

      const digits: number[] = Array.from(onlyDigits).map((d) =>
        parseInt(d, 10)
      );

      const calculateCheckDigit = (
        arr: number[],
        startFactor: number
      ): number => {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
          sum += arr[i] * (startFactor - i);
        }
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
      };

      const d1 = calculateCheckDigit(digits.slice(0, 9), 10);
      if (d1 !== digits[9]) return false;

      const d2 = calculateCheckDigit(digits.slice(0, 10), 11);
      if (d2 !== digits[10]) return false;

      return true;
    }

    // ---------------- CNPJ ----------------
    if (onlyDigits.length === 14) {
      if (/^(\d)\1{13}$/.test(onlyDigits)) return false;

      const digits: number[] = Array.from(onlyDigits).map((d) =>
        parseInt(d, 10)
      );

      const calculateCheckDigitCnpj = (
        arr: number[],
        factors: number[]
      ): number => {
        const sum = arr.reduce((acc, num, idx) => acc + num * factors[idx], 0);
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
      };

      const factors1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const d1 = calculateCheckDigitCnpj(digits.slice(0, 12), factors1);
      if (d1 !== digits[12]) return false;

      const factors2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const d2 = calculateCheckDigitCnpj(digits.slice(0, 13), factors2);
      if (d2 !== digits[13]) return false;

      return true;
    }

    return false;
  }

  static compararStrings(
    text: string | null | undefined,
    textCompare: string | null | undefined
  ): boolean {
    if (!text || !textCompare) return false;

    const normalize = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    return normalize(text).includes(normalize(textCompare));
  }
}
