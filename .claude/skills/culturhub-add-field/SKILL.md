---
name: culturhub-add-field
description: Add a new field to the Recommendation model end-to-end in the CULTURHUB (printculture-next) app — Prisma, Zod, types, API, form, and display. Use when asked to add an attribute to recommendations (e.g. duration, rating, ISBN, mood).
---

# Add a Recommendation field (end-to-end)

Touch the files below **in this order** so the Zod schema stays the source of truth. Use an
existing field as a template (e.g. `author` for a short string, `opinion` for long text,
`imageUrl` for a URL). All new fields should be **optional** to keep migrations additive.

1. **`prisma/schema.prisma`** — add `myField String?` (use `@db.Text` for long text) to
   `model Recommendation`. Then:
   `pnpm db:generate` and apply via `pnpm local:reset`
   (local) or `db:migrate` (when the target DB is reachable).

2. **`src/lib/schemas.ts`** — add to `RecommendationCreateSchema`. Pick the validator:
   - short text: `z.string().max(255).optional()`
   - long text: `z.string().max(2000).optional()`
   - **URL**: `safeUrl("…").optional().or(z.literal(""))` ← required for any URL (SSRF guard)
   `RecommendationUpdateSchema` derives automatically (`.partial()`).

3. **`src/types/recommendation.ts`** — add `myField?: string | null;` to `IRecommendation`.

4. **API** — persist it:
   - `src/app/api/recommendations/route.ts` (POST `create`): add `myField: data.myField,`.
   - `src/app/api/recommendations/[id]/route.ts` (PUT): add
     `...(data.myField !== undefined && { myField: data.myField }),`.

5. **Form** — `src/components/RecommendationModal.tsx`: add `myField: ""` to `emptyForm`
   and an input bound to `formData.myField` (reuse `inputClass`/`labelClass`).

6. **Display** — show it where relevant: `FeedCard.tsx` (feed row) and/or
   `src/app/recommendations/[id]/page.tsx` (detail), using design tokens.

7. **Verify** — `pnpm type-check` and `lint`; then create a reco via the
   modal and confirm the value round-trips through the API and detail screen.
