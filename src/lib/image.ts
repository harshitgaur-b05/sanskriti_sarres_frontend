/**
 * Optimizes Cloudinary, Google, and Unsplash image URLs for fast web delivery.
 * - Cloudinary: Injects `f_auto,q_auto,c_limit,dpr_auto` (automatic modern formats WebP/AVIF, auto quality compression).
 * - Unsplash: Injects `auto=format&q=80&w={width}&fm=webp`.
 */
export function optimizeImage(url?: string, width: number = 1200): string {
  if (!url) return "";

  try {
    // 1. Handle Cloudinary
    // Example: https://res.cloudinary.com/<cloud>/image/upload/v12345/folder/image.jpg
    if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
      // If already has f_auto and q_auto transformations, return as is
      if (url.includes("f_auto") && url.includes("q_auto")) {
        return url;
      }
      // Inject f_auto (fetch format), q_auto (quality auto), dpr_auto, and width limit
      return url.replace(
        "/upload/",
        `/upload/f_auto,q_auto,w_${width},c_limit,dpr_auto/`
      );
    }

    // 2. Handle Unsplash
    if (url.includes("images.unsplash.com")) {
      const urlObj = new URL(url);
      urlObj.searchParams.set("auto", "format");
      urlObj.searchParams.set("q", "80");
      urlObj.searchParams.set("w", width.toString());
      return urlObj.toString();
    }

    // 3. Handle Google user content / Aida public images
    if (url.includes("lh3.googleusercontent.com")) {
      // Append size parameter if not present
      if (!url.includes("=s") && !url.includes("=w")) {
        return `${url}=w${width}-rw`;
      }
      return url;
    }
  } catch (e) {
    return url;
  }

  return url;
}
