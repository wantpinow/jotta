import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { LogOutIcon, UserCircle2Icon } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { SignOutButton } from "@clerk/nextjs";

export async function UserDropdown() {
  const user = await currentUser();
  if (user === null) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex h-fit w-full items-center justify-start gap-3 px-2 py-1.5"
          variant="ghost"
        >
          <Image
            src={user.imageUrl}
            alt={`${user.firstName} ${user.lastName}'s profile picture`}
            width={34}
            height={34}
            className="rounded-full"
          />
          <span className="font-normal tracking-wide">
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
        <ThemeToggle />
        <DropdownMenuSeparator />
        <SignOutButton>
          <DropdownMenuItem className="cursor-pointer">
            <LogOutIcon className="mr-2.5 inline-block stroke-[1.3px]" />
            Sign Out
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
