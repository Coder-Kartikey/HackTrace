const DEFAULT_API_URL = "http://localhost:3001";
const DEFAULT_API_KEY = "test";

export function getApiConfig() {
  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL,
    apiKey:
      process.env.HACKTRACE_API_KEY ??
      process.env.NEXT_PUBLIC_API_KEY ??
      DEFAULT_API_KEY
  };
}
