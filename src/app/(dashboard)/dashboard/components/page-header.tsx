export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[hsl(var(--muted))]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
