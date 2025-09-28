import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

// Types
type Seo = { title?: string; ogImage?: string };
type FileMeta = { id: string; mimeType?: string };
type Docs = { name: string; url: string }[];

export const procurementStatus = pgEnum("procurement_status", [
  "open",
  "closed",
]);

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
};

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
  ...timestamps,
});

type Attachment = {
  id: string;
  file: FileMeta;
  label: string;
};

export const posts = pgTable(
  "posts",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body"),
    previewImage: jsonb("preview_image").$type<FileMeta | undefined>(),
    tags: varchar("tags", { length: 255 }).array(),
    attachments: jsonb("attachments").array().$type<Attachment[]>(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    type: varchar("type", { length: 50 }).notNull(),
    seo: jsonb("seo").$type<Seo>(),
    ...timestamps,
  },
  (table) => {
    return {
      publishedIdx: index("posts_published_at_idx").on(table.publishedAt),
      typeIdx: index("posts_type_idx").on(table.type),
    };
  },
);

export const procurements = pgTable("procurements", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  status: procurementStatus("status"),
  date: timestamp("date", { withTimezone: true }).notNull(),
  year: integer("year").notNull(),
  details: text("details"),
  // แผนการจัดซื้อจัดจ้าง
  annualPlan: jsonb("annual_plan").$type<FileMeta[]>(),
  // ประกาศเชิญชวน
  invitation: jsonb("invitation_docs").$type<FileMeta[]>(),
  // เอกสารประกวดราคา/สอบราคา
  priceDisclosure: jsonb("price_disclosure_docs").$type<FileMeta[]>(),
  // ประกาศผู้ชนะ
  winnerDeclaration: jsonb("winner_declaration_docs").$type<FileMeta[]>(),
  attachments: jsonb("attachments").array().$type<Attachment[]>(),
  ...timestamps,
});

export const tags = pgTable(
  "tags",
  {
    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    ...timestamps,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.name, table.type] }),
  }),
);

export const directoryEntries = pgTable("directory_entries", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  tag: varchar("tag", { length: 255 }),
  image: jsonb("image").$type<FileMeta | undefined>(),
  link: varchar("link", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }),
  email: varchar("email", { length: 255 }),
  notes: text("notes"),
  ...timestamps,
});

export const units = pgTable("units", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  image: jsonb("image").$type<FileMeta | undefined>(),
  description: text("description"),
  parentId: uuid("parent_id").references((): AnyPgColumn => units.id, {
    onDelete: "set null",
  }),
  leader: uuid("leader").references((): AnyPgColumn => persons.id, {
    onDelete: "set null",
  }),
  order: integer("order"),
  ...timestamps,
});

export const persons = pgTable("persons", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  rank: varchar("rank", { length: 255 }),
  rankOrder: integer("rank_order"),
  role: varchar("role", { length: 255 }),
  portrait: text("portrait"),
  unitId: uuid("unit_id").references(() => units.id, { onDelete: "restrict" }),
  // Not used currently
  superior: uuid("superior").references((): AnyPgColumn => persons.id, {
    onDelete: "set null",
  }),
  order: integer("order"),
  level: integer("level"),
  bio: text("bio"),
  ...timestamps,
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
export type Post = typeof posts.$inferSelect;
export type PostInsert = typeof posts.$inferInsert;
export type Procurement = typeof procurements.$inferSelect;
export type ProcurementInsert = typeof procurements.$inferInsert;
export type DirectoryEntry = typeof directoryEntries.$inferSelect;
export type DirectoryEntryInsert = typeof directoryEntries.$inferInsert;
export type Unit = typeof units.$inferSelect;
export type UnitInsert = typeof units.$inferInsert;
export type Person = typeof persons.$inferSelect;
export type PersonInsert = typeof persons.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type TagInsert = typeof tags.$inferInsert;

export * from "@/lib/auth/schema";
