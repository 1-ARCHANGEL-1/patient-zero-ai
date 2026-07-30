import { suggestedQuestions } from "@/lib/mockData";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestedQuestions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          className="rounded-full border-none bg-brand-red px-3.5 py-1.5 text-sm text-white transition-colors hover:bg-[var(--color-brand-red-hover)]"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
