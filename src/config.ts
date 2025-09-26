/*
 * Global configuration object for the application.
 */
export const Config = {
  getFileURL: (id: string) => `/api/files/${id}`,
  dev: import.meta.env ? import.meta.env.DEV : true,
};
