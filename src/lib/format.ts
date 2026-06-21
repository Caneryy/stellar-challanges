export function truncateMiddle(
  value: string,
  startChars = 10,
  endChars = 10,
): string {
  if (value.length <= startChars + endChars + 3) {
    return value;
  }

  return `${value.slice(0, startChars)}...${value.slice(-endChars)}`;
}

/**
 * Formats XLM balance with at most 4 decimal places and no trailing zeros.
 */
export function formatXlmBalance(balance: string): string {
  const value = Number(balance);
  if (Number.isNaN(value)) {
    return "0";
  }

  const rounded = Math.round(value * 10_000) / 10_000;
  const [integerPart, decimalPart = ""] = rounded.toFixed(4).split(".");
  const trimmedDecimal = decimalPart.replace(/0+$/, "");
  const formattedInteger = Number(integerPart).toLocaleString("en-US");

  if (!trimmedDecimal) {
    return formattedInteger;
  }

  return `${formattedInteger}.${trimmedDecimal}`;
}

export function splitXlmBalance(balance: string): {
  integerPart: string;
  decimalPart: string | null;
} {
  const formatted = formatXlmBalance(balance);
  const [integerPart, decimalPart] = formatted.split(".");

  return {
    integerPart,
    decimalPart: decimalPart ?? null,
  };
}
