import { getPageImage, source } from "@/lib/source";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { generate as DefaultImage, getImageResponseOptions } from "@/lib/mono";
import fs from "node:fs/promises";
import path from "node:path";

export const revalidate = false;

// Read once and share across every generated image, the same way the fonts in
// `@/lib/mono` are.
const logo = fs
  .readFile(path.join(process.cwd(), "public/logo.png"))
  .then((data) => `data:image/png;base64,${data.toString("base64")}`);

export async function GET(
  _req: Request,
  props: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await props.params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      site="Uncover it"
      logo={
        <img width={80} height={80} src={await logo} alt="Uncover it Logo" />
      }
    />,
    await getImageResponseOptions(),
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
