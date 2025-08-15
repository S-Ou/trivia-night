export function cleanHexString(value: string): string {
  value = value.replace(/[^0-9a-f]/gi, "");
  value = value.substring(0, 6);
  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }
  value = "#" + value.padEnd(6, "0");
  return value;
}

export function isLightColor(hex: string): boolean {
  // Remove hash if present
  hex = hex.replace(/^#/, "");
  // Expand shorthand (e.g. "fff" -> "ffffff")
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (hex.length !== 6) return false;
  const num = parseInt(hex, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  // Perceived brightness formula
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
  return brightness > 186;
}
