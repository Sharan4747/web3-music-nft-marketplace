
export default function StrokeButton({ children, onClick, type = "button", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        group inline-flex items-center justify-center gap-2
        rounded-full
        border border-emerald-400/50
        bg-emerald-400/[0.04]
        px-6 py-2.5
        font-sans font-semibold text-emerald-300
        transition-all duration-300
        hover:-translate-y-1
        hover:border-emerald-300
        hover:bg-emerald-400/10
        hover:text-white
        hover:shadow-[0_0_22px_rgba(16,185,129,0.18)]
        active:translate-y-0
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}
