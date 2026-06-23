/**
 * Returns the base URL for the Zenith AI API.
 * 
 * Priority:
 * 1. NEXT_PUBLIC_API_URL env var (set this to your Railway worker URL for GitHub Pages)
 * 2. Falls back to "" (relative path — works on Vercel with built-in API routes)
 * 
 * Usage: `${getApiUrl()}/api/ai/chat`
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "";
}
