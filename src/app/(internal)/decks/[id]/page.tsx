import { PageHeader } from "~/components/layout/page-header";
import { api } from "~/trpc/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import Link from "next/link";
import { Icon } from "~/components/ui/icon";
import { NewCardDialog } from "./_components/new-card-dialog";

export default async function DeckPage({ params }: { params: { id: string } }) {
  const deck = await api.flashcards.getDeck({ id: params.id });
  if (deck === undefined) {
    throw new Error("Deck not found");
  }
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/home">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/home">Decks</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{deck.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative">
        <div className="flex justify-between">
          <PageHeader title={deck.name} />
          <NewCardDialog deckId={deck.id} />
        </div>
        <Icon
          name={deck.icon}
          size={144}
          className="absolute right-0 top-0 -z-10 -translate-x-[20px] -translate-y-[40px] text-indigo-200 blur-[5px] dark:text-indigo-900"
        />
      </div>
      <div className="space-y-2">
        {deck.cards.map((card) => (
          <div key={card.id} className="rounded-lg border bg-light p-4 shadow">
            <div className="text-lg font-bold">{card.front}</div>
            <div className="text-sm text-muted">{card.back}</div>
          </div>
        ))}
      </div>
      {deck.cards.length === 0 && (
        <div className="py-4 text-center text-muted">No cards yet</div>
      )}
    </div>
  );
}
