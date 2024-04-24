import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  AudioLinesIcon,
  BadgeCentIcon,
  BotIcon,
  DramaIcon,
  DrumIcon,
  EllipsisIcon,
  MapPinIcon,
  MessageSquareTextIcon,
  PlusIcon,
  TimerIcon,
} from "lucide-react";
import { Logo } from "~/components/layout/logo";
import { UserDropdown } from "./user-dropdown";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

export async function InternalSidenav({ className }: { className?: string }) {
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

  return (
    <nav className={cn("border-r bg-light", className)}>
      <div className="flex h-full flex-col justify-between px-3 py-4">
        <div className="space-y-8 py-2">
          <div className="space-y-4">
            <Link href="/home">
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
            <div className="group mb-1 flex items-center justify-between px-2 text-muted">
              <div className="text-sm font-semibold">Flashcards</div>
              <Button
                className="h-fit px-1 py-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                variant="ghost"
              >
                <PlusIcon
                  size={16}
                  className="cursor-pointer stroke-[2px] hover:text-foreground"
                />
              </Button>
            </div>
            {flashcardSets.map((flashcardSet) => (
              <Button
                key={flashcardSet.name}
                className="group flex w-full justify-between gap-2 px-2 py-2.5 text-muted"
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
                    className="cursor-pointer stroke-[1.5px] text-foreground"
                  />
                </Button>
              </Button>
            ))}
          </div>
          <div className="space-y-0.5">
            <div className="group mb-1 flex items-center justify-between px-2 text-muted">
              <div className="text-sm font-semibold">Tools</div>
            </div>
            {toolsSets.map((toolSet) => (
              <Button
                key={toolSet.name}
                className="group flex w-full justify-between gap-2 px-2 py-2.5 text-muted"
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
                    className="cursor-pointer stroke-[1.5px] text-foreground"
                  />
                </Button>
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Suspense fallback={null}>
            <UserDropdown />
          </Suspense>
          {/* <Button
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
          </Button> */}
        </div>
      </div>
    </nav>
  );
}
