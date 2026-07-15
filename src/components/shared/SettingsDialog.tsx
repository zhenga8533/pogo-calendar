import { MonitorCog, Moon, Sun, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { dayOptions } from '../../config/eventFilter';
import { useSettingsContext } from '../../hooks/useSettingsContext';
import { fetchTimezones } from '../../services/eventService';
import type { Settings, ThemeSetting, Timezone } from '../../types/settings';
import { Button } from '../ui/button';
import { Combobox } from '../ui/combobox';
import { IconButton } from '../ui/icon-button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

const themeOptions: { value: ThemeSetting; text: string; Icon: React.ElementType }[] = [
  { value: 'light', text: 'Light', Icon: Sun },
  { value: 'dark', text: 'Dark', Icon: Moon },
  { value: 'auto', text: 'Auto', Icon: MonitorCog },
];

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onSettingsChange: (newSettings: Partial<Settings>) => void;
}

function SettingsDialogComponent({ open, onClose, onSettingsChange }: SettingsDialogProps) {
  const { settings } = useSettingsContext();
  const [timezones, setTimezones] = useState<Timezone[]>([
    { text: settings.timezone, value: settings.timezone },
  ]);
  const [loadingTimezones, setLoadingTimezones] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (open) {
      const getTimezones = async () => {
        setLoadingTimezones(true);
        try {
          const tzData = await fetchTimezones();
          const userTimezone = settings.timezone;
          const userTimezoneInList = tzData.some((tz) => tz.value === userTimezone);

          if (cancelled) return;
          if (!userTimezoneInList) {
            setTimezones([{ text: userTimezone, value: userTimezone }, ...tzData]);
          } else {
            setTimezones(tzData);
          }
        } catch (error) {
          console.error('Failed to fetch timezones:', error);
        } finally {
          if (!cancelled) setLoadingTimezones(false);
        }
      };
      void getTimezones();
    }
    return () => {
      cancelled = true;
    };
  }, [open, settings.timezone]);

  const handleSettingChange = (field: keyof Settings, value: string | number | boolean) => {
    onSettingsChange({ [field]: value });
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="max-w-md">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <IconButton onClick={onClose} aria-label="Close settings">
            <X className="h-4 w-4" />
          </IconButton>
        </SheetHeader>
        <SheetBody className="space-y-6">
          <div className="space-y-2.5">
            <Label>Appearance</Label>
            <ToggleGroup
              type="single"
              value={settings.theme}
              onValueChange={(value) => value && handleSettingChange('theme', value)}
              className="grid w-full grid-cols-3 gap-2 bg-transparent p-0"
            >
              {themeOptions.map(({ value, text, Icon }) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  className="flex flex-col gap-1 rounded-lg border border-border py-3 data-[state=on]:border-primary data-[state=on]:bg-accent"
                >
                  <Icon className="h-5 w-5" />
                  {text}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="space-y-2.5">
            <Label>Calendar Display</Label>
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Week Starts On</span>
              <Select
                value={String(settings.firstDay)}
                onValueChange={(value) => handleSettingChange('firstDay', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dayOptions.map((day) => (
                    <SelectItem key={day.value} value={String(day.value)}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label>Time & Date</Label>
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Time Zone</span>
              <Combobox
                value={settings.timezone}
                onChange={(value) => handleSettingChange('timezone', value)}
                loading={loadingTimezones && timezones.length === 1}
                options={timezones.map((tz) => ({ value: tz.value, label: tz.text }))}
                placeholder="Select timezone"
                searchPlaceholder="Search timezones..."
              />
            </div>
            <ToggleGroup
              type="single"
              value={String(settings.hour12)}
              onValueChange={(value) => value && handleSettingChange('hour12', value === 'true')}
              className="grid w-full grid-cols-2 gap-2 bg-transparent p-0"
            >
              <ToggleGroupItem
                value="true"
                className="rounded-lg border border-border py-2 data-[state=on]:border-primary data-[state=on]:bg-accent"
              >
                12-hour
              </ToggleGroupItem>
              <ToggleGroupItem
                value="false"
                className="rounded-lg border border-border py-2 data-[state=on]:border-primary data-[state=on]:bg-accent"
              >
                24-hour
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </SheetBody>
        <div className="flex shrink-0 justify-end border-t border-border px-4 py-3">
          <Button onClick={onClose}>Done</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export const SettingsDialog = React.memo(SettingsDialogComponent);
SettingsDialog.displayName = 'SettingsDialog';
