/**
 * Generates docs/openapi.json from the Zod schemas in src/lib/schemas.ts.
 *
 * Run: pnpm docs:generate
 *
 * The schema components are auto-derived from Zod (via z.toJSONSchema), so they
 * stay in sync with the validation logic automatically. Only the paths section
 * needs to be updated when adding new API routes.
 */

import { z } from "zod";
import { writeFileSync, mkdirSync } from "fs";
import {
  LoginSchema,
  RegisterSchema,
  RecommendationCreateSchema,
  RecommendationUpdateSchema,
} from "../src/lib/schemas";

const bearerAuth = { bearerAuth: [] };

const spec = {
  openapi: "3.0.0",
  info: {
    title: "Print Culture API",
    version: "1.0.0",
    description:
      "REST API for the Print Culture cultural-recommendation platform. " +
      "All protected routes require a valid `auth-token` httpOnly cookie (JWT HS256, 7-day expiry).",
  },
  servers: [
    { url: "http://localhost:3000", description: "Local dev" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "auth-token",
        description: "JWT token set by POST /api/auth/login",
      },
    },
    schemas: {
      LoginBody: z.toJSONSchema(LoginSchema),
      RegisterBody: z.toJSONSchema(RegisterSchema),
      RecommendationCreateBody: z.toJSONSchema(RecommendationCreateSchema),
      RecommendationUpdateBody: z.toJSONSchema(RecommendationUpdateSchema),
      ApiSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "object" },
          message: { type: "string" },
        },
      },
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string", example: "Unauthorized" },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterBody" } } },
        },
        responses: {
          "200": { description: "User created, auth cookie set", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
          "400": { description: "Validation error" },
          "409": { description: "Email already in use" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate and receive an auth cookie",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginBody" } } },
        },
        responses: {
          "200": { description: "Login successful, auth cookie set" },
          "400": { description: "Validation error" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Clear the auth cookie",
        responses: {
          "200": { description: "Cookie cleared" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the currently authenticated user",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Current user object" },
          "401": { description: "Not authenticated" },
        },
      },
    },
    "/api/recommendations": {
      get: {
        tags: ["Recommendations"],
        summary: "List all recommendations (newest first)",
        security: [bearerAuth],
        responses: {
          "200": { description: "Array of recommendations" },
          "401": { description: "Not authenticated" },
        },
      },
      post: {
        tags: ["Recommendations"],
        summary: "Create a recommendation",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RecommendationCreateBody" } } },
        },
        responses: {
          "200": { description: "Recommendation created" },
          "400": { description: "Validation error" },
          "401": { description: "Not authenticated" },
        },
      },
    },
    "/api/recommendations/{id}": {
      get: {
        tags: ["Recommendations"],
        summary: "Get a recommendation by ID",
        security: [bearerAuth],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Recommendation object" },
          "401": { description: "Not authenticated" },
          "404": { description: "Not found" },
        },
      },
      put: {
        tags: ["Recommendations"],
        summary: "Update a recommendation",
        security: [bearerAuth],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RecommendationUpdateBody" } } },
        },
        responses: {
          "200": { description: "Updated recommendation" },
          "400": { description: "Validation error" },
          "401": { description: "Not authenticated" },
          "404": { description: "Not found" },
        },
      },
      delete: {
        tags: ["Recommendations"],
        summary: "Delete a recommendation",
        security: [bearerAuth],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Deleted" },
          "401": { description: "Not authenticated" },
          "404": { description: "Not found" },
        },
      },
    },
    "/api/upload": {
      post: {
        tags: ["Upload"],
        summary: "Upload a file to Supabase Storage",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: { type: "string", format: "binary", description: "File to upload (images, PDF, doc, txt)" },
                },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Upload successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        fileName: { type: "string" },
                        fileUrl: { type: "string", format: "uri" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { description: "No file provided" },
          "401": { description: "Not authenticated" },
        },
      },
    },
  },
};

mkdirSync("docs", { recursive: true });
writeFileSync("docs/openapi.json", JSON.stringify(spec, null, 2));
console.log("✓ OpenAPI spec written to docs/openapi.json");
