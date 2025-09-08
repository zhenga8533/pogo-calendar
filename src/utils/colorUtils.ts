import type { PaletteMode } from "@mui/material";
import { darkCategoryColors, lightCategoryColors } from "../config/colorMapping";

/**
 * Generates a numeric hash from a string.
 *
 * @param str Input string to be hashed
 * @returns A numeric hash value
 */
function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

/**
 * Gets a color for a given category. If the category has a predefined color in categoryColors,
 *
 * @param category The category name for which to get the color
 * @returns A string representing the color in HSL format
 */
export function getColorForCategory(category: string, mode: PaletteMode): string {
  const colorMap = mode === "light" ? lightCategoryColors : darkCategoryColors;

  if (colorMap[category]) {
    return colorMap[category];
  }

  const hash = stringToHash(category);
  const hue = Math.abs(hash % 360);
  const saturation = mode === "light" ? 70 : 60;
  const lightness = mode === "light" ? 50 : 65;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
