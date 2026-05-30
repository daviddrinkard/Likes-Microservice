# Likes-Microservice

Tiny Express microservice that lets a single user "like" locations and read
back the locations they have liked.

This is an early scaffold: the endpoints accept requests and return `200`s.
The actual persistence (storing/reading a user's liked locations) is stubbed
out in `src/services/likes.service.js` and will be wired up later.

## Endpoints

| Method | Path          | Description                                   |
| ------ | ------------- | --------------------------------------------- |
| GET    | `/health`     | Health check, returns `{ "status": "ok" }`.   |
| POST   | `/api/likes`  | Set (create) a like for a location.           |
| GET    | `/api/likes`  | Get the likes for the current user.           |

## Getting started

```bash
npm install
cp .env.example .env   # adjust PORT if needed
npm run dev            # or: npm start
```

The service listens on `PORT` (default `4002`).

## Quick test

```bash
# set a like
curl -X POST http://localhost:4002/api/likes \
  -H "Content-Type: application/json" \
  -d '{ "userId": "u1", "locationId": "loc1" }'

# get likes
curl http://localhost:4002/api/likes
```

## Project structure

```
server.js                         # entry point: loads env, starts the server
src/
  app.js                          # Express app: middleware, routes, 404
  routes/likes.routes.js          # maps HTTP routes to controller handlers
  controllers/likes.controller.js # request/response handling
  services/likes.service.js       # business logic (stubbed for now)
```
