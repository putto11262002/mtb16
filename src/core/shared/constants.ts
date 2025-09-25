export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;

export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_IMAGE_SIZE_MB = 5; // 5 MB

export const SUPPORTED_ATTACHMENT_TYPES = [
  ...SUPPORTED_IMAGE_TYPES,
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
];

export const MAX_ATTACHMENT_SIZE_MB = 20;

export const THAI_ARMY_RANKS = {
  จอมพล: 1, // Chom phon
  พลเอก: 2, // Phon ek
  พลโท: 3, // Phon tho
  พลตรี: 4, // Phon tri
  พันเอก: 5, // Phan ek
  พันโท: 6, // Phan tho
  พันตรี: 7, // Phan tri
  ร้อยเอก: 8, // Roi ek
  ร้อยโท: 9, // Roi tho
  ร้อยตรี: 10, // Roi tri
} as const;
