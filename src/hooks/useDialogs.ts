import { useCallback, useState } from "react";

export function useDialogs() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const handleSettingsOpen = useCallback(() => setSettingsOpen(true), []);
  const handleSettingsClose = useCallback(() => setSettingsOpen(false), []);

  const handleCreateOpen = useCallback(() => setCreateDialogOpen(true), []);
  const handleCreateClose = useCallback(() => setCreateDialogOpen(false), []);

  const handleExportOpen = useCallback(() => setExportDialogOpen(true), []);
  const handleExportClose = useCallback(() => setExportDialogOpen(false), []);

  return {
    settingsOpen,
    createDialogOpen,
    exportDialogOpen,
    handleSettingsOpen,
    handleSettingsClose,
    handleCreateOpen,
    handleCreateClose,
    handleExportOpen,
    handleExportClose,
  };
}
