import { RotateCcw } from 'lucide-react';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';

interface FilterActionsProps {
  onReset: () => void;
}

/**
 * Reusable filter actions component with reset button
 */
export const FilterActions = ({ onReset }: FilterActionsProps) => (
  <>
    <Separator />
    <div className="mt-3 flex flex-col flex-wrap gap-2 md:flex-row md:justify-end">
      <Button variant="outline" onClick={onReset}>
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
    </div>
  </>
);
