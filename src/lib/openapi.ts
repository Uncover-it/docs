import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
  // local schema file (resolved from the project root); can also be an external URL.
  input: ["./openapi.yaml"],
});
