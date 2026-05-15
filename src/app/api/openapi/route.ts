import spec from "../../../../docs/openapi.json";

/**
 * GET /api/openapi
 * Serves the generated OpenAPI 3.0 spec.
 * Paste the URL into https://editor.swagger.io or https://redocly.github.io/redoc/
 * to browse the interactive API documentation.
 *
 * Regenerate after schema changes: pnpm docs:generate
 */
export function GET() {
  return Response.json(spec);
}
