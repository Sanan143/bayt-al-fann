/**
 * @file cart.test.ts
 * Unit tests for the cart Zustand store.
 * Tests: add item, quantity tracking, remove, clear.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { useCart } from "@/store/cart";

describe("Cart Store", () => {
  beforeEach(() => {
    // Reset cart state before each test
    useCart.getState().clearCart();
  });

  const mockItem = {
    id: "art-001",
    title: "Golden Whisper",
    price: 1200,
    image: "/test-image.jpg",
    quantity: 1,
  };

  it("should start empty", () => {
    expect(useCart.getState().items).toHaveLength(0);
  });

  it("should add an item to the cart", () => {
    useCart.getState().addItem(mockItem);
    expect(useCart.getState().items).toHaveLength(1);
    expect(useCart.getState().items[0].title).toBe("Golden Whisper");
  });

  it("should increment quantity when same item is added again", () => {
    useCart.getState().addItem(mockItem);
    useCart.getState().addItem(mockItem);
    const items = useCart.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("should remove an item from the cart", () => {
    useCart.getState().addItem(mockItem);
    useCart.getState().removeItem("art-001");
    expect(useCart.getState().items).toHaveLength(0);
  });

  it("should clear all items", () => {
    useCart.getState().addItem(mockItem);
    useCart.getState().addItem({ ...mockItem, id: "art-002", title: "Sacred Geometry" });
    useCart.getState().clearCart();
    expect(useCart.getState().items).toHaveLength(0);
  });

  it("should correctly calculate total quantity", () => {
    useCart.getState().addItem(mockItem);
    useCart.getState().addItem(mockItem);
    useCart.getState().addItem({ ...mockItem, id: "art-002", title: "Second", quantity: 1 });
    const total = useCart.getState().items.reduce((s, i) => s + i.quantity, 0);
    expect(total).toBe(3);
  });
});
