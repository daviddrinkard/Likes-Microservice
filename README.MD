# Likes-Microservice

Tiny Express microservice that lets a user "like" a location and check whether
they have liked it.

Backed by Supabase/Postgres — the like relations live in the Arcadia
`user_liked_locations` join table (`user_id` uuid, `location_id` int,
composite primary key).

## Endpoints

| Method | Path                                                       | Description                                              |
| ------ | ---------------------------------------------------------- | -------------------------------------------------------- |
| GET    | `/health`                                                  | Health check, returns `{ "status": "ok" }`.              |
| POST   | `/api/likes/location`                                      | Like a location for a user.                              |
| GET    | `/api/likes/location/status?userId=…&locationId=…`         | Whether the user has liked the location.                 |

### POST `/api/likes/location`

Body: `{ "userId": "<uuid>", "locationId": <int> }`

- **201** `{ "liked": true }` — a new like was stored.
- **200** `{ "liked": true }` — the user had already liked it (no duplicate created;
  `(userId, locationId)` uniqueness is guaranteed by the table's composite primary key).
- **400** `{ "error": "invalid locationId" }` — missing/malformed `locationId`.

### GET `/api/likes/location/status?userId=…&locationId=…`

- **200** `{ "liked": true }` — the user has liked the location.
- **200** `{ "liked": false }` — the user has not liked the location.
- **400** `{ "error": "invalid locationId" }` — missing/malformed `locationId`.

`locationId` must be a positive integer; `userId` is the uuid the Arcadia app
carries in its `arcadiaUserId` cookie.

## Getting started

```bash
npm install
cp .env.example .env   # fill in SUPABASE_URL and SUPABASE_KEY
npm run dev            # or: npm start
```

The service listens on `PORT` (default `4002`).

## Quick test

```bash
# like a location
curl -X POST http://localhost:4002/api/likes/location \
  -H "Content-Type: application/json" \
  -d '{ "userId": "5b5213fa-ea11-4cc4-ac76-3cb7a757b9ff", "locationId": 1 }'

# check whether it's liked
curl "http://localhost:4002/api/likes/location/status?userId=5b5213fa-ea11-4cc4-ac76-3cb7a757b9ff&locationId=1"
```

## Tests

```bash
npm test   # node --test
```

The suite (`test/likes.test.js`) covers the user-story acceptance criteria:
status codes (201/200/400), `(userId, locationId)` uniqueness, and latency.

The tests run against the live Supabase project, so a populated `.env` is
required. They use a real seed `profiles.user_id` / `locations.location_id`
(override with `TEST_USER_ID` / `TEST_LOCATION_ID`) and clean up after
themselves.

> **Latency targets:** the stories require POST < 150 ms and GET avg < 100 ms.
> Those hold when the service is co-located with the database. Run against a
> *remote* Supabase, each call adds ~130 ms of public-internet round-trip, so
> the perf tests assert relaxed dev budgets (`PERF_POST_BUDGET_MS` /
> `PERF_GET_BUDGET_MS`, default 250 ms). Set them to `150` / `100` to enforce
> the production targets in a co-located environment.

## Project structure

```
server.js                         # entry point: loads env, starts the server
src/
  app.js                          # Express app: middleware, routes, 404
  config/supabase.js              # shared Supabase client
  routes/likes.routes.js          # maps HTTP routes to controller handlers
  controllers/likes.controller.js # request validation + response handling
  services/likes.service.js       # Supabase reads/writes on the likes table
```
