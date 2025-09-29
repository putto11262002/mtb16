import { z } from "astro:schema";
import { MAX_IMAGE_SIZE_MB, SUPPORTED_IMAGE_TYPES } from "../shared/constants";

export const createPersonInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "ชื่อเป็นสิ่งจำเป็น")
    .max(255, "ชื่อต้องไม่เกิน 255 ตัวอักษร"),
  rank: z.string().trim().max(255, "ยศต้องไม่เกิน 255 ตัวอักษร").optional(),
  order: z.number().int().optional(),
  role: z
    .string()
    .trim()
    .max(255, "ตำแหน่งต้องไม่เกิน 255 ตัวอักษร")
    .optional(),
  unitId: z.string().uuid().optional(),
  level: z.number().int().min(0).optional(),
  bio: z
    .string()
    .optional()
    .refine(
      (val: string | undefined) => !val || val.length <= 5000,
      "ชีวประวัติต้องไม่เกิน 5000 ตัวอักษร",
    ),
});

export type CreatePersonInput = z.infer<typeof createPersonInputSchema>;

export const updatePersonInputSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .trim()
    .min(1, "ชื่อเป็นสิ่งจำเป็น")
    .max(255, "ชื่อต้องไม่เกิน 255 ตัวอักษร")
    .optional(),
  rank: z.string().trim().max(255, "ยศต้องไม่เกิน 255 ตัวอักษร").optional(),
  order: z.number().int().optional(),
  role: z
    .string()
    .trim()
    .max(255, "ตำแหน่งต้องไม่เกิน 255 ตัวอักษร")
    .optional(),
  unitId: z.string().uuid().optional(),
  level: z.number().int().min(0).optional(),
  bio: z
    .string()
    .optional()
    .refine(
      (val: string | undefined) => !val || val.length <= 5000,
      "ชีวประวัติต้องไม่เกิน 5000 ตัวอักษร",
    ),
});

export type UpdatePersonInput = z.infer<typeof updatePersonInputSchema>;

export const updatePortraitInputSchema = z.object({
  id: z.string().uuid(),
  file: z
    .instanceof(Blob)
    .refine(
      (file: Blob) => SUPPORTED_IMAGE_TYPES.includes(file.type),
      "Unsupported image type",
    )
    .refine(
      (file: Blob) => file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024,
      `Image size must be less than ${MAX_IMAGE_SIZE_MB} MB`,
    ),
});

export type UpdatePortraitInput = z.infer<typeof updatePortraitInputSchema>;

export const deletePersonInputSchema = z.object({
  id: z.string().uuid(),
});

export type DeletePersonInput = z.infer<typeof deletePersonInputSchema>;

export const getManyPersonsInputSchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).default(10).optional(),
  q: z.string().optional(),
  unitId: z.string().uuid().optional(),
  rank: z.string().optional(),
  orderBy: z.enum(["name", "rank", "level", "createdAt"]).optional(),
  direction: z.enum(["asc", "desc"]).optional(),
});

export type GetManyPersonsInput = z.infer<typeof getManyPersonsInputSchema>;
