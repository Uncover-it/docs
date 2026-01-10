import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
  // the OpenAPI schema, you can also give it an external URL.
  input: [
    "https://api.api-fiddle.com/v1/public/resources/oas_api_3_1/rajvir-goenkas-organization-ur0/gold-bird-9as8",
  ],
});
