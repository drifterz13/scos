const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL environment variable is required");
}

export function getApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
