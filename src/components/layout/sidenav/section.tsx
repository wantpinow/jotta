import { EllipsisIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { IconName } from "~/server/db/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import Link from "next/link";

export function SidenavSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-0.5">{children}</div>;
}
export function SidenavSectionTitle({ title }: { title: string }) {
  return (
    <div className="group mb-1 flex items-center justify-between px-2 text-muted">
      <div className="text-sm font-semibold">{title}</div>
      {/* <Button
        className="h-fit px-1 py-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        variant="ghost"
      >
        <PlusIcon
          size={16}
          className="cursor-pointer stroke-[2px] hover:text-foreground"
        />
      </Button> */}
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
