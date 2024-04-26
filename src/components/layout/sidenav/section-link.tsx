"use client";

import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { cn } from "~/lib/utils";
import { type IconName } from "~/server/db/icons";

export function SidenavButtonLink({
  iconName,
  label,
  href,
  isNew = false,
  ellipsis = false,
}: {
  iconName: IconName;
  label: string;
  href: string;
  isNew?: boolean;
  ellipsis?: boolean;
}) {
  const pathname = usePathname();
  return (
    <Button
      className={cn(
        "group flex w-full justify-between gap-2 px-2 py-2.5 text-muted",
        pathname === href && "font-semibold text-foreground",
      )}
      variant="ghost"
      asChild
    >
      <Link href={href}>
        <span className="flex items-center gap-2">
          <Icon
            name={iconName}
            size={24}
            className="flex-none stroke-[1.5px]"
          />
          {label}
        </span>
        <div className="h-fit flex-none px-1 py-1">
          {ellipsis && (
            <EllipsisIcon
              size={16}
              className="hidden cursor-pointer stroke-[1.5px] text-foreground group-hover:block"
            />
          )}
          {isNew && (
            <div className="text-xs font-semibold text-indigo-500 dark:text-indigo-400">
              New
            </div>
          )}
        </div>
      </Link>
    </Button>
  );
}
