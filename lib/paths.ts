export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const isStaticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true";
export function assetPath(path: string): string;
export function assetPath(path: undefined): undefined;
export function assetPath(path: string | undefined): string | undefined;
export function assetPath(path: string | undefined) {
  if (!path) return path;
  return path.startsWith("/") && !path.startsWith("//") ? `${basePath}${path}` : path;
}
