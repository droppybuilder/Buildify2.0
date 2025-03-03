
/**
 * Adjusts a color by a given percentage
 * @param color - The color to adjust in hex format (e.g. #RRGGBB)
 * @param percent - The percentage to adjust by (negative to darken, positive to lighten)
 * @returns The adjusted color in hex format
 */
export function adjustColor(color: string, percent: number): string {
  // Default to a light grey if color is invalid
  if (!color || !color.startsWith('#') || color.length !== 7) {
    return '#e2e8f0';
  }

  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.min(255, Math.max(0, R + Math.round(R * percent / 100)));
  G = Math.min(255, Math.max(0, G + Math.round(G * percent / 100)));
  B = Math.min(255, Math.max(0, B + Math.round(B * percent / 100)));

  const RR = R.toString(16).padStart(2, '0');
  const GG = G.toString(16).padStart(2, '0');
  const BB = B.toString(16).padStart(2, '0');

  return `#${RR}${GG}${BB}`;
}
