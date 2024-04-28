"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export function PosExample() {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("No Result Yet");

  const processMutation = api.ml.process.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (res) => {
      setResult(JSON.stringify(res, null, 2));
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        processMutation.mutate({
          text: input,
          language: "en",
        });
      }}
    >
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <Button className="block ml-auto">
        {loading ? "Processing..." : "Process"}
      </Button>
      <pre>{result}</pre>
    </form>
  );
}
