import { cn } from "~/lib/utils";

export function PageHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 text-3xl font-bold", className)}>{title}</div>
  );
}
