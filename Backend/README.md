# School Calculator (MVP)

Next.js + TypeScript starter for the School finalScore/probability MVP.

Quick start:

1. Install:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

API endpoints:

- `GET /api/schools` — list schools
- `GET /api/schools/:id` — school detail
- `POST /api/calculate` — body `{ userScore }`, returns array of results

POST /api/calculate details:

- Request body: `{ userScore, save?: boolean, consent?: boolean, difficultyMode?: 'add'|'mul' }`
- If `save` is true and `consent` is true, the submission is persisted to `data/submissions.json` (MVP file store).
- Responses use a small standardized error envelope `{ error: { message } }` on failure.

Core files:

- `data/schools.json` — static MVP school data
- `lib/calc.ts` — calculation engine (semester avg, weights, normalize, difficulty, probability)
- `pages/api/*` — API routes

Next steps: linting, validation (zod), tests, DB-backed schools, user_submissions opt-in storage.

Security & ops notes:

- CORS: API sets `Access-Control-Allow-Origin` to request origin by default in `lib/middleware.ts` (MVP). Configure stricter origin in production.
- Rate limiting: in-memory rate limiter in `lib/rateLimiter.ts` (60 req/min per IP). For production, use a shared store (Redis).
- Health: `GET /api/health`
- Submissions admin: `GET /api/submissions?key=<SUBMISSIONS_KEY>` (requires env `SUBMISSIONS_KEY` to be set for protection).

Environment variables:

- `SUBMISSIONS_KEY` — admin key to read submissions via `GET /api/submissions`
- `IP_SALT` — optional salt used when hashing IP addresses before persisting submissions

DB-backed schools (MongoDB):

- Run the seed script to populate MongoDB from `data/schools.json`.
- Set `MONGODB_URI` and `MONGODB_DB` in your environment (defaults: `mongodb://localhost:27017/schoolcalc`, db: `schoolcalc`).
- The API will use MongoDB for all school and submission data.

API docs:

- `GET /api/docs` returns a minimal OpenAPI JSON describing endpoints.

Local development & utilities:

- Install dev deps and run tests/lint:

```bash
npm install
npm run lint
npm run test
```

Seed MongoDB from `data/schools.json`:

```bash
node --loader ts-node/esm scripts/seed-mongo.ts
```

```bash
docker build -t school-calculator .
docker run -p 3000:3000 --env SUBMISSIONS_KEY=yourkey school-calculator
```
