interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Reusable section wrapper for filter groups
 */
export const FilterSection = ({ title, children }: FilterSectionProps) => (
  <div className="mb-3">
    <h3 className="mb-2 text-base font-bold">{title}</h3>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);
