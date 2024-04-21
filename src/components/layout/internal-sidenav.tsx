import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { SignOutButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { LogOutIcon, UserCircle2Icon } from "lucide-react";

export async function InternalSidenav({ className }: { className?: string }) {
  const user = await currentUser();

  if (!user) {
    return null;
  }
  return (
    <nav className={cn("bg-muted border-r", className)}>
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          <Button>New Chat</Button>
        </div>
        {/* <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex items-center justify-start gap-3"
              variant="secondary"
            >
              <Image
                src={user.imageUrl}
                alt={`${user.firstName} ${user.lastName}'s profile picture`}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>
                {user.firstName} {user.lastName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[240px]">
            <DropdownMenuLabel className="py-2.5 pl-2.5 font-light">
              {user.primaryEmailAddress?.emailAddress ??
                `${user.firstName} ${user.lastName}`}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/profile">
                <UserCircle2Icon className="mr-2.5 inline-block stroke-[1.3px]" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutButton>
              <DropdownMenuItem className="cursor-pointer">
                <LogOutIcon className="mr-2.5 inline-block stroke-[1.3px]" />
                Sign Out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
