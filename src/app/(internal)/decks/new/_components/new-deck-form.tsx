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
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.enum(iconNames),
});

export function NewDeckForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const submitDeck = api.flashcards.createDeck.useMutation({
    onMutate: () => setLoading(true),
    onSuccess: ([deck]) => {
      if (deck === undefined) return;
      router.push(`/decks/${deck.id}`);
      toast.success(`${deck.name} created`);
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create deck");
      setLoading(false);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    submitDeck.mutate(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Describe your deck..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Icon</FormLabel>

              <IconSelect
                value={field.value}
                setValue={(value) => form.setValue("icon", value)}
              />

              <FormDescription>
                A helpful icon to identify your deck.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={cn("ml-auto block", loading && "animate-pulse")}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create deck"}
        </Button>
      </form>
    </Form>
  );
}
