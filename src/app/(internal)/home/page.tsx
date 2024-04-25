import { ChevronRightIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "~/components/layout/page-header";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { api } from "~/trpc/server";

export default async function HomePage() {
  const decks = await api.flashcards.getDecks();
  const totalCards = decks.reduce((acc, deck) => acc + deck.cards.length, 0);
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <PageHeader title="Welcome Back" className="mb-1" />
          <div className="mb-6 text-sm text-muted">
            You've got {totalCards} card{totalCards === 1 ? "" : "s"} to study
          </div>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <SettingsIcon size={22} />
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={8} side="left">
                Preferences
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button asChild>
            <Link href="/decks/new">New Deck</Link>
          </Button>
        </div>
      </div>
      <div className="grid w-full grid-cols-3 gap-4">
        {decks.map((deck) => (
          <Link key={deck.id} href={`/decks/${deck.id}`}>
            <div className="rounded-lg border p-4 transition-colors duration-200 hover:bg-light">
              <div className="mb-4 flex gap-2">
                <Icon name={deck.icon} size={28} />
                <div>{deck.name}</div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-sm text-muted">
                  {deck.cards.length} card{deck.cards.length === 1 ? "" : "s"}
                </div>
                <div className="space-x-1">
                  <div className="grid grid-cols-4 items-end gap-[2px]">
                    <div className="h-[4px] w-[3px] bg-green-500"></div>
                    <div className="h-[8px] w-[3px] bg-green-500"></div>
                    <div className="h-[12px] w-[3px] bg-muted"></div>
                    <div className="h-[16px] w-[3px] bg-muted"></div>
                  </div>
                  {/* <div className="h-4 w-4 rounded-full border-2 bg-transparent"></div> */}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-right">
        <Button
          variant="link"
          asChild
          className="text-muted hover:text-foreground"
        >
          <Link href="/decks">
            All Decks
            <ChevronRightIcon size={16} className="ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
