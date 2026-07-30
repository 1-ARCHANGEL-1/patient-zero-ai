interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line x1="20" y1="20" x2="8" y2="10" stroke="#9CA3AF" strokeWidth="1" />
      <line x1="20" y1="20" x2="32" y2="9" stroke="#9CA3AF" strokeWidth="1" />
      <line x1="20" y1="20" x2="33" y2="24" stroke="#9CA3AF" strokeWidth="1" />
      <line x1="20" y1="20" x2="10" y2="32" stroke="#9CA3AF" strokeWidth="1" />
      <circle cx="20" cy="20" r="6" fill="#0A0A0A" />
      <circle cx="8" cy="10" r="3" fill="#DC2626" />
      <circle cx="32" cy="9" r="3" fill="#DC2626" />
      <circle cx="33" cy="24" r="3" fill="#DC2626" />
      <circle cx="10" cy="32" r="3" fill="#DC2626" />
    </svg>
  );
}
