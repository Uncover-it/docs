import { llms } from "fumadocs-core/source/llms";
import { source } from "@/lib/source";

export const revalidate = false;

// The index companion to `llms-full.txt`: a Markdown outline of the docs tree,
// linking each page to its raw `<page>.mdx`.
export function GET() {
  return new Response(llms(source).index(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
