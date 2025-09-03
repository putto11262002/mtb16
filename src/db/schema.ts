import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
  pgEnum,
  bigint,
  index,
  uniqueIndex,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// --- Helper for Timestamps ---
// Reusable object for common timestamp columns.
const baseTimestamps = {
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
  // deleted_at: timestamp("deleted_at", { withTimezone: true }), // Uncomment if soft-delete is needed in the future
};

// --- Enums ---
export const resourceVisibilityEnum = pgEnum("resource_visibility", [
  "public",
  "admin_only",
]);

// --- Tables ---

// Admin user table for authentication and management
export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(), // Unique email for login
    passwordHash: text("passwordHash").notNull(), // Store password hash
    firstName: text("first_name"),
    lastName: text("last_name"),
    active: boolean("active").default(true).notNull(), // Account status
    ...baseTimestamps,
  },
  (t) => [
    // Index for faster email lookups, case-insensitive if needed later
    index("idx_admin_users__email").using("btree", t.email),
  ],
);

// Posts/News table
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "set null" }), // Foreign key to admin_users
    title: text("title").notNull(),
    description: text("description"),
    content: text("content"),
    mainImageUrl: text("main_image_url"),
    galleryImageUrls: text("gallery_image_urls").array(), // Array of strings for gallery images
    publishedAt: timestamp("published_at", { withTimezone: true }), // When the post becomes public
    ...baseTimestamps,
  },
  (t) => [
    // Index on published_at for querying visible posts, and adminId for fetching user's posts
    index("idx_posts__published_at").on(t.publishedAt),
    index("idx_posts__admin_id").on(t.adminId),
  ],
);

// Announcements table
export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "set null" }), // Created by admin
    title: text("title").notNull(),
    content: text("content"),
    attachmentFileUrl: text("attachment_file_url"), // Optional file attachment
    active: boolean("active").default(true).notNull(), // Whether the announcement is currently displayed
    publishedAt: timestamp("published_at", { withTimezone: true }), // When the announcement was first displayed
    ...baseTimestamps,
  },
  (t) => [
    // Index for active announcements
    index("idx_announcements__active_published_at").on(t.active, t.publishedAt),
    index("idx_announcements__admin_id").on(t.adminId),
  ],
);

// Resources table (downloadable files)
export const resources = pgTable(
  "resources",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "set null" }), // Uploaded by admin
    title: text("title").notNull(),
    description: text("description"),
    fileUrl: text("file_url").notNull(), // URL to the file
    fileSize: bigint("file_size", { mode: "number" }).notNull(), // Size in bytes for display/info
    mimeType: text("mime_type").notNull(), // MIME type of the file
    visibility: resourceVisibilityEnum("visibility").notNull(), // Enum for access control
    ...baseTimestamps,
  },
  (t) => [
    // Index for visibility and file title for quick lookup
    index("idx_resources__visibility_title").on(t.visibility, t.title),
    index("idx_resources__admin_id").on(t.adminId),
  ],
);

// Commanders Tree Node table for hierarchical structure
export const commandersTreeNodes = pgTable(
  "commanders_tree_nodes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    positionTitle: text("position_title"),
    // Self-referencing foreign key for parent-child relationship
    parentNodeId: uuid("parent_node_id").references(
      (): AnyPgColumn => commandersTreeNodes.id,
      { onDelete: "set null" },
    ),
    order: integer("order").notNull(), // Order among siblings
    photoUrl: text("photo_url"), // Optional photo URL
    ...baseTimestamps,
  },
  (t) => [
    // Index for parent node ID to efficiently fetch direct children
    index("idx_commanders_tree_nodes__parent_node_id").on(t.parentNodeId),
    // Index for order to sort siblings
    index("idx_commanders_tree_nodes__order").on(t.order),
  ],
);

// Greeting Popup configuration table
export const greetingPopups = pgTable(
  "greeting_popups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    imageUrl: text("image_url"), // Optional image URL
    linkUrl: text("link_url"), // Optional link URL
    active: boolean("active").default(true).notNull(), // Whether the popup is currently active
    displayStart: timestamp("display_start", { withTimezone: true }), // Optional start time
    displayEnd: timestamp("display_end", { withTimezone: true }), // Optional end time
    ...baseTimestamps,
  },
  (t) => [
    // Index for active popups and their display times
    index("idx_greeting_popups__active_times").on(
      t.active,
      t.displayStart,
      t.displayEnd,
    ),
  ],
);

// --- Relations ---

// Relations for commandersTreeNodes (self-referencing)
export const commandersTreeNodesRelations = relations(
  commandersTreeNodes,
  ({ one, many }) => ({
    // Parent node
    parent: one(commandersTreeNodes, {
      fields: [commandersTreeNodes.parentNodeId],
      references: [commandersTreeNodes.id],
      // If a parent node is deleted, its children should also be potentially handled.
      // `set null` is used here as per the schema definition, implying children remain but lose their parent link.
      // If cascading deletion is desired, change `onDelete: "set null"` to `onDelete: "cascade"` in the table definition after the FK.
    }),
    // Direct children nodes
    children: many(commandersTreeNodes),
  }),
);

// Export table types for use in application logic
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;

export type CommandersTreeNode = typeof commandersTreeNodes.$inferSelect;
export type NewCommandersTreeNode = typeof commandersTreeNodes.$inferInsert;

export type GreetingPopup = typeof greetingPopups.$inferSelect;
export type NewGreetingPopup = typeof greetingPopups.$inferInsert;
