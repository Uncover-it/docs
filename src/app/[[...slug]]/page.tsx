import { getPageImage, source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions";

function getMarkdownUrl(pageUrl: string): string {
  // Use /llm prefix with .txt extension for LLM-friendly URLs
  if (pageUrl === "/" || pageUrl === "") {
    return "/llm/index.txt";
  }
  return `/llm${pageUrl}.txt`;
}

export default async function Page(props: PageProps<"/[[...slug]]">) {
  const params = await props.params;
  let page = source.getPage(params.slug);

  if (!page && (!params.slug || params.slug.length === 0)) {
    page = source.getPage(["index"]);
  }

  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getMarkdownUrl(page.url);

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{ style: "clerk" }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pt-2 pb-6">
        <LLMCopyButton markdownUrl={markdownUrl} />
        <ViewOptions
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/Uncover-it/docs/blob/master/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const params = source.generateParams();

  return params.map((param) => ({
    ...param,
    slug:
      param.slug.length === 1 && param.slug[0] === "index" ? [] : param.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  let page = source.getPage(params.slug);

  if (!page && (!params.slug || params.slug.length === 0)) {
    page = source.getPage(["index"]);
  }

  if (!page) notFound();

  return {
    alternates: {canonical: page.url},
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
