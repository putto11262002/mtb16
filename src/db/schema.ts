import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
  pgEnum,
  uniqueIndex,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// Types
type Seo = { title?: string; description?: string; keywords?: string[] };
type Attachments = { name: string; url: string; mimeType?: string }[];
type Docs = { name: string; url: string }[];

// Enums
export const announcementCategory = pgEnum("announcement_category", [
  "emergency",
  "public-notice",
  "policy",
  "general",
]);

export const procurementStatus = pgEnum("procurement_status", [
  "open",
  "closed",
]);

// Tables
export const siteSettings = pgTable("site_settings", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  unitNameTh: varchar("unit_name_th", { length: 255 }).notNull(),
  unitNameEn: varchar("unit_name_en", { length: 255 }),
  logo: text("logo"),
  footerCopyright: varchar("footer_copyright", { length: 255 }),
  welcomeText: text("welcome_text"),
  heroFallbackImage: text("hero_fallback_image"),
  facebookOfficial: varchar("facebook_official", { length: 255 }),
  facebookNews: varchar("facebook_news", { length: 255 }),
  tiktok: varchar("tiktok", { length: 255 }),
  addressTh: text("address_th"),
  phone: varchar("phone", { length: 255 }),
  email: varchar("email", { length: 255 }),
  mapEmbed: text("map_embed"),
  homepageAlertEnabled: boolean("homepage_alert_enabled"),
  homepageAlertImage: text("homepage_alert_image"),
  homepageAlertAlt: varchar("homepage_alert_alt", { length: 255 }),
  homepageAlertLink: varchar("homepage_alert_link", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const announcements = pgTable("announcements", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body"),
  previewImage: text("preview_image"),
  category: announcementCategory("category"),
  tags: text("tags").array(),
  attachments: jsonb("attachments").$type<Attachments>(),
  publishedAt: timestamp("published_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  seo: jsonb("seo").$type<Seo>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const news = pgTable("news", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  caption: varchar("caption", { length: 255 }),
  body: text("body"),
  heroImage: text("hero_image"),
  publishedAt: timestamp("published_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  seo: jsonb("seo").$type<Seo>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const procurements = pgTable("procurements", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  status: procurementStatus("status"),
  date: timestamp("date", { withTimezone: true }).notNull(),
  year: integer("year").notNull(),
  details: text("details"),
  annualPlanDocs: jsonb("annual_plan_docs").$type<Docs>(),
  invitationDocs: jsonb("invitation_docs").$type<Docs>(),
  priceDisclosureDocs: jsonb("price_disclosure_docs").$type<Docs>(),
  winnerDeclarationDocs: jsonb("winner_declaration_docs").$type<Docs>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const directoryEntries = pgTable("directory_entries", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  tag: varchar("tag", { length: 255 }),
  image: text("image"),
  link: varchar("link", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  email: varchar("email", { length: 255 }),
  notes: text("notes"),
  order: integer("order"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const units = pgTable("units", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  parentId: uuid("parent_id").references((): AnyPgColumn => units.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const persons = pgTable("persons", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  rank: varchar("rank", { length: 255 }),
  role: varchar("role", { length: 255 }),
  portrait: text("portrait"),
  unitId: uuid("unit_id").references(() => units.id, { onDelete: "restrict" }),
  order: integer("order"),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Relations
export const unitsRelations = relations(units, ({ one, many }) => ({
  parent: one(units, {
    fields: [units.parentId],
    references: [units.id],
  }),
  children: many(units),
  persons: many(persons),
}));

export const personsRelations = relations(persons, ({ one }) => ({
  unit: one(units, {
    fields: [persons.unitId],
    references: [units.id],
  }),
}));

// Exported types
export type SiteSettings = typeof siteSettings.$inferSelect;
export type SiteSettingsInsert = typeof siteSettings.$inferInsert;
export type Announcement = typeof announcements.$inferSelect;
export type AnnouncementInsert = typeof announcements.$inferInsert;
export type News = typeof news.$inferSelect;
export type NewsInsert = typeof news.$inferInsert;
export type Procurement = typeof procurements.$inferSelect;
export type ProcurementInsert = typeof procurements.$inferInsert;
export type DirectoryEntry = typeof directoryEntries.$inferSelect;
export type DirectoryEntryInsert = typeof directoryEntries.$inferInsert;
export type Unit = typeof units.$inferSelect;
export type UnitInsert = typeof units.$inferInsert;
export type Person = typeof persons.$inferSelect;
export type PersonInsert = typeof persons.$inferInsert;

export * from "@/lib/auth/schema";
