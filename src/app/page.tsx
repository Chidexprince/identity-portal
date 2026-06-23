/**
 * Home page for the Identity Directory Dashboard.
 *
 * The page delegates feature behavior to the identity-directory module so the
 * App Router layer stays thin and focused on routing/composition.
 */

import { IdentityDirectoryDashboard } from "@/features/identity-directory/components/identity-directory-dashboard";

export default function HomePage() {
  return <IdentityDirectoryDashboard />;
}
