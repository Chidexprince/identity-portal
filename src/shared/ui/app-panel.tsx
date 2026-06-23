/**
 * Reusable panel/card shell for application UI sections.
 *
 * This keeps repeated panel styling consistent across feature screens
 * without forcing business-specific layout into the shared layer.
 */

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type AppPanelProps<TElement extends ElementType = "section"> = {
  as?: TElement;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className">;

export function AppPanel<TElement extends ElementType = "section">({
  as,
  children,
  className = "",
  ...props
}: AppPanelProps<TElement>) {
  const Component = as ?? "section";

  return (
    <Component
      className={[
        "rounded-[2rem] border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/70 backdrop-blur",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}
