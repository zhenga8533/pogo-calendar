import { Box, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import { getColorForCategory } from "../../utils/colorUtils";

interface ColorKeyLabelProps {
  category: string;
  showText?: boolean;
}

/**
 * Renders a label with a colored dot representing the category.
 *
 * @param param0 Props for the ColorKeyLabel component.
 * @returns A label with a colored dot representing the category.
 */
function ColorKeyLabelComponent({ category, showText = true }: ColorKeyLabelProps) {
  const theme = useTheme();

  const backgroundColor = useMemo(
    () => getColorForCategory(category, theme.palette.mode),
    [category, theme.palette.mode]
  );

  // Render the color key label.
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        component="span"
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor,
          border: `1px solid ${theme.palette.divider}`,
        }}
      />
      {showText && (
        <Typography ml={1.5} variant="body2">
          {category}
        </Typography>
      )}
    </Box>
  );
}

export const ColorKeyLabel = React.memo(ColorKeyLabelComponent);
