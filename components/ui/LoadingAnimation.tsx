export function LoadingAnimation() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="size-1.5 rounded-full bg-brand-red animate-bounce [animation-delay:-0.3s]" />
      <span className="size-1.5 rounded-full bg-brand-red animate-bounce [animation-delay:-0.15s]" />
      <span className="size-1.5 rounded-full bg-brand-red animate-bounce" />
    </span>
  );
}
