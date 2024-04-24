"use client";
import { ArrowBigUp } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

export default function ChatPage() {
  // -48px
  const [inputValue, setInputValue] = useState("");
  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col justify-end gap-4 rounded-lg border bg-light px-4 py-3">
      <div className="mx-auto w-fit py-24 text-center">
        <div className="text-3xl font-semibold">JottaGPT</div>
        <div className="text-muted">Your Spanish Amigos</div>
      </div>
      <div className="grid grid-cols-2 gap-2 px-4">
        <div className="rounded-lg border px-4 py-3 text-sm">
          <div className="font-semibold">Chat with Brian</div>
          <div className="text-muted">Online</div>
        </div>
        <div className="rounded-lg border px-4 py-3 text-sm">
          <div className="font-semibold">Chat with Sarah</div>
          <div className="text-muted">Offline</div>
        </div>
        <div className="rounded-lg border px-4 py-3 text-sm">
          <div className="font-semibold">Chat with Brian</div>
          <div className="text-muted">Online</div>
        </div>
        <div className="rounded-lg border px-4 py-3 text-sm">
          <div className="font-semibold">Chat with Brian</div>
          <div className="text-muted">Online</div>
        </div>
      </div>
      <div className="relative">
        <Textarea
          rows={1}
          className="resize-none pe-[58px]"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
        />
        <Button
          variant={inputValue ? "default" : "secondary"}
          size="icon"
          className="absolute bottom-2 end-2"
        >
          <ArrowBigUp size={24} />
        </Button>
      </div>
    </div>
  );
}
