import { useCallback, useState } from 'react';

export type DialogType = 'settings' | 'create' | 'export';

export function useDialogs() {
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);

  const openDialog = useCallback(
    (dialog: DialogType) => setActiveDialog(dialog),
    []
  );
  const closeDialog = useCallback(() => setActiveDialog(null), []);

  return {
    activeDialog,
    openDialog,
    closeDialog,
  };
}
