import { CUSTOM_EVENT_CATEGORY } from './constants';

export const lightCategoryColors: { [key: string]: string } = {
  [CUSTOM_EVENT_CATEGORY]: '#AFB42B',
  'City Safari': '#26A69A',
  'Community Day': '#7CB342',
  Event: '#1E88E5',
  'GO Battle League': '#43A047',
  'GO Pass': '#757575',
  'Max Mondays': '#D81B60',
  'PokéStop Showcase': '#3949AB',
  'Pokémon GO Fest': '#FFA000',
  'Pokémon GO Tour': '#03A9F4',
  'Pokémon Spotlight Hour': '#FFB300',
  'Raid Battles': '#546E7A',
  'Raid Day': '#E53935',
  'Raid Hour': '#8E24AA',
  'Raid Weekend': '#FB8C00',
  Season: '#00ACC1',
  'Wild Area': '#6D4C41',
};

export const darkCategoryColors: { [key: string]: string } = {
  [CUSTOM_EVENT_CATEGORY]: '#D4E157',
  'City Safari': '#4DB6AC',
  'Community Day': '#9CCC65',
  Event: '#64B5F6',
  'GO Battle League': '#66BB6A',
  'GO Pass': '#9E9E9E',
  'Max Mondays': '#EC407A',
  'PokéStop Showcase': '#7986CB',
  'Pokémon GO Fest': '#FFCA28',
  'Pokémon GO Tour': '#4FC3F7',
  'Pokémon Spotlight Hour': '#FFCA28',
  'Raid Battles': '#78909C',
  'Raid Day': '#EF5350',
  'Raid Hour': '#AB47BC',
  'Raid Weekend': '#FFA726',
  Season: '#26C6DA',
  'Wild Area': '#8D6E63',
};

// Egg tier colors
export const EGG_COLORS: Record<string, string> = {
  '2 km Eggs': '#4CAF50',
  '5 km Eggs': '#FFA726',
  '7 km Eggs': '#FDD835',
  '10 km Eggs': '#AB47BC',
  '12 km Eggs': '#EF5350',
};

// Raid tier colors
export const RAID_TIER_COLORS: Record<string, string> = {
  'Tier 1': '#F48FB1',
  'Tier 3': '#FFB74D',
  'Tier 5': '#BA68C8',
  'Mega Raids': '#4FC3F7',
};

// Team GO Rocket leader colors
export const ROCKET_LEADER_COLORS: Record<string, string> = {
  Giovanni: '#8B4513',
  Cliff: '#FF6B35',
  Sierra: '#9B59B6',
  Arlo: '#3498DB',
};

export const ROCKET_LEADER_DESCRIPTIONS: Record<string, string> = {
  Giovanni: 'Team Rocket Boss',
  Cliff: 'Team Rocket Leader',
  Sierra: 'Team Rocket Leader',
  Arlo: 'Team Rocket Leader',
};

// Pokémon type colors (for raid bosses and other uses)
export const POKEMON_TYPE_COLORS: Record<string, string> = {
  Normal: '#A8A77A',
  Fire: '#EE8130',
  Water: '#6390F0',
  Electric: '#F7D02C',
  Grass: '#7AC74C',
  Ice: '#96D9D6',
  Fighting: '#C22E28',
  Poison: '#A33EA1',
  Ground: '#E2BF65',
  Flying: '#A98FF3',
  Psychic: '#F95587',
  Bug: '#A6B91A',
  Rock: '#B6A136',
  Ghost: '#735797',
  Dragon: '#6F35FC',
  Dark: '#705746',
  Steel: '#B7B7CE',
  Fairy: '#D685AD',
};

// Rarity tier labels and colors
export const RARITY_TIERS: Record<number, { label: string; color: string }> = {
  1: { label: 'Common', color: '#78909C' },
  2: { label: 'Uncommon', color: '#66BB6A' },
  3: { label: 'Rare', color: '#42A5F5' },
  4: { label: 'Very Rare', color: '#AB47BC' },
  5: { label: 'Ultra Rare', color: '#FFA726' },
};

// Shiny indicator color
export const SHINY_COLOR = '#FFD700';
