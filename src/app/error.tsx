"use client"; // Error components must be Client Components

import { ShieldXIcon } from "lucide-react";
import { useEffect } from "react";
import { Separator } from "~/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-16">
      <div className="bg-primary text-primary-foreground mx-auto max-w-lg rounded-lg px-4 py-6">
        <div className="text-4xl font-bold">
          <ShieldXIcon className="mr-2 inline-block" size={48} />
          Whoops
        </div>
        <Separator className="my-2" />
        <div className="text-base">
          Something went wrong! We're sorry about that. You can try again or
          contact support.
        </div>
        <div>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Details</AccordionTrigger>
              <AccordionContent>
                <pre>{error.stack}</pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={reset} className="mt-4">
            Try again
          </Button>
          <Button variant="secondary" onClick={reset} className="mt-4" asChild>
            <Link href="/">Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}