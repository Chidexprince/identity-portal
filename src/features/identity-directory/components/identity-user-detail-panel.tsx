"use client";

/**
 * Renders the expanded detail view for a selected identity user.
 *
 * The detail query is only enabled after a user is selected. This avoids
 * fetching focused identity records unnecessarily and supports the shorter
 * staleTime/gcTime strategy used for more sensitive detail data.
 */
import Image from "next/image";
import { useIdentityUser } from "@/features/identity-directory/hooks/use-identity-user";
import { IdentityDetailSkeleton } from "./identity-directory-skeletons";
import { AppPanel } from "@/shared/ui/app-panel";
import { AppErrorState } from "@/shared/ui/app-error-state";

type IdentityUserDetailPanelProps = {
  userId: number | null;
  onClose: () => void;
};

export function IdentityUserDetailPanel({
  userId,
  onClose,
}: IdentityUserDetailPanelProps) {
  const userQuery = useIdentityUser({ userId });

  if (userId === null) {
    return (
      <AppPanel className="p-5" aria-labelledby="directory-heading">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
          Details
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          Select an identity
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          Choose a user from the directory to fetch a BFF-sanitized detail
          record. Detail cache: 10s stale / 1m memory.
        </p>

        <div className="mt-6 rounded-3xl bg-blue-50 p-5 text-sm leading-7 text-blue-900">
          <strong className="font-black">Cache strategy</strong>
          <p className="mt-1">
            Detail data is fetched only on demand and is garbage-collected
            sooner than list data because it represents a focused identity
            record.
          </p>
        </div>
      </AppPanel>
    );
  }

  if (userQuery.isPending) {
    return (
      <AppPanel as="aside" className="p-6 lg:sticky lg:top-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
          Details
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          Loading identity details
        </h2>

        <div className="mt-6">
          <IdentityDetailSkeleton />
        </div>
      </AppPanel>
    );
  }

  if (userQuery.isError) {
    return (
      <aside
        className="rounded-[2rem] border border-red-100 bg-white/90 p-6 shadow-xl shadow-red-100/60 backdrop-blur lg:sticky lg:top-6"
        role="alert"
      >
        <AppErrorState
          eyebrow="Details"
          title="Unable to load identity details."
          description="The selected identity record could not be retrieved from the BFF."
          actionLabel="Retry details"
          onAction={() => userQuery.refetch()}
        />
      </aside>
    );
  }

  const user = userQuery.data.user;

  return (
    <aside
      className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur lg:sticky lg:top-6"
      aria-labelledby="identity-detail-heading"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
          Details
        </p>

        <button
          className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="mt-6 flex items-center gap-4 border-b border-slate-200 pb-6">
        <Image
          className="h-20 w-20 rounded-full bg-slate-100 object-cover ring-4 ring-slate-50"
          src={user.avatarUrl}
          alt="user-image"
          width={80}
          height={80}
        />

        <div className="min-w-0">
          <h2
            id="identity-detail-heading"
            className="truncate text-2xl font-black tracking-tight text-slate-950"
          >
            {user.displayName}
          </h2>

          <p className="mt-1 truncate text-sm font-medium text-slate-500">
            {user.email}
          </p>
        </div>
      </div>

      <dl className="mt-6 space-y-3">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
          <dt className="text-sm font-medium text-slate-500">User ID</dt>
          <dd className="text-right font-black text-slate-950">{user.id}</dd>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
          <dt className="text-sm font-medium text-slate-500">Account status</dt>
          <dd className="text-right font-black capitalize text-slate-950">
            {user.accountStatus}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
          <dt className="text-sm font-medium text-slate-500">MFA policy</dt>
          <dd className="text-right font-black text-slate-950">
            {user.requiresMFA ? "Required" : "Not required"}
          </dd>
        </div>
      </dl>

      <div className="mt-6 rounded-3xl bg-blue-50 p-5 text-sm leading-7 text-blue-900">
        <strong className="font-black">Security boundary</strong>
        <p className="mt-1">
          This detail record was fetched from the internal BFF, not directly
          from ReqRes. The API key and upstream schema remain server-side.
        </p>
      </div>
    </aside>
  );
}
