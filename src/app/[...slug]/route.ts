import { getLLMText, source } from "@/lib/source";

export const revalidate = false;
export const dynamicParams = false;

export async function GET(
  _request: Request,
  props: { params: Promise<{ slug: string[] }> },
) {
  const params = await props.params;
  const slug = [...params.slug];

  // Only the `<page>.mdx` variant of a page is served here, the page itself is
  // rendered by `[[...slug]]/page.tsx`.
  const last = slug[slug.length - 1];
  if (!last?.endsWith(".mdx")) {
    return new Response("Not Found", { status: 404 });
  }
  slug[slug.length - 1] = last.slice(0, -".mdx".length);

  // `/index.mdx` is the root page.
  if (slug.length === 1 && slug[0] === "index") slug.length = 0;

  const page = source.getPage(slug);
  if (!page) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  return source.generateParams().map((param) => {
    const slug = [...(param.slug ?? [])];

    if (slug.length === 0) return { slug: ["index.mdx"] };

    slug[slug.length - 1] += ".mdx";
    return { slug };
  });
}
