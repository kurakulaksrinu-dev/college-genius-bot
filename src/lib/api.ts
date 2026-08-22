/**
 * Client for the Python FastAPI backend.
 * Base URL comes from VITE_API_BASE_URL (see backend/.env.example),
 * and falls back to the local FastAPI dev server.
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8000";

export const apiUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

async function parseError(resp: Response, fallback: string) {
  try {
    const data = await resp.json();
    return (data?.error as string) || (data?.detail as string) || fallback;
  } catch {
    return fallback;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const resp = await fetch(apiUrl(path));
  if (!resp.ok) throw new Error(await parseError(resp, "Failed to load data from the server."));
  return resp.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const resp = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(await parseError(resp, "The request failed. Please try again."));
  return resp.json() as Promise<T>;
}
