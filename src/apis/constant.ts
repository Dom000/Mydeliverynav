const rawBaseUrl =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const BASE_URL = rawBaseUrl.replace(/\/+$/, "");
