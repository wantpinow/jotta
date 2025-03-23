export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-0.5">
      <h1 className="text-4xl font-light text-primary">{title}</h1>
      {description && <p className="text-muted-foreground font-regular">{description}</p>}
    </div>
  );
}
