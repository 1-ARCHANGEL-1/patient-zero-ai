"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useInvestigation } from "@/context/InvestigationContext";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { SuggestedQuestions } from "@/components/chat/SuggestedQuestions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function InvestigationChat() {
  const { messages, sendMessage } = useInvestigation();
  const [input, setInput] = useState("");

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInput("");
  }

  return (
    <div className="flex flex-col gap-4">
      <SuggestedQuestions onSelect={handleSend} />

      <div className="flex min-h-[220px] flex-col gap-3 rounded-[12px] border-2 border-brand-black bg-white p-4">
        {messages.length === 0 ? (
          <p className="m-auto text-sm text-brand-muted">
            Ask a question about the investigation to get started.
          </p>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-1 rounded-[12px] border-2 border-brand-black bg-white p-1"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the investigation..."
          className="h-10 flex-1 rounded-[8px] border-none bg-transparent"
        />
        <Button type="submit" size="icon" className="h-10 w-10 shrink-0">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
