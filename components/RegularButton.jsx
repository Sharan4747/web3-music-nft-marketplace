
export default function RegularButton(props) {
  return (
    <button
      type="button"
      onClick={props.clickFunction}
      disabled={props.disabled}
      className="
        group relative inline-flex items-center justify-center
        overflow-hidden rounded-full
        border border-emerald-300/30
        bg-gradient-to-r from-emerald-500 to-emerald-400
        px-6 py-2.5
        font-semibold text-[#02110C]
        shadow-[0_0_20px_rgba(16,185,129,0.15)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]
        active:translate-y-0
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      <span className="relative z-10 flex items-center gap-2">
        {props.text}
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </button>
  );
}
