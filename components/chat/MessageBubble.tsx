import type { ChatMessage } from "@/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-[12px] px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-brand-red text-white"
            : "border border-border bg-white text-brand-black"
        }`}
      >
        <p>{message.content}</p>
        <p className={`mt-1 text-[11px] ${isUser ? "text-white/70" : "text-brand-muted"}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}
