import { Box, Container, Divider, Link, Stack, Typography } from "@mui/material";

/**
 * A link component for the footer section.
 *
 * @param param0 Props including href and text for the footer link.
 * @returns A footer link component.
 */
function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      variant="body2"
      target="_blank"
      rel="noopener noreferrer"
      sx={(theme) => ({
        color: theme.palette.text.secondary,
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
          color: theme.palette.text.primary,
        },
      })}
    >
      {text}
    </Link>
  );
}

/**
 * Footer component that displays links and copyright information.
 *
 * @returns The footer component with links and copyright information.
 */
function Footer() {
  return (
    <Box
      component="footer"
      sx={(theme) => ({
        p: 2,
        backgroundColor: theme.palette.mode === "dark" ? "rgba(18, 18, 18, 0.8)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(8px)",
        color: theme.palette.text.primary,
        borderTop: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} alignItems="center" sx={{ textAlign: "center" }}>
          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 3 }}
            divider={<Divider orientation="vertical" flexItem sx={{ borderColor: (theme) => theme.palette.divider }} />}
            sx={{ flexWrap: "wrap", justifyContent: "center", rowGap: 1 }}
          >
            <FooterLink href="https://github.com/zhenga8533/pogo-calendar" text="App Source" />
            <FooterLink href="https://leekduck.com/events/" text="Data Source" />
            <FooterLink href="https://github.com/zhenga8533/leak-duck" text="Scraper Source" />
            <FooterLink href="https://github.com/zhenga8533/pogo-calendar/issues" text="Send Feedback" />
          </Stack>

          <Box sx={{ maxWidth: "550px", opacity: 0.7 }}>
            <Typography variant="caption" display="block" gutterBottom>
              Built with React, TypeScript, and Material-UI. Fan project not affiliated with Niantic, Inc.
            </Typography>
            <Typography variant="caption">© {new Date().getFullYear()} PoGo Calendar</Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
