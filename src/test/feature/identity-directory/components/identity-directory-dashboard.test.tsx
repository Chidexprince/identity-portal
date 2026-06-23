/**
 * Integration tests for the identity directory dashboard.
 *
 * These tests use the real TanStack Query hooks and real browser-side BFF
 * client. MSW intercepts /api/users and /api/users/:id so no external network
 * request is made.
 */

import { http, HttpResponse } from "msw";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { IdentityDirectoryDashboard } from "@/features/identity-directory/components/identity-directory-dashboard";
import { renderWithQueryClient } from "@/test/render-with-query-client";
import { server } from "@/test/msw/server";

describe("IdentityDirectoryDashboard", () => {
  it("renders the directory users returned by the BFF", async () => {
    renderWithQueryClient(<IdentityDirectoryDashboard />);

    expect(
      await screen.findByRole("button", {
        name: "View details for George Bluth",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("george.bluth@reqres.in")).toBeInTheDocument();
    expect(screen.getByText("MFA required")).toBeInTheDocument();
  });

  it("renders an error state when the BFF list request fails", async () => {
    server.use(
      http.get("/api/users", () => {
        return HttpResponse.json(
          { message: "Unable to load identity users." },
          { status: 502 },
        );
      }),
    );

    renderWithQueryClient(<IdentityDirectoryDashboard />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load identity directory.",
    );
  });

  it("fetches and renders identity details after a user is selected", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(<IdentityDirectoryDashboard />);

    await user.click(
      await screen.findByRole("button", {
        name: "View details for George Bluth",
      }),
    );
    expect(await screen.findByText("Required")).toBeInTheDocument();
  });
});
