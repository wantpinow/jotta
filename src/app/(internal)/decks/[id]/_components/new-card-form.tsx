"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { IconSelect } from "~/components/ui/icon-select";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { iconNames } from "~/server/db/icons";
import { api } from "~/trpc/react";

const formSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
});

export function NewCardForm({
  deckId,
  onSubmit,
}: {
  deckId: string;
  onSubmit?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      front: "",
      back: "",
    },
  });

  const submitCard = api.flashcards.createCard.useMutation({
    onMutate: () => setLoading(true),
    onSuccess: ([card]) => {
      if (card === undefined) return;
      router.refresh();
      toast.success(`Card created`);
      if (onSubmit) {
        onSubmit();
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create card");
      setLoading(false);
    },
  });

  async function onFormSubmit(values: z.infer<typeof formSchema>) {
    submitCard.mutate({ deckId, ...values });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="text-lg font-bold">New Card</div>
        <FormField
          control={form.control}
          name="front"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Front</FormLabel>
              <FormControl>
                <Input placeholder="English..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="back"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Back</FormLabel>
              <FormControl>
                <Input placeholder="Spanish..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={cn("ml-auto block", loading && "animate-pulse")}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Card"}
        </Button>
      </form>
    </Form>
  );
}
