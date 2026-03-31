import { Card, CardContent } from "@/components/ui/card";

export default function MetricCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--background))]">
          <Icon className="h-5 w-5 text-foreground/60" />
        </div>
        <div>
          <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-heading font-semibold text-foreground">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
