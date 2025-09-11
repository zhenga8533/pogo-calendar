import { Box, Container, Divider, Link, Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";

const footerLinks = [
  { href: "https://github.com/zhenga8533/pogo-calendar", text: "App Source" },
  { href: "https://leekduck.com/events/", text: "Data Source" },
  { href: "https://github.com/zhenga8533/leak-duck", text: "Scraper Source" },
  { href: "https://github.com/zhenga8533/pogo-calendar/issues", text: "Send Feedback" },
];

const FooterLink = React.memo(
  /**
   * Renders a styled link for the footer.
   *
   * @param param0 Props for the FooterLink component.
   * @returns A styled link for the footer.
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
);

/**
 * Renders the footer component for the application.
 *
 * @returns The footer component for the application.
 */
function FooterComponent() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        p: 2,
        backgroundColor: theme.palette.mode === "dark" ? "rgba(18, 18, 18, 0.8)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(8px)",
        borderTop: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} alignItems="center" sx={{ textAlign: "center" }}>
          {/* Render links by mapping over the data array */}
          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 3 }}
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ flexWrap: "wrap", justifyContent: "center", rowGap: 1 }}
          >
            {footerLinks.map((link) => (
              <FooterLink key={link.href} href={link.href} text={link.text} />
            ))}
          </Stack>

          {/* App info and copyright */}
          <Box sx={{ maxWidth: "550px", opacity: 0.7 }}>
            <Typography variant="caption" display="block" gutterBottom>
              Built with React, TypeScript, and Material-UI. Fan project not affiliated with Niantic, Inc.
            </Typography>
            <Typography variant="caption">© {currentYear} PoGo Calendar</Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

const Footer = React.memo(FooterComponent);
export default Footer;
