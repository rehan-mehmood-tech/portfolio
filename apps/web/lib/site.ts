export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();
