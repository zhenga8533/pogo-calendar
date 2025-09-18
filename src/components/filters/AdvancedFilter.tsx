import { Autocomplete, Chip, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import type { Filters } from "../../types/filters";

interface AdvancedFilterProps {
  filters: Filters;
  handleFilterChange: (field: keyof Filters, value: any) => void;
  allPokemon: string[];
  allBonuses: string[];
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Stack spacing={2}>
    <Typography variant="overline" color="text.secondary">
      {title}
    </Typography>
    {children}
  </Stack>
);

function AdvancedFilter({ filters, handleFilterChange, allPokemon, allBonuses }: AdvancedFilterProps) {
  return (
    <Stack spacing={4}>
      <Section title="Advanced Filters">
        <Autocomplete
          multiple
          options={allPokemon}
          value={filters.pokemonSearch}
          onChange={(_, newValue) => handleFilterChange("pokemonSearch", newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
          }
          renderInput={(params) => (
            <TextField {...params} variant="filled" label="Filter by Pokémon" placeholder="Select Pokémon" />
          )}
        />
        <Autocomplete
          multiple
          options={allBonuses}
          value={filters.bonusSearch}
          onChange={(_, newValue) => handleFilterChange("bonusSearch", newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
          }
          renderInput={(params) => (
            <TextField {...params} variant="filled" label="Filter by Bonus" placeholder="Select Bonuses" />
          )}
        />
      </Section>
    </Stack>
  );
}

export default AdvancedFilter;
