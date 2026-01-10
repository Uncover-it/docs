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

export default async function Page(props: PageProps<"/[[...slug]]">) {
  const params = await props.params;
  let page = source.getPage(params.slug);

  if (!page && (!params.slug || params.slug.length === 0)) {
    page = source.getPage(["index"]);
  }

  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{ style: "clerk" }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
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
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
