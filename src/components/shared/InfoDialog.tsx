import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link } from "@mui/material";
import React from "react";

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
}

const links = {
  appSource: "https://github.com/zhenga8533/pogo-calendar",
  dataSource: "https://leekduck.com/events/",
  scraperSource: "https://github.com/zhenga8533/leak-duck",
};

/**
 * Renders a dialog displaying information about the app.
 *
 * @param param0 Props for the InfoDialog component.
 * @returns A dialog displaying information about the app.
 */
function InfoDialogComponent({ open, onClose }: InfoDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>About This App</DialogTitle>
      <DialogContent>
        <DialogContentText paragraph>
          This is a Pokémon GO event calendar created using React, TypeScript, and Material-UI.
        </DialogContentText>
        <DialogContentText paragraph>
          You can search, filter by category, date, and time of day, and save your favorite events to create a
          personalized schedule. Your filters and saved events are stored in your browser's local storage.
        </DialogContentText>
        <DialogContentText paragraph>
          The source code for this app is available on{" "}
          <Link href={links.appSource} target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
          .
        </DialogContentText>
        <DialogContentText>
          Event data is gratefully sourced from{" "}
          <Link href={links.dataSource} target="_blank" rel="noopener noreferrer">
            LeekDuck.com
          </Link>{" "}
          using a custom scraper, the code for which is also available on{" "}
          <Link href={links.scraperSource} target="_blank" rel="noopener noreferrer">
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

const InfoDialog = React.memo(InfoDialogComponent);
export default InfoDialog;
