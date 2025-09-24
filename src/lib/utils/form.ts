export function transformToFormData(
  data: Record<string, any>,
  formData = new FormData(),
  parentKey: string | null = null,
) {
  // Use Object.entries to get an array of [key, value] pairs
  Object.entries(data).forEach(([key, value]) => {
    // Skip null values
    if (value === null) {
      return;
    }

    if (value === undefined) {
      return;
    }

    // Determine the formatted key
    const formattedKey =
      parentKey === null || parentKey === "" ? key : `${parentKey}[${key}]`;

    // Handle different data types
    if (value instanceof File) {
      formData.set(formattedKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((element, idx) => {
        formData.append(`${formattedKey}`, element);
      });
    } else if (value instanceof Date) {
      formData.set(formattedKey, value.toISOString());
    } else if (value instanceof Object) {
      // Recursively call the function for nested objects
      transformToFormData(value, formData, formattedKey);
    } else {
      // For all other primitive values
      formData.set(formattedKey, value);
    }
  });

  return formData;
}
