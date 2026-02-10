const API_URL = import.meta.env.VITE_API_URL as string;

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  // Só define Content-Type quando há body (POST/PUT/PATCH normalmente)
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  // Health retorna text/plain, e DELETE pode retornar vazio
  const contentType = res.headers.get("content-type") || "";
  if (res.status === 204) return undefined as T;

  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  return (await res.text()) as unknown as T;
}
