import type { Procurement } from "@/db/schema";
import { z } from "astro:schema";
import { SUPPORTED_IMAGE_TYPES } from "../shared/constants";

export type ProcurementItem = Procurement;

export const createProcurementInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "หัวข้อต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(255, "หัวข้อต้องไม่เกิน 255 ตัวอักษร"),
  status: z.enum(["open", "closed"]),
  date: z.coerce.date(),
  details: z
    .string()
    .trim()
    .max(5000, "รายละเอียดต้องไม่เกิน 5000 ตัวอักษร")
    .optional(),
});

export type createProcurementInput = z.infer<
  typeof createProcurementInputSchema
>;

export const updateProcurementInputSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .trim()
    .min(3, "หัวข้อต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(255, "หัวข้อต้องไม่เกิน 255 ตัวอักษร"),
  status: z.enum(["open", "closed"]),
  date: z.coerce.date(),
  details: z
    .string()
    .trim()
    .max(5000, "รายละเอียดต้องไม่เกิน 5000 ตัวอักษร")
    .optional(),
});

export type updateProcurementInput = z.infer<
  typeof updateProcurementInputSchema
>;

export const deleteProcurementInputSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteProcurementInput = z.infer<
  typeof deleteProcurementInputSchema
>;

export const getManyProcurementsInputSchema = z.object({
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  status: z.enum(["open", "closed"]).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  orderBy: z.enum(["createdAt", "date", "title"]).optional(),
  direction: z.enum(["asc", "desc"]).optional(),
});

export type GetManyProcurementsInput = z.infer<
  typeof getManyProcurementsInputSchema
>;

export const updateAnnualPlanInputSchema = z.object({
  id: z.string().uuid(),
  files: z.array(
    z
      .instanceof(Blob)
      .refine(
        (file) => file.size <= 20 * 1024 * 1024,
        "File size must be less than 20 MB",
      )
      .refine(
        (file) =>
          [
            ...SUPPORTED_IMAGE_TYPES,
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(file.type),
        "Unsupported file type",
      ),
  ),
});

export type UpdateAnnualPlanInput = z.infer<typeof updateAnnualPlanInputSchema>;

export const updateInvitationDocsInputSchema = z.object({
  id: z.string().uuid(),
  files: z.array(
    z
      .instanceof(Blob)
      .refine(
        (file) => file.size <= 20 * 1024 * 1024,
        "File size must be less than 20 MB",
      )
      .refine(
        (file) =>
          [
            ...SUPPORTED_IMAGE_TYPES,
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(file.type),
        "Unsupported file type",
      ),
  ),
});

export type UpdateInvitationDocsInput = z.infer<
  typeof updateInvitationDocsInputSchema
>;

export const updatePriceDisclosureDocsInputSchema = z.object({
  id: z.string().uuid(),
  files: z.array(
    z
      .instanceof(Blob)
      .refine(
        (file) => file.size <= 20 * 1024 * 1024,
        "File size must be less than 20 MB",
      )
      .refine(
        (file) =>
          [
            ...SUPPORTED_IMAGE_TYPES,
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(file.type),
        "Unsupported file type",
      ),
  ),
});

export type UpdatePriceDisclosureDocsInput = z.infer<
  typeof updatePriceDisclosureDocsInputSchema
>;

export const updateWinnerDeclarationDocsInputSchema = z.object({
  id: z.string().uuid(),
  files: z.array(
    z
      .instanceof(Blob)
      .refine(
        (file) => file.size <= 20 * 1024 * 1024,
        "File size must be less than 20 MB",
      )
      .refine(
        (file) =>
          [
            ...SUPPORTED_IMAGE_TYPES,
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(file.type),
        "Unsupported file type",
      ),
  ),
});

export type UpdateWinnerDeclarationDocsInput = z.infer<
  typeof updateWinnerDeclarationDocsInputSchema
>;

export const addProcurementAttachmentInputSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1),
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must be less than 20 MB",
    )
    .refine(
      (file) =>
        [
          ...SUPPORTED_IMAGE_TYPES,
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/plain",
        ].includes(file.type),
      "Unsupported file type",
    ),
});

export type AddProcurementAttachmentInput = z.infer<
  typeof addProcurementAttachmentInputSchema
>;

export const removeProcurementAttachmentInputSchema = z.object({
  id: z.string().uuid(),
  attachmentId: z.string().uuid(),
});

export type RemoveProcurementAttachmentInput = z.infer<
  typeof removeProcurementAttachmentInputSchema
>;
