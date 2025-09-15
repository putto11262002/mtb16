import { defineAction, ActionError } from "astro:actions";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import type { MutationResult } from "@/actions/shared";
import { getFileStore } from "@/lib/storage";
import type { FileStore } from "@/lib/storage/types";

import {
  CreateNewsInputSchema,
  UpdateNewsInputSchema,
  PublishNewsInputSchema,
} from "./schema";

export const create = defineAction({
  accept: "form",
  input: CreateNewsInputSchema,
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      });
    }

    const files: FileStore = getFileStore();
    let heroImageId: string | undefined;
    let seoOgImageId: string | undefined;

    if (input.heroImage) {
      const buffer = Buffer.from(await input.heroImage.arrayBuffer());
      const meta = await files.store(buffer, {
        name: input.heroImage.name,
        mimeType: input.heroImage.type,
      });
      heroImageId = meta.id;
    }

    if (input.seo?.ogImage) {
      const buffer = Buffer.from(await input.seo.ogImage.arrayBuffer());
      const meta = await files.store(buffer, {
        name: input.seo.ogImage.name,
        mimeType: input.seo.ogImage.type,
      });
      seoOgImageId = meta.id;
    }

    try {
      const [row] = await db
        .insert(schema.news)
        .values({
          title: input.title,
          slug: input.slug,
          caption: input.caption,
          body: input.body,
          heroImage: heroImageId,
          seo: input.seo
            ? { title: input.seo.title, ogImage: seoOgImageId }
            : undefined,
          publishedAt: new Date(),
        })
        .returning({ id: schema.news.id });

      return { ok: true, id: row.id, message: "News created successfully." };
    } catch (error) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create news.",
      });
    }
  },
});

export const update = defineAction({
  accept: "form",
  input: UpdateNewsInputSchema,
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      });
    }

    const files: FileStore = getFileStore();

    // Get current news
    const current = await db
      .select()
      .from(schema.news)
      .where(eq(schema.news.id, input.id))
      .limit(1);

    if (!current.length) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "News not found.",
      });
    }

    const currentNews = current[0];
    let heroImageId = currentNews.heroImage;
    let seoOgImageId = currentNews.seo?.ogImage;

    if (input.heroImage) {
      const buffer = Buffer.from(await input.heroImage.arrayBuffer());
      const meta = await files.store(buffer, {
        name: input.heroImage.name,
        mimeType: input.heroImage.type,
      });
      heroImageId = meta.id;
    }

    if (input.seo?.ogImage) {
      const buffer = Buffer.from(await input.seo.ogImage.arrayBuffer());
      const meta = await files.store(buffer, {
        name: input.seo.ogImage.name,
        mimeType: input.seo.ogImage.type,
      });
      seoOgImageId = meta.id;
    }

    const updateData: any = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.caption !== undefined) updateData.caption = input.caption;
    if (input.body !== undefined) updateData.body = input.body;
    if (heroImageId !== undefined || input.heroImage)
      updateData.heroImage = heroImageId;
    if (input.publishedAt !== undefined)
      updateData.publishedAt = input.publishedAt
        ? new Date(input.publishedAt)
        : null;
    if (input.seo !== undefined)
      updateData.seo = { title: input.seo.title, ogImage: seoOgImageId };

    try {
      await db
        .update(schema.news)
        .set(updateData)
        .where(eq(schema.news.id, input.id));

      return { ok: true, id: input.id, message: "News updated successfully." };
    } catch (error) {
      if (error instanceof Error && error.message.includes("duplicate key")) {
        throw new ActionError({
          code: "CONFLICT",
          message: "Slug already exists.",
        });
      }
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update news.",
      });
    }
  },
});

export const publish = defineAction({
  input: PublishNewsInputSchema,
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      });
    }

    const current = await db
      .select({ publishedAt: schema.news.publishedAt })
      .from(schema.news)
      .where(eq(schema.news.id, input.id))
      .limit(1);

    if (!current.length) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "News not found.",
      });
    }

    const newPublishedAt = current[0].publishedAt ? null : new Date();

    try {
      await db
        .update(schema.news)
        .set({ publishedAt: newPublishedAt })
        .where(eq(schema.news.id, input.id));

      return { ok: true, id: input.id, message: "Visibility toggled." };
    } catch (error) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to toggle visibility.",
      });
    }
  },
});

export const news = { create, update, publish };
