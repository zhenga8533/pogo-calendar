import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  title: string;
  count: number;
  label: string;
  color?: string;
  className?: string;
}

export const SectionHeader = ({ title, count, label, color, className }: SectionHeaderProps) => (
  <div className={cn('mb-3 flex flex-wrap items-center gap-2.5', className)}>
    <h2 className="text-xl font-bold leading-tight">{title}</h2>
    <Badge
      className="min-w-0"
      style={color ? { backgroundColor: color, color: '#fff' } : undefined}
    >
      {count} {label}
    </Badge>
  </div>
);
