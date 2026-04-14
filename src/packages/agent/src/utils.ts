export const parsePayload = (
  payload: Buffer,
): Record<string, unknown> | null => {
  try {
    return JSON.parse(payload.toString());
  } catch (error) {
    console.error("Error parsing payload:", error);
    return null;
  }
};
