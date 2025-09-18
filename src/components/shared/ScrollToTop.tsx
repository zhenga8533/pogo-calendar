import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Box, Fab, Fade, useScrollTrigger } from "@mui/material";

function ScrollToTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100, // Show button after 100px of scroll
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 32, right: 32, zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        <Fab color="primary" size="medium" aria-label="scroll back to top">
          <ArrowUpwardIcon />
        </Fab>
      </Box>
    </Fade>
  );
}

export default ScrollToTop;
