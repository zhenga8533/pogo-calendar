import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to manage the state and logic for a text note editor.
 *
 * @param initialNote The initial text of the note.
 * @param onSave Callback function to execute when the note is saved.
 * @param onCloseDialog Callback function to close the parent dialog/modal.
 * @returns An object with state and handlers for the note editor.
 */
export function useNoteEditor(initialNote: string, onSave: (noteText: string) => void, onCloseDialog: () => void) {
  const [noteText, setNoteText] = useState(initialNote);
  const [isDirty, setIsDirty] = useState(false);
  const [isUnsavedChangesDialogOpen, setUnsavedChangesDialogOpen] = useState(false);

  useEffect(() => {
    setNoteText(initialNote);
    setIsDirty(false);
  }, [initialNote]);

  const handleNoteChange = useCallback((text: string) => {
    setNoteText(text);
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    onSave(noteText);
    setIsDirty(false);
    onCloseDialog();
  }, [noteText, onSave, onCloseDialog]);

  const handleClose = useCallback(() => {
    if (isDirty) {
      setUnsavedChangesDialogOpen(true);
    } else {
      onCloseDialog();
    }
  }, [isDirty, onCloseDialog]);

  const handleConfirmClose = useCallback(() => {
    setUnsavedChangesDialogOpen(false);
    onCloseDialog();
  }, [onCloseDialog]);

  const closeUnsavedDialog = useCallback(() => {
    setUnsavedChangesDialogOpen(false);
  }, []);

  return {
    noteText,
    isDirty,
    isUnsavedChangesDialogOpen,
    handleNoteChange,
    handleSave,
    handleClose,
    handleConfirmClose,
    closeUnsavedDialog,
  };
}
