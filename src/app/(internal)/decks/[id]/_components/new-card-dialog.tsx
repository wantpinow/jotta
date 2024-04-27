"use client";

import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { NewCardForm } from "./new-card-form";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export function NewCardDialog({ deckId }: { deckId: string }) {
  const [open, setOpen] = useState(false);
  useHotkeys("meta+enter", () => setOpen(true), [setOpen], {
    preventDefault: true,
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          New Card
        </Button>
      </DialogTrigger>
      <DialogContent>
        <NewCardForm onSubmit={() => setOpen(false)} deckId={deckId} />
      </DialogContent>
    </Dialog>
  );
}
