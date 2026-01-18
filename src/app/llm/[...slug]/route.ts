import { getLLMText, source } from "@/lib/source";

export const revalidate = false;
export const dynamicParams = false;

export async function GET(
  _request: Request,
  props: { params: Promise<{ slug: string[] }> }
) {
  const params = await props.params;
  const slug = [...params.slug];

  // The last segment ends with .txt - strip it to get the actual page slug
  if (slug.length > 0) {
    const lastPart = slug[slug.length - 1];
    if (lastPart.endsWith(".txt")) {
      slug[slug.length - 1] = lastPart.slice(0, -4);
    }
  }

  // Filter out empty strings and handle "index" specially
  if (slug.length === 1 && slug[0] === "index") {
    slug.length = 0;
  }

  let page = source.getPage(slug);

  if (!page) {
    return new Response("Not Found", { status: 404 });
  }

  const content = await getLLMText(page);

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export async function generateStaticParams() {
  const params = source.generateParams();

  return params.map((param) => {
    const baseSlug = param.slug ?? [];

    // For index page, use ["index.txt"]
    if (baseSlug.length === 0) {
      return { slug: ["index.txt"] };
    }

    // Add .txt extension to the last segment
    const slug = [...baseSlug];
    slug[slug.length - 1] += ".txt";

    return { slug };
  });
}
