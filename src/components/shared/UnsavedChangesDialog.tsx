import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface UnsavedChangesDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function UnsavedChangesDialog({
  open,
  onClose,
  onConfirm,
  title = "Unsaved Changes",
  message = "You have unsaved changes. Are you sure you want to discard them?",
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="primary">
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
}
