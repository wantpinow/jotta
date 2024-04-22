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
import {
  AudioLinesIcon,
  BadgeCentIcon,
  BotIcon,
  CookingPotIcon,
  DramaIcon,
  DrumIcon,
  EllipsisIcon,
  LogOutIcon,
  MapPinIcon,
  MessageSquareTextIcon,
  PlusIcon,
  TimerIcon,
  UserCircle2Icon,
} from "lucide-react";
import { Logo } from "./logo";

export async function InternalSidenav({ className }: { className?: string }) {
  const user = await currentUser();

  const flashcardSets = [
    {
      name: "Locations",
      icon: MapPinIcon,
    },
    {
      name: "Regular Verbs",
      icon: DrumIcon,
    },
    {
      name: "Going Out",
      icon: DramaIcon,
    },
  ];

  const toolsSets = [
    {
      name: "Phrase Builder",
      icon: BotIcon,
    },
    {
      name: "Smart Transcription",
      icon: AudioLinesIcon,
    },
    {
      name: "JottaGPT",
      icon: MessageSquareTextIcon,
    },
  ];

  if (!user) {
    return null;
  }
  return (
    <nav className={cn("bg-light border-r", className)}>
      <div className="flex h-full flex-col justify-between px-3 py-4">
        <div className="space-y-8 py-2">
          <div className="space-y-4">
            <Link href="/">
              <Logo className="px-2" />
            </Link>
            <Button
              className="flex w-full items-center justify-start gap-2 px-2"
              variant="secondary"
            >
              <TimerIcon size={24} className="stroke-[1.5px]" />
              Start Session
            </Button>
          </div>
          <div className="space-y-0.5">
            <div className="text-muted group mb-1 flex items-center justify-between px-2">
              <div className="text-sm font-semibold">Flashcards</div>
              <Button
                className="h-fit px-1 py-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                variant="ghost"
              >
                <PlusIcon
                  size={16}
                  className="hover:text-foreground cursor-pointer stroke-[2px]"
                />
              </Button>
            </div>
            {flashcardSets.map((flashcardSet) => (
              <Button
                key={flashcardSet.name}
                className="text-muted group flex w-full justify-between gap-2 px-2 py-2.5"
                variant="ghost"
              >
                <span className="flex items-center gap-2">
                  {/* <BadgeCentIcon size={24} className="stroke-[1.5px]" /> */}
                  {<flashcardSet.icon size={24} className="stroke-[1.5px]" />}
                  {flashcardSet.name}
                </span>
                <Button
                  asChild
                  className="hidden h-fit px-1 py-1 group-hover:block"
                  variant="ghost"
                >
                  <EllipsisIcon
                    size={24}
                    className="text-foreground cursor-pointer stroke-[1.5px]"
                  />
                </Button>
              </Button>
            ))}
          </div>
          <div className="space-y-0.5">
            <div className="text-muted group mb-1 flex items-center justify-between px-2">
              <div className="text-sm font-semibold">Tools</div>
            </div>
            {toolsSets.map((toolSet) => (
              <Button
                key={toolSet.name}
                className="text-muted group flex w-full justify-between gap-2 px-2 py-2.5"
                variant="ghost"
              >
                <span className="flex items-center gap-2">
                  {<toolSet.icon size={24} className="stroke-[1.5px]" />}
                  {toolSet.name}
                </span>
                <Button
                  asChild
                  className="hidden h-fit px-1 py-1 group-hover:block"
                  variant="ghost"
                >
                  <EllipsisIcon
                    size={24}
                    className="text-foreground cursor-pointer stroke-[1.5px]"
                  />
                </Button>
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Button
            className="flex h-fit w-full items-center justify-start gap-3 px-2 py-1.5"
            variant="ghost"
          >
            <BadgeCentIcon
              size={32}
              className="inline-block w-[34px] stroke-[1px]"
            />
            <span className="h-fit text-left font-normal">
              6.9k tokens left
            </span>
          </Button>
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
      </div>
    </nav>
  );
}
