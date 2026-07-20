/**
 * @file wishlist.test.ts
 * Unit tests for the wishlist Zustand store.
 * Tests: add, remove via toggle, isInWishlist check.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { useWishlist } from "@/store/wishlist";

describe("Wishlist Store", () => {
  const mockItem = {
    id: "art-001",
    title: "Golden Whisper",
    price: 1200,
    image: "/test-image.jpg",
  };

  beforeEach(() => {
    // Clear wishlist before each test
    useWishlist.setState({ items: [] });
  });

  it("should start with empty wishlist", () => {
    expect(useWishlist.getState().items).toHaveLength(0);
  });

  it("should add an item when toggled and not in wishlist", () => {
    useWishlist.getState().toggleItem(mockItem);
    expect(useWishlist.getState().items).toHaveLength(1);
    expect(useWishlist.getState().isInWishlist("art-001")).toBe(true);
  });

  it("should remove an item when toggled and already in wishlist", () => {
    useWishlist.getState().toggleItem(mockItem);
    useWishlist.getState().toggleItem(mockItem);
    expect(useWishlist.getState().items).toHaveLength(0);
    expect(useWishlist.getState().isInWishlist("art-001")).toBe(false);
  });

  it("should return false for isInWishlist when item not added", () => {
    expect(useWishlist.getState().isInWishlist("art-999")).toBe(false);
  });

  it("should support multiple items in wishlist", () => {
    useWishlist.getState().toggleItem(mockItem);
    useWishlist.getState().toggleItem({ ...mockItem, id: "art-002", title: "Sacred Arc" });
    expect(useWishlist.getState().items).toHaveLength(2);
    expect(useWishlist.getState().isInWishlist("art-002")).toBe(true);
  });
});
