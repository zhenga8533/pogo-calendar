import { Box, Typography, useTheme } from "@mui/material";
import { getColorForCategory } from "../../utils/colorUtils";

/**
 * ColorKeyLabel component to display a colored circle and category name.
 *
 * @param param0 Props containing category name.
 * @returns The rendered ColorKeyLabel component.
 */
export function ColorKeyLabel({ category }: { category: string }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        component="span"
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          mr: 1.5,
          backgroundColor: getColorForCategory(category, theme.palette.mode),
          border: `1px solid ${theme.palette.divider}`,
        }}
      />
      <Typography variant="body2">{category}</Typography>
    </Box>
  );
}
