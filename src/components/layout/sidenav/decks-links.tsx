import { api } from "~/trpc/server";
import { SidenavButtonLink } from "./section-link";

export async function DecksLinks() {
  const decks = await api.flashcards.getDecks();
  return (
    <>
      {decks.map((deck) => {
        return (
          <SidenavButtonLink
            iconName={deck.icon}
            label={deck.name}
            href={`/decks/${deck.id}`}
            key={deck.id}
            ellipsis
          />
        );
      })}
    </>
  );
}
