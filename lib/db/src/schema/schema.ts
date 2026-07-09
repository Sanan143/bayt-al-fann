import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Admin Table
export const adminsTable = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Categories Table
export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
});

// 3. Artworks Table
export const artworksTable = pgTable("artworks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents/standard units
  dimensions: text("dimensions").notNull(), // e.g. "80 x 100 cm"
  medium: text("medium").notNull(), // e.g. "Oil on Canvas"
  availability: text("availability").default("available").notNull(), // "available", "sold", "reserved"
  rating: integer("rating").default(5),
  categoryId: integer("category_id").references(() => categoriesTable.id, { onDelete: "cascade" }),
  certificateNumber: text("certificate_number"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isLimitedEdition: boolean("is_limited_edition").default(false).notNull(),
  totalEditions: integer("total_editions"),
  availableEditions: integer("available_editions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Artwork Images Table
export const artworkImagesTable = pgTable("artwork_images", {
  id: serial("id").primaryKey(),
  artworkId: integer("artwork_id").references(() => artworksTable.id, { onDelete: "cascade" }).notNull(),
  imageUrl: text("image_url").notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
});

// 5. Orders Table
export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").default("pending").notNull(), // "pending", "paid", "shipped", "cancelled"
  paymentIntentId: text("payment_intent_id"),
  trackingNumber: text("tracking_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 6. Order Items Table
export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => ordersTable.id, { onDelete: "cascade" }).notNull(),
  artworkId: integer("artwork_id").references(() => artworksTable.id, { onDelete: "set null" }),
  price: integer("price").notNull(),
  quantity: integer("quantity").default(1).notNull(),
});

// 7. Commission Requests Table
export const commissionRequestsTable = pgTable("commission_requests", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  stylePreference: text("style_preference").notNull(),
  budgetRange: text("budget_range").notNull(),
  notes: text("notes").notNull(),
  referenceImageUrl: text("reference_image_url"),
  status: text("status").default("pending").notNull(), // "pending", "accepted", "rejected"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. Blog Posts Table
export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  readTime: text("read_time").notNull(), // e.g. "5 min read"
  coverImage: text("cover_image").notNull(),
  author: text("author").default("Tasmiya Fathima Azeez").notNull(),
  status: text("status").default("draft").notNull(), // "draft", "published"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 9. Exhibitions Table
export const exhibitionsTable = pgTable("exhibitions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location").notNull(), // e.g. "Virtual Museum" or physical venue
  status: text("status").default("upcoming").notNull(), // "upcoming", "active", "past"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 10. Contact Messages Table
export const contactMessagesTable = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 11. Testimonials Table
export const testimonialsTable = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  author: text("author").notNull(),
  role: text("role"), // e.g. "Collector" or "Art Critic"
  rating: integer("rating").default(5).notNull(),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 12. Newsletter Subscribers Table
export const newsletterSubscribersTable = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 13. Settings Table
export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

// Relationships
export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  artworks: many(artworksTable),
}));

export const artworksRelations = relations(artworksTable, ({ one, many }) => ({
  category: one(categoriesTable, {
    fields: [artworksTable.categoryId],
    references: [categoriesTable.id],
  }),
  images: many(artworkImagesTable),
  orderItems: many(orderItemsTable),
}));

export const artworkImagesRelations = relations(artworkImagesTable, ({ one }) => ({
  artwork: one(artworksTable, {
    fields: [artworkImagesTable.artworkId],
    references: [artworksTable.id],
  }),
}));

export const ordersRelations = relations(ordersTable, ({ many }) => ({
  items: many(orderItemsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  artwork: one(artworksTable, {
    fields: [orderItemsTable.artworkId],
    references: [artworksTable.id],
  }),
}));
