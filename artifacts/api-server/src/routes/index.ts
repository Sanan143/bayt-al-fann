import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import {
  adminsTable, artworksTable, artworkImagesTable, categoriesTable,
  ordersTable, orderItemsTable, commissionRequestsTable, blogPostsTable,
  exhibitionsTable, contactMessagesTable, testimonialsTable,
  newsletterSubscribersTable, settingsTable,
} from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { authMiddleware, generateToken, AuthRequest } from "../middlewares/auth.js";

export const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// INPUT SANITIZATION UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Strip HTML tags and null bytes from a string to prevent XSS and injection.
 * This is a defence-in-depth measure on top of parameterized queries.
 */
function sanitizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "")          // strip HTML tags
    .replace(/\u0000/g, "")            // strip null bytes
    .replace(/javascript:/gi, "")     // strip JS protocol
    .trim();
}

/** Validate that a value is a non-negative number. */
function sanitizeNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** Validate email format. */
function isValidEmail(email: unknown): boolean {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}



// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validate inputs before hitting the database
    if (!username || typeof username !== "string" || username.trim().length === 0) {
      res.status(400).json({ error: "Username is required" });
      return;
    }
    if (!password || typeof password !== "string" || password.length === 0) {
      res.status(400).json({ error: "Password is required" });
      return;
    }

    const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.username, sanitizeString(username)));
    if (!admin) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = generateToken(admin.id);
    res.json({ token, admin: { id: admin.id, username: admin.username, email: admin.email } });
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});


router.get("/auth/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.id, req.adminId!));
    if (!admin) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ id: admin.id, username: admin.username, email: admin.email });
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────

router.get("/categories", async (_req, res) => {
  const cats = await db.select().from(categoriesTable);
  res.json(cats);
});

router.post("/categories", authMiddleware, async (req, res) => {
  const [cat] = await db.insert(categoriesTable).values(req.body).returning();
  res.status(201).json(cat);
});

router.put("/categories/:id", authMiddleware, async (req, res) => {
  const [cat] = await db.update(categoriesTable).set(req.body).where(eq(categoriesTable.id, Number(req.params.id))).returning();
  res.json(cat);
});

router.delete("/categories/:id", authMiddleware, async (req, res) => {
  await db.delete(categoriesTable).where(eq(categoriesTable.id, Number(req.params.id)));
  res.json({ success: true });
});

// ─────────────────────────────────────────────
// ARTWORKS
// ─────────────────────────────────────────────

router.get("/artworks", async (req, res) => {
  try {
    const { categoryId, isFeatured, status, search } = req.query;
    const artworks = await db.query.artworksTable.findMany({
      with: { images: true, category: true },
      orderBy: [desc(artworksTable.createdAt)],
    });

    let filtered = artworks;
    if (categoryId) filtered = filtered.filter(a => a.categoryId === Number(categoryId));
    if (isFeatured === "true") filtered = filtered.filter(a => a.isFeatured);
    if (status) filtered = filtered.filter(a => a.availability === String(status));
    if (search) filtered = filtered.filter(a => a.title.toLowerCase().includes(String(search).toLowerCase()));

    res.json(filtered);
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});

router.get("/artworks/:id", async (req, res) => {
  try {
    const artwork = await db.query.artworksTable.findFirst({
      where: eq(artworksTable.id, Number(req.params.id)),
      with: { images: true, category: true },
    });
    if (!artwork) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(artwork);
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});

router.post("/artworks", authMiddleware, async (req, res) => {
  try {
    const { images, ...artworkData } = req.body;
    const [artwork] = await db.insert(artworksTable).values(artworkData).returning();
    if (images?.length) {
      await db.insert(artworkImagesTable).values(
        images.map((url: string, i: number) => ({
          artworkId: artwork.id, imageUrl: url, isPrimary: i === 0, displayOrder: i,
        }))
      );
    }
    const full = await db.query.artworksTable.findFirst({
      where: eq(artworksTable.id, artwork.id), with: { images: true },
    });
    res.status(201).json(full);
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});

router.put("/artworks/:id", authMiddleware, async (req, res) => {
  try {
    const { images, ...artworkData } = req.body;
    const [artwork] = await db.update(artworksTable).set(artworkData)
      .where(eq(artworksTable.id, Number(req.params.id))).returning();
    if (images) {
      await db.delete(artworkImagesTable).where(eq(artworkImagesTable.artworkId, artwork.id));
      if (images.length) {
        await db.insert(artworkImagesTable).values(
          images.map((url: string, i: number) => ({
            artworkId: artwork.id, imageUrl: url, isPrimary: i === 0, displayOrder: i,
          }))
        );
      }
    }
    const full = await db.query.artworksTable.findFirst({
      where: eq(artworksTable.id, artwork.id), with: { images: true },
    });
    res.json(full);
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});

router.delete("/artworks/:id", authMiddleware, async (req, res) => {
  await db.delete(artworksTable).where(eq(artworksTable.id, Number(req.params.id)));
  res.json({ success: true });
});

// ─────────────────────────────────────────────
// BLOG
// ─────────────────────────────────────────────

router.get("/blog", async (_req, res) => {
  const posts = await db.select().from(blogPostsTable)
    .where(eq(blogPostsTable.status, "published"))
    .orderBy(desc(blogPostsTable.createdAt));
  res.json(posts);
});

router.get("/blog/:id", async (req, res) => {
  const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, Number(req.params.id)));
  if (!post) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(post);
});

router.post("/blog", authMiddleware, async (req, res) => {
  const [post] = await db.insert(blogPostsTable).values(req.body).returning();
  res.status(201).json(post);
});

router.put("/blog/:id", authMiddleware, async (req, res) => {
  const [post] = await db.update(blogPostsTable).set(req.body)
    .where(eq(blogPostsTable.id, Number(req.params.id))).returning();
  res.json(post);
});

router.delete("/blog/:id", authMiddleware, async (req, res) => {
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, Number(req.params.id)));
  res.json({ success: true });
});

// ─────────────────────────────────────────────
// EXHIBITIONS
// ─────────────────────────────────────────────

router.get("/exhibitions", async (_req, res) => {
  const exh = await db.select().from(exhibitionsTable).orderBy(desc(exhibitionsTable.startDate));
  res.json(exh);
});

router.get("/exhibitions/:id", async (req, res) => {
  const [exh] = await db.select().from(exhibitionsTable).where(eq(exhibitionsTable.id, Number(req.params.id)));
  if (!exh) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(exh);
});

router.post("/exhibitions", authMiddleware, async (req, res) => {
  const [exh] = await db.insert(exhibitionsTable).values(req.body).returning();
  res.status(201).json(exh);
});

router.put("/exhibitions/:id", authMiddleware, async (req, res) => {
  const [exh] = await db.update(exhibitionsTable).set(req.body)
    .where(eq(exhibitionsTable.id, Number(req.params.id))).returning();
  res.json(exh);
});

router.delete("/exhibitions/:id", authMiddleware, async (req, res) => {
  await db.delete(exhibitionsTable).where(eq(exhibitionsTable.id, Number(req.params.id)));
  res.json({ success: true });
});

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────

router.get("/orders", authMiddleware, async (_req, res) => {
  const orders = await db.query.ordersTable.findMany({
    with: { items: true }, orderBy: [desc(ordersTable.createdAt)],
  });
  res.json(orders);
});

router.get("/orders/:id", authMiddleware, async (req, res) => {
  const order = await db.query.ordersTable.findFirst({
    where: eq(ordersTable.id, Number(req.params.id)), with: { items: true },
  });
  if (!order) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(order);
});

router.post("/orders", async (req, res) => {
  try {
    const { items, customerName, customerEmail, customerPhone, shippingAddress } = req.body;
    const totalAmount = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
    const [order] = await db.insert(ordersTable).values({
      customerName, customerEmail, customerPhone, shippingAddress, totalAmount,
    }).returning();
    await db.insert(orderItemsTable).values(
      items.map((i: any) => ({ orderId: order.id, artworkId: i.artworkId, price: i.price, quantity: i.quantity }))
    );
    const full = await db.query.ordersTable.findFirst({
      where: eq(ordersTable.id, order.id), with: { items: true },
    });
    res.status(201).json(full);
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});

router.put("/orders/:id", authMiddleware, async (req, res) => {
  const [order] = await db.update(ordersTable).set(req.body)
    .where(eq(ordersTable.id, Number(req.params.id))).returning();
  res.json(order);
});

// ─────────────────────────────────────────────
// COMMISSIONS
// ─────────────────────────────────────────────

router.get("/commissions", authMiddleware, async (_req, res) => {
  const reqs = await db.select().from(commissionRequestsTable).orderBy(desc(commissionRequestsTable.createdAt));
  res.json(reqs);
});

router.post("/commissions", async (req, res) => {
  const [req_] = await db.insert(commissionRequestsTable).values(req.body).returning();
  res.status(201).json(req_);
});

router.put("/commissions/:id", authMiddleware, async (req, res) => {
  const [updated] = await db.update(commissionRequestsTable).set({ status: req.body.status })
    .where(eq(commissionRequestsTable.id, Number(req.params.id))).returning();
  res.json(updated);
});

// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────

router.get("/contact", authMiddleware, async (_req, res) => {
  const msgs = await db.select().from(contactMessagesTable).orderBy(desc(contactMessagesTable.createdAt));
  res.json(msgs);
});

router.post("/contact", async (req, res) => {
  const [msg] = await db.insert(contactMessagesTable).values(req.body).returning();
  res.status(201).json(msg);
});

router.put("/contact/:id/archive", authMiddleware, async (req, res) => {
  const [msg] = await db.update(contactMessagesTable).set({ isArchived: true })
    .where(eq(contactMessagesTable.id, Number(req.params.id))).returning();
  res.json(msg);
});

// ─────────────────────────────────────────────
// NEWSLETTER
// ─────────────────────────────────────────────

router.post("/newsletter/subscribe", async (req, res) => {
  try {
    const [sub] = await db.insert(newsletterSubscribersTable).values({ email: req.body.email }).returning();
    res.status(201).json(sub);
  } catch {
    res.status(409).json({ error: "Already subscribed" });
  }
});

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────

router.get("/testimonials", async (_req, res) => {
  const t = await db.select().from(testimonialsTable).where(eq(testimonialsTable.isApproved, true));
  res.json(t);
});

router.get("/testimonials/all", authMiddleware, async (_req, res) => {
  const t = await db.select().from(testimonialsTable).orderBy(desc(testimonialsTable.createdAt));
  res.json(t);
});

router.post("/testimonials", async (req, res) => {
  const [t] = await db.insert(testimonialsTable).values({ ...req.body, isApproved: false }).returning();
  res.status(201).json(t);
});

router.put("/testimonials/:id/approve", authMiddleware, async (req, res) => {
  const [t] = await db.update(testimonialsTable).set({ isApproved: req.body.isApproved })
    .where(eq(testimonialsTable.id, Number(req.params.id))).returning();
  res.json(t);
});

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────

router.get("/settings", async (_req, res) => {
  const rows = await db.select().from(settingsTable);
  const settings = Object.fromEntries(rows.map(r => [r.key, r.value]));
  res.json(settings);
});

router.put("/settings", authMiddleware, async (req, res) => {
  const updates: Record<string, string> = req.body;
  for (const [key, value] of Object.entries(updates)) {
    const existing = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
    if (existing.length) {
      await db.update(settingsTable).set({ value }).where(eq(settingsTable.key, key));
    } else {
      await db.insert(settingsTable).values({ key, value });
    }
  }
  res.json({ success: true });
});

// ─────────────────────────────────────────────
// ANALYTICS (Admin Dashboard)
// ─────────────────────────────────────────────

router.get("/analytics", authMiddleware, async (_req, res) => {
  try {
    const [revenueRow] = await db.select({ total: sql<number>`coalesce(sum(total_amount), 0)` }).from(ordersTable).where(eq(ordersTable.status, "paid"));
    const [ordersCountRow] = await db.select({ count: sql<number>`count(*)` }).from(ordersTable);
    const [artworksCountRow] = await db.select({ count: sql<number>`count(*)` }).from(artworksTable);

    const recentOrders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(5);

    const categoryArtworks = await db.query.categoriesTable.findMany({ with: { artworks: true } });
    const categoryData = categoryArtworks.map(c => ({ name: c.name, value: c.artworks.length }));

    res.json({
      revenue: revenueRow.total || 0,
      ordersCount: ordersCountRow.count || 0,
      visitorsCount: 1024, // placeholder until analytics tracking is integrated
      artworksCount: artworksCountRow.count || 0,
      revenueData: recentOrders.map(o => ({ date: o.createdAt.toISOString().split("T")[0], amount: o.totalAmount })),
      categoryData,
      recentOrders: recentOrders.map(o => ({
        id: o.id, customerName: o.customerName, totalAmount: o.totalAmount,
        status: o.status, createdAt: o.createdAt.toISOString(),
      })),
    });
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});

// ─────────────────────────────────────────────
// HEALTH
// ─────────────────────────────────────────────

router.get("/healthz", (_req, res) => res.json({ status: "ok" }));
