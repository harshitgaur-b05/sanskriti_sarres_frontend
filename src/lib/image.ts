/**
 * Optimizes Cloudinary and Unsplash image URLs to load much faster.
 * - For Cloudinary: injects `q_auto,f_auto` to serve compressed WebP/AVIF formats automatically.
 * - For Unsplash: injects `q=80&w=1200&fm=webp` if not already present.
 */
export function optimizeImage(url?: string, width: number = 1200): string {
  if (!url) return "";
  
  try {
    // 1. Handle Cloudinary
    // Example: https://res.cloudinary.com/dz.../image/upload/v12345/folder/image.jpg
    if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
      // If it already has transformations (like q_auto), return as is
      if (url.includes("q_auto") || url.includes("f_auto")) {
        return url;
      }
      // Inject auto-format, auto-quality, and max width immediately after /upload/
      return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
    }

    // 2. Handle Unsplash
    if (url.includes("images.unsplash.com")) {
      const urlObj = new URL(url);
      urlObj.searchParams.set("auto", "format");
      urlObj.searchParams.set("q", "80");
      urlObj.searchParams.set("w", width.toString());
      return urlObj.toString();
    }
  } catch (e) {
    // Fallback if URL parsing fails
    return url;
  }

  // 3. Fallback for all other URLs
  return url;
}
