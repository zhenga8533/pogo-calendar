import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CalendarEvent } from '../../types/events';
import { Button } from '../ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CategoryExportPanel } from './CategoryExportPanel';
import { SpecificEventExportPanel } from './SpecificEventExportPanel';

interface ExportEventDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (selectedEvents: CalendarEvent[]) => void;
  allEvents: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  savedEventIds: string[];
}

export function ExportEventDialog({
  open,
  onClose,
  onExport,
  allEvents,
  filteredEvents,
  savedEventIds,
}: ExportEventDialogProps) {
  const [tab, setTab] = useState<'category' | 'specific'>('category');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      setTab('category');
      setSelectedCategories([]);
      setSelectedEventIds([]);
      setSearchTerm('');
    }
  }, [open]);

  const allCategories = useMemo(
    () => Array.from(new Set(allEvents.map((e) => e.extendedProps.category))).sort(),
    [allEvents]
  );

  const eventsToList = useMemo(
    () => filteredEvents.filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [filteredEvents, searchTerm]
  );

  const handleExportClick = useCallback(() => {
    let eventsToExport: CalendarEvent[];
    if (tab === 'category') {
      eventsToExport = allEvents.filter((event) => selectedCategories.includes(event.extendedProps.category));
    } else {
      eventsToExport = allEvents.filter((event) => selectedEventIds.includes(event.extendedProps.article_url));
    }
    onExport(eventsToExport);
    onClose();
  }, [tab, allEvents, selectedCategories, selectedEventIds, onExport, onClose]);

  const exportCount = tab === 'category' ? selectedCategories.length : selectedEventIds.length;
  const isExportDisabled = exportCount === 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl" fullScreenOnMobile>
        <DialogHeader>
          <DialogTitle>Select Events to Export</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Tabs value={tab} onValueChange={(v) => setTab(v as 'category' | 'specific')}>
            <TabsList>
              <TabsTrigger value="category">By Category</TabsTrigger>
              <TabsTrigger value="specific">By Specific Event</TabsTrigger>
            </TabsList>
            <TabsContent value="category">
              <CategoryExportPanel
                allCategories={allCategories}
                selectedCategories={selectedCategories}
                onSelectionChange={setSelectedCategories}
              />
            </TabsContent>
            <TabsContent value="specific">
              <Input
                placeholder="Search within filtered events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2"
              />
              <SpecificEventExportPanel
                eventsToList={eventsToList}
                filteredEvents={filteredEvents}
                savedEventIds={savedEventIds}
                selectedEventIds={selectedEventIds}
                onSelectionChange={setSelectedEventIds}
              />
            </TabsContent>
          </Tabs>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExportClick} disabled={isExportDisabled}>
            Export ({exportCount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
