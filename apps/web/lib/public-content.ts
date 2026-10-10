export function safeExternalUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function safePublicImageUrl(value?: string): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  const url = safeExternalUrl(value);
  if (!url) return undefined;
  try {
    return new URL(url).hostname === "firebasestorage.googleapis.com" ? url : undefined;
  } catch {
    return undefined;
  }
}

export function cleanStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim())
    : [];
}

export function parsePageLimit(value: string | undefined, initial = 6, maximum = 30): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < initial) return initial;
  return Math.min(parsed, maximum);
}
