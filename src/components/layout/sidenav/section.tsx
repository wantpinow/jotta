import { Skeleton } from "~/components/ui/skeleton";

export function SidenavSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-0.5">{children}</div>;
}
export function SidenavSectionTitle({ title }: { title: string }) {
  return (
    <div className="group mb-1 flex items-center justify-between px-2 text-muted">
      <div className="text-sm font-semibold">{title}</div>
    </div>
  );
}

export function SidenavSkeleton() {
  return (
    <div className="h-10 py-0.5">
      <Skeleton className="h-full bg-secondary" />
    </div>
  );
}
