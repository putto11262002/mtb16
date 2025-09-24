/**
 * Formats a date into Thai locale format
 * @param date - Date object, string, or null
 * @returns Formatted date string in Thai locale or empty string if invalid
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return "";
  
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Formats a date into a more compact Thai format
 * @param date - Date object, string, or null
 * @returns Formatted date string in short Thai locale format
 */
export function formatDateShort(date: Date | string | null): string {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return "";
  
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Formats a date with time included
 * @param date - Date object, string, or null
 * @returns Formatted date and time string in Thai locale
 */
export function formatDateTime(date: Date | string | null): string {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return "";
  
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}