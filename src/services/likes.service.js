// Placeholder business logic for the Likes microservice.
//
// For now these are no-op stubs so the endpoints can take requests and
// return 200s. This is where Supabase (or another store) reads/writes will
// live once we wire up persistence for a user's liked locations.

async function setLike(like) {
  // TODO: persist the like (e.g. { userId, locationId }) to the data store.
  return { status: "ok" };
}

async function getLikes() {
  // TODO: fetch the current user's liked locations from the data store.
  return [];
}

module.exports = {
  setLike,
  getLikes,
};
