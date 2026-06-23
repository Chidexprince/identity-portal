"use client";

/**
 * Feature container for the identity directory dashboard.
 *
 * This component owns the list query state and selected-user state. It composes
 * smaller UI components but does not know anything about ReqRes or upstream
 * response shapes.
 */

import { useState } from "react";
import { useIdentityUsers } from "@/features/identity-directory/hooks/use-identity-users";
import { IdentityDirectorySkeleton } from "./identity-directory-skeletons";
import { IdentityUserCard } from "./identity-user-card";
import { IdentityUserDetailPanel } from "./identity-user-detail-panel";
import { AppErrorState } from "@/shared/ui/app-error-state";
import { AppSectionHeading } from "@/shared/ui/app-section-heading";
import { AppPanel } from "@/shared/ui/app-panel";

export function IdentityDirectoryDashboard() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const usersQuery = useIdentityUsers();

  if (usersQuery.isPending) {
    return (
      <main
        className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        aria-busy="true"
      >
        <section className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-700">
            Enterprise Identity Portal
          </p>

          <h1 className="mt-3 max-w-4xl text-5xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
            Identity Directory
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Loading identity records from the BFF with an intentional TanStack
            Query cache lifecycle.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <AppPanel className="p-5" aria-labelledby="directory-heading">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  Directory
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  Identity users
                </h2>
              </div>
            </div>

            <IdentityDirectorySkeleton />
          </AppPanel>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              Details
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Select an identity
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Detail records are fetched only after selection to avoid loading
              sensitive identity data unnecessarily.
            </p>
          </aside>
        </section>
      </main>
    );
  }

  if (usersQuery.isError) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10">
        <AppErrorState
          eyebrow="Identity Directory Unavailable"
          title="Unable to load identity directory."
          description="The BFF could not return a sanitized identity list. The client is protected from receiving unstable upstream provider errors directly."
          actionLabel="Retry request"
          onAction={() => usersQuery.refetch()}
        />
      </main>
    );
  }

  const users = usersQuery.data.users;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-700">
            Enterprise Identity Portal
          </p>

          <h1 className="mt-3 max-w-4xl text-5xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
            Identity Directory
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            BFF-backed identity data with explicit TanStack Query stale and
            garbage-collection boundaries.
          </p>
        </div>

        <AppPanel className="p-5" aria-labelledby="directory summary">
          <span className="block text-5xl font-black tracking-tight text-slate-950">
            {users.length}
          </span>
          <p className="mt-2 text-sm font-medium text-slate-500">
            visible identities
          </p>
        </AppPanel>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <AppPanel className="p-5" aria-labelledby="directory-heading">
          <AppSectionHeading
            eyebrow="Directory"
            title="Identity users"
            id="directory-heading"
            action={
              <p className="w-fit rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                List cache: 30s stale / 2m memory
              </p>
            }
          />

          {users.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
              <h3 className="text-xl font-black tracking-tight text-slate-950">
                No identities found
              </h3>
              <p className="mt-2 leading-7 text-slate-600">
                The BFF returned a valid response, but no users were available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {users.map((user) => (
                <IdentityUserCard
                  key={user.id}
                  user={user}
                  isSelected={selectedUserId === user.id}
                  onSelect={() => setSelectedUserId(user.id)}
                />
              ))}
            </div>
          )}
        </AppPanel>

        <IdentityUserDetailPanel
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      </section>
    </main>
  );
}
