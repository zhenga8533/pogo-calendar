import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link } from "@mui/material";

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * InfoDialog component to display information about the app.
 *
 * @param param0 Props containing open state and close handler.
 * @returns The rendered InfoDialog component.
 */
function InfoDialog({ open, onClose }: InfoDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>About This App</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This is a Pokémon GO event calendar created using React, TypeScript, and Material-UI.
        </DialogContentText>
        <DialogContentText sx={{ mt: 2 }}>
          You can search, filter by category, date, and time of day, and save your favorite events to create a
          personalized schedule. Your filters and saved events are stored in your browser's local storage.
        </DialogContentText>
        <DialogContentText sx={{ mt: 2 }}>
          The source code for this app is available on{" "}
          <Link href="https://github.com/zhenga8533/pogo-calendar" target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
          .
        </DialogContentText>
        <DialogContentText sx={{ mt: 2 }}>
          Event data is gratefully sourced from{" "}
          <Link href="https://leekduck.com/events/" target="_blank" rel="noopener noreferrer">
            LeekDuck.com
          </Link>{" "}
          using a custom scraper, the code for which is also available on{" "}
          <Link href="https://github.com/zhenga8533/leak-duck" target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
          .
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default InfoDialog;
