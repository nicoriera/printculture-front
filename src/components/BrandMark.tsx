/** CULTURHUB arc mark — concentric open arcs echoing a “C”. */
export default function BrandMark({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      className={className}
      aria-hidden="true">
      <path d="M70 28a32 32 0 1 0 0 44" />
      <path d="M64 40a18 18 0 1 0 0 20" opacity={0.7} />
      <path d="M58 50a6 6 0 1 0 0 0.1" opacity={0.4} />
    </svg>
  );
}
