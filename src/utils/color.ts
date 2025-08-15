function normalizeHex(hex: string): string {
  // Remove non-hex characters and hash, limit to 6 chars
  hex = hex.replace(/[^0-9a-f]/gi, "").substring(0, 6);
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return hex.padEnd(6, "0");
}

function hexToRgb(hex: string): [number, number, number] {
  hex = normalizeHex(hex);
  const num = parseInt(hex, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return [r, g, b];
}

export function cleanHexString(value: string): string {
  return "#" + normalizeHex(value);
}

export function isLightColor(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  // Perceived brightness formula
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
  return brightness > 186;
}

function luminanceFromHex(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  const srgb = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  // Relative luminance
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = luminanceFromHex(hex1);
  const lum2 = luminanceFromHex(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return +((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}
