/**
 * Reusable error state component.
 *
 * This component standardizes how recoverable UI errors are shown across the
 * application while allowing each feature to provide domain-specific messages.
 */

type AppErrorStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function AppErrorState({
  eyebrow = "Something went wrong",
  title,
  description,
  actionLabel,
  onAction,
}: AppErrorStateProps) {
  return (
    <section
      className="rounded-[2rem] border border-red-100 bg-white p-8 shadow-xl shadow-red-100/60"
      role="alert"
    >
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-700">
        {eyebrow}
      </p>

      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
        {title}
      </h1>

      <p className="mt-4 leading-7 text-slate-600">{description}</p>

      {actionLabel && onAction ? (
        <button
          className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
