/**
 * Renders a selectable identity user card.
 *
 * The component is implemented as a button because selecting a user is an
 * interactive action. This provides keyboard, focus, and screen-reader support
 * without extra JavaScript.
 */

import Image from "next/image";
import type { IdentityUser } from "../types/identity-user";

type IdentityUserCardProps = {
  user: IdentityUser;
  isSelected: boolean;
  onSelect: () => void;
};

export function IdentityUserCard({
  user,
  isSelected,
  onSelect,
}: IdentityUserCardProps) {
  return (
    <button
      type="button"
      className={[
        "group flex w-full items-center gap-4 rounded-3xl border bg-white p-4 text-left shadow-sm transition",
        "hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-slate-200",
        "focus:outline-none focus:ring-4 focus:ring-blue-100",
        isSelected ? "border-blue-600 ring-4 ring-blue-50" : "border-slate-200",
      ].join(" ")}
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={`View details for ${user.displayName}`}
    >
      <Image
        className="h-14 w-14 rounded-full bg-slate-100 object-cover ring-4 ring-slate-50"
        src={user.avatarUrl}
        alt="user-image"
        width={56}
        height={56}
      />

      <span className="min-w-0 flex-1">
        <span className="block truncate font-black text-slate-950">
          {user.displayName}
        </span>

        <span className="mt-1 block truncate text-sm font-medium text-slate-500">
          {user.email}
        </span>

        <span className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
            {user.accountStatus}
          </span>

          {user.requiresMFA ? (
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-orange-700">
              MFA required
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}
