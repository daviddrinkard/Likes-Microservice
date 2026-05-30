# Likes-Microservice

Tiny Express microservice that lets a user "like" a location and check whether
they have liked it.

Backed by Supabase/Postgres — the like relations live in the Arcadia
`user_liked_locations` join table (`user_id` uuid, `location_id` int,
composite primary key).

## Endpoints

| Method | Path                                       | Description                                                    |
| ------ | ------------------------------------------ | -------------------------------------------------------------- |
| GET    | `/health`                                  | Health check, returns `{ "status": "ok" }`.                    |
| POST   | `/api/likes`                               | Set the like relation for a user + location (idempotent).      |
| GET    | `/api/likes?userId=…&locationId=…`         | Returns `{ "liked": true \| false }` for that user + location. |

Both endpoints require a `userId` (uuid) and a positive integer `locationId`;
missing or invalid values return `400`.

## Getting started

```bash
npm install
cp .env.example .env   # fill in SUPABASE_URL and SUPABASE_KEY
npm run dev            # or: npm start
```

The service listens on `PORT` (default `4002`).

## Quick test

```bash
# set a like
curl -X POST http://localhost:4002/api/likes \
  -H "Content-Type: application/json" \
  -d '{ "userId": "5b5213fa-ea11-4cc4-ac76-3cb7a757b9ff", "locationId": 1 }'

# check whether it's liked
curl "http://localhost:4002/api/likes?userId=5b5213fa-ea11-4cc4-ac76-3cb7a757b9ff&locationId=1"
```

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
