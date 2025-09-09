import { Box, Typography, useTheme } from "@mui/material";
import { getColorForCategory } from "../../utils/colorUtils";

interface ColorKeyLabelProps {
  category: string;
  showText?: boolean;
}

/**
 * ColorKeyLabel component to display a colored circle and category name.
 *
 * @param param0 Props containing category name and optional showText flag.
 * @returns The rendered ColorKeyLabel component.
 */
export function ColorKeyLabel({ category, showText = true }: ColorKeyLabelProps) {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        component="span"
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: getColorForCategory(category, theme.palette.mode),
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
