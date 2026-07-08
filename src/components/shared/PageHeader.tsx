interface PageHeaderProps {
  title: string;
  description: string;
}

/**
 * Reusable page header component with consistent styling
 */
export const PageHeader = ({ title, description }: PageHeaderProps) => (
  <div className="mb-6 md:mb-8">
    <h1 className="mb-2 text-[1.75rem] font-bold tracking-tight sm:text-[2.25rem] md:text-[3rem]">
      {title}
    </h1>
    <p className="text-muted-foreground">{description}</p>
  </div>
);
