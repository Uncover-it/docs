import { generateFiles } from "fumadocs-openapi";
import { openapi } from "@/lib/openapi";

/**
 * Page slugs are part of the public URL, so they're pinned here rather than
 * derived from the operation summary (which would rename `upload-file` to
 * `upload-a-file`). A new endpoint fails loudly instead of silently landing on
 * a URL nobody chose.
 */
const slugs: Record<string, string> = {
  "get /api/balance": "fetch-balance",
  "post /private/upload": "upload-file",
  "get /private/sample/{hash}": "static-analysis-report",
};

void generateFiles({
  input: openapi,
  // Alongside the hand-written pages these operations are linked from.
  output: "./content/docs/api/manual",
  name: (output) => {
    const key =
      output.type === "operation"
        ? `${output.item.method} ${output.item.path}`
        : `${output.item.method} webhook:${output.item.name}`;

    const slug = slugs[key];
    if (!slug) throw new Error(`No page slug configured for "${key}"`);

    return slug;
  },
  frontmatter: (_title, description) => ({
    // `includeDescription` only puts the description in the page body; the
    // frontmatter copy is what feeds <DocsDescription>, <meta name="description">
    // and the OG image. Descriptions run to several paragraphs, so take the
    // first as the summary and leave the rest to the body.
    description: description?.split("\n\n", 1)[0],
  }),
  // we recommend to enable it
  // make sure your endpoint description doesn't break MDX syntax.
  includeDescription: true,
});
