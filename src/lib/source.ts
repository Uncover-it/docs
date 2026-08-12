import { docs } from "fumadocs-mdx:collections/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { openapiPlugin } from "fumadocs-openapi/server";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { getOpenAPIText } from "@/lib/openapi-llm";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin(), openapiPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const description = page.data.description;

  // Generated OpenAPI pages have no prose body, only an `<APIPage />` element that
  // processing strips away — render their operations from the schema instead.
  const body = page.data._openapi
    ? await getOpenAPIText(await page.data.getText("raw"), page.data.title)
    : undefined;

  return `# ${page.data.title}

${description ? `${description}\n\n` : ""}${body ?? (await page.data.getText("processed"))}`;
}
