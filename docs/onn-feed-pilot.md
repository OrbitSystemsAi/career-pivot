# Career Pivot ONN consumer pilot

## Outcome

Career Pivot is the first ONN consumer pilot. Its authenticated home magazine requests a personalized edition from the ONN unified Feed API, preserves origin and publisher attribution, opens external stories at their canonical source, and forwards supported interaction signals.

The browser talks only to authenticated Career Pivot routes. ONN project credentials remain server-only.

## Configuration

Production requires:

- `AUTH_SESSION_SECRET`: signs Career Pivot sessions and derives the opaque, stable ONN user identifier.
- `ONN_FEED_API_BASE_URL`: ONN origin, without an API path.
- `ONN_FEED_API_TOKEN`: Career Pivot's server-only production key with `feed:read` and `feed:feedback`. The current pilot credential also carries `content:submit` for the separate posting module.

Development may reuse the configured publishing URL origin and publishing token so an existing local pilot can be exercised without duplicating a secret. Production intentionally does not use that fallback; issue separate least-privilege credentials.

ONN lists Career Pivot production as a Vercel Trusted Source. Career Pivot sends its short-lived `VERCEL_OIDC_TOKEN` in the `x-vercel-trusted-oidc-idp-token` header to pass Vercel Deployment Protection. ONN then independently validates the scoped ONN bearer token. Preview and development are not trusted to reach ONN production.

## Request and personalization

`deriveOnnFeedSignals` converts only bounded product state into approved taxonomy slugs. Every edition begins with Work and Careers, Careers, and Employment. Remote-work, business, education, AI, technology, healthcare, finance, and marketing interests are added only when supported by onboarding, active goals, skills, or current/target industries. Career Pivot sends no résumé body, goal prose, email address, or profile record to ONN.

The ONN external user ID is an HMAC of the normalized account email using `AUTH_SESSION_SECRET`. This prevents email disclosure to ONN. The pilot account store still uses email as its local account key; replacing the local authentication prototype with immutable provider IDs remains a production identity migration requirement.

## Presentation and interactions

The home magazine displays normalized ONN items with:

- first-party or external-news origin;
- publisher/source attribution;
- publication date;
- title and source-provided summary;
- canonical source link.

Career Pivot forwards `shown`, `opened`, `saved`, `useful`, and `not_relevant`. The ONN adapter supports `dismissed` for future presentation controls. Feedback failure never blocks reading or other Career Pivot features.

## Resilience

ONN retrieval is bounded to 12 seconds and feedback to 8 seconds. A successful edition is saved server-side under `.data/onn-feed-cache` using a hash of the opaque user ID and request. If ONN is temporarily unavailable, Career Pivot returns that last-known-good edition with `stale: true`. If no cached edition exists, the module shows a contained unavailable state while the rest of Career Pivot remains usable.

This filesystem cache is suitable for the current single-instance pilot. Production horizontal deployment requires a shared encrypted cache or application datastore with a retention policy.

## Monitoring and acceptance

ONN records authenticated feed and feedback request IDs, status, latency, and project association without bodies or credentials. Pilot review should monitor latency, empty-result rate, stale fallback usage, partial-origin responses, source/origin diversity, and interaction volume.

Acceptance requires authenticated retrieval, correct provenance, external links opening safely, supported interactions reaching ONN, graceful empty/unavailable states, a demonstrated last-known-good fallback, and no ONN credential in browser code or responses.

The adapter and internal route pattern are application-neutral. A second Orbit application can reuse the same ONN contract by supplying its own server credential, opaque user-ID derivation, taxonomy mapping, presentation component, and cache implementation—without ONN application-specific code.
