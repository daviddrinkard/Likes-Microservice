const supabase = require("../config/supabase");

// Join table in the Arcadia schema: (user_id uuid, location_id int), composite PK.
const LIKES_TABLE = process.env.LIKES_TABLE || "user_liked_locations";

// Postgres unique-violation error code (raised when the composite PK already
// holds this (user_id, location_id) pair).
const UNIQUE_VIOLATION = "23505";

// Create the like relation between a user and a location.
// Returns { created: true } when a new row was inserted, or { created: false }
// when the user had already liked the location (no duplicate is stored — the
// composite primary key guarantees uniqueness).
async function addLike({ userId, locationId }) {
  const { error } = await supabase
    .from(LIKES_TABLE)
    .insert({ user_id: userId, location_id: locationId });

  if (error) {
    if (error.code === UNIQUE_VIOLATION) return { created: false };
    throw error;
  }
  return { created: true };
}

// Return whether the given user has liked the given location.
async function isLiked({ userId, locationId }) {
  const { count, error } = await supabase
    .from(LIKES_TABLE)
    .select("user_id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("location_id", locationId);
  if (error) throw error;
  return (count || 0) > 0;
}

module.exports = {
  addLike,
  isLiked,
};
