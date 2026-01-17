import { getPageImage, source } from "@/lib/source";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { generate as DefaultImage, getImageResponseOptions } from "@/lib/mono";
import fs from "node:fs/promises";
import path from "node:path";

export const revalidate = false;

export async function GET(
  _req: Request,
  props: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await props.params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const logo = await fs.readFile(path.join(process.cwd(), "public/logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      site="Uncover it"
      logo={<img width="80" height="80" src={src} alt="Uncover it Logo" />}
    />,
    await getImageResponseOptions(),
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
