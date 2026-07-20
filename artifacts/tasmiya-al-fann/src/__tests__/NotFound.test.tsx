/**
 * @file NotFound.test.tsx
 * Integration tests for the 404 Not Found page.
 * Verifies: renders, heading text, navigation links, accessibility.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Router } from "wouter";
import NotFound from "@/pages/not-found";

// Helper: render with Wouter router context
function renderWithRouter(ui: React.ReactElement) {
  return render(<Router>{ui}</Router>);
}

describe("NotFound (404) Page", () => {
  it("renders the 404 heading", () => {
    renderWithRouter(<NotFound />);
    expect(screen.getByText("404")).toBeTruthy();
    // Also check for the accessible h1
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
  });

  it("renders a link to the home page", () => {
    renderWithRouter(<NotFound />);
    const homeLink = screen.getByRole("button", { name: /return home/i });
    expect(homeLink).toBeTruthy();
  });

  it("renders a link to the gallery page", () => {
    renderWithRouter(<NotFound />);
    const galleryLink = screen.getByRole("button", { name: /browse gallery/i });
    expect(galleryLink).toBeTruthy();
  });

  it("renders the Arabic subtitle", () => {
    renderWithRouter(<NotFound />);
    expect(screen.getByText("الصفحة غير موجودة")).toBeTruthy();
  });

  it("has correct aria-labelledby on the main element", () => {
    renderWithRouter(<NotFound />);
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("aria-labelledby", "not-found-title");
  });

  it("renders a back navigation button", () => {
    renderWithRouter(<NotFound />);
    expect(screen.getByText(/go back to previous page/i)).toBeTruthy();
  });
});
