import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = "https://docs.uncoverit.org";

  return source.getPages().map((page) => ({
    url: `${url}${page.url}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page.url === "/" ? 1.0 : 0.8,
  }));
}
