interface StatusBadgeProps {
  label: string;
  tone?: "green" | "red" | "amber" | "neutral";
}

const toneClasses: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  green: "bg-risk-low-bg text-risk-low border-risk-low-border",
  red: "bg-risk-high-bg text-risk-high border-risk-high-border",
  amber: "bg-risk-medium-bg text-risk-medium border-risk-medium-border",
  neutral: "bg-white/10 text-white border-white/20",
};

export function StatusBadge({ label, tone = "green" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
