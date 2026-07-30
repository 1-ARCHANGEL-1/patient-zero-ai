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
          className="rounded-full border border-border bg-white px-3.5 py-1.5 text-sm text-brand-black transition-colors hover:border-brand-red hover:text-brand-red"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
