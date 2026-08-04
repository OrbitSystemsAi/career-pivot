# Career Pivot Posting Module

## Ownership boundary

Career Pivot owns its authoring UI, authenticated author identity, local drafts, validation results, and submission history. ONN receives a typed submission contract through the Career Pivot server. ONN does not host Career Pivot-specific posting screens.

## Server configuration

The server requires these production environment variables:

- `AUTH_SESSION_SECRET`: a long random secret used to sign HTTP-only sessions.
- `ONN_PUBLISHING_API_URL`: the ONN publishing endpoint.
- `ONN_PUBLISHING_API_TOKEN`: the server-only ONN credential.

For local development, accounts and drafts are stored in `.data/career-pivot.json`. `CAREER_PIVOT_DATA_FILE` may change the filename within `.data`.

The file repository is suitable for local development or a single self-hosted instance with a persistent `.data` volume. Before horizontally scaled or serverless production deployment, replace `core/server/dataStore.ts` with a transactional database repository. The posting API and typed ONN contract can remain unchanged.

## Submission lifecycle

1. The authenticated contributor creates or opens a locally owned draft.
2. `Save Draft Locally` persists the draft without contacting ONN.
3. `Submit to ONN` saves the latest draft, then invokes server-side submission validation.
4. A valid draft transitions through `submitting` to `submitted` when ONN returns a submission ID.
5. A failed request is persisted as `failed`, including the attempt count and error message. The editor exposes `Retry ONN Submission`.
6. The source post ID is used as the ONN idempotency key to protect retries from duplicate publication.

## Submission contract

The server adapter maps the Career Pivot draft to ONN's application-neutral contract: external content ID, `career-pivot-community` publication, content type, title, summary, body, language, distribution level, contributor, weighted topic slugs, HTTPS citations, and source metadata. The stable Career Pivot post ID is sent as the `Idempotency-Key` header. ONN returns its standard `{ data, meta }` envelope.

The August 4, 2026 Step 2 verification submitted a controlled Career Pivot record through its project-scoped credential, repeated the same request idempotently, and confirmed the same ONN submission ID was returned. A separate isolation check confirmed the Career Pivot credential cannot publish into OSai's publication.
