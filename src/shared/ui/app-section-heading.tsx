/**
 * Reusable section heading for dashboard panels.
 *
 * It keeps eyebrow/title styling consistent while allowing each feature to
 * provide its own copy and optional right-side metadata.
 */

import type { ReactNode } from "react";

type AppSectionHeadingProps = {
  eyebrow: string;
  title: string;
  id?: string;
  action?: ReactNode;
};

export function AppSectionHeading({
  eyebrow,
  title,
  id,
  action,
}: AppSectionHeadingProps) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
          {eyebrow}
        </p>

        <h2
          id={id}
          className="mt-1 text-2xl font-black tracking-tight text-slate-950"
        >
          {title}
        </h2>
      </div>

      {action}
    </div>
  );
}
