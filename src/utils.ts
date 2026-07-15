/**
 * Safely parse a fetch response as JSON.
 * Prevents "Unexpected token '<'" crashes when the server returns HTML (e.g., 502/503 bad gateway, 404 fallbacks, or crashed dev server).
 */
export async function safeJson<T = any>(res: Response): Promise<T & { error?: string }> {
  try {
    const contentType = res.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (isJson) {
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || `HTTP Error ${res.status}: ${res.statusText}` } as any;
      }
      return data;
    }

    if (!res.ok) {
      return { error: `HTTP Error ${res.status}: ${res.statusText}` } as any;
    }

    return { error: "Server did not return a valid JSON payload. Please check your network or server logs." } as any;
  } catch (err: any) {
    console.error("safeJson error parsing response:", err);
    return { error: err?.message || `Failed to parse response as JSON (${res.status})` } as any;
  }
}
