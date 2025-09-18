import { Divider, Stack, Typography } from "@mui/material";

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="h6" component="h3" fontWeight="bold">
        {title}
      </Typography>
      {children}
      <Divider sx={{ pt: 1 }} />
    </Stack>
  );
}
