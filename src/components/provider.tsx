"use client";
import { RootProvider } from "fumadocs-ui/provider/next";
import { lazy, type ReactNode } from "react";

// Loaded on demand: the dialog pulls in the client-side search engine, which is
// ~70 KB that no page needs until the search box is actually opened.
const SearchDialog = lazy(() => import("@/components/search"));

export function Provider({ children }: { children: ReactNode }) {
  return <RootProvider search={{ SearchDialog }}>{children}</RootProvider>;
}
