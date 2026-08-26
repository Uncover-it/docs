import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = "https://docs.uncoverit.org";

  // No `lastModified`: CI builds from a shallow clone, so neither the build time
  // nor the file mtime says anything about when a page actually changed, and a
  // timestamp that moves on every deploy is a signal crawlers learn to ignore.
  return source.getPages().map((page) => ({
    url: `${url}${page.url}`,
    changeFrequency: "weekly",
    priority: page.url === "/" ? 1.0 : 0.8,
  }));
}
