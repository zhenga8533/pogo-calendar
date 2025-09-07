import { categoryColors } from "../config/colorMapping";

function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

export function getColorForCategory(category: string): string {
  if (categoryColors[category]) {
    return categoryColors[category];
  }

  const hash = stringToHash(category);
  const hue = Math.abs(hash % 360);

  return `hsl(${hue}, 70%, 50%)`;
}
