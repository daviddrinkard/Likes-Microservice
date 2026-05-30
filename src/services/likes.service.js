const supabase = require("../config/supabase");

// Join table in the Arcadia schema: (user_id uuid, location_id int), composite PK.
const LIKES_TABLE = process.env.LIKES_TABLE || "user_liked_locations";

// Set (create) the like relation between a user and a location.
// Upsert so calling it again on an already-liked location is a no-op rather
// than a primary-key conflict.
async function setLike({ userId, locationId }) {
  const { error } = await supabase
    .from(LIKES_TABLE)
    .upsert(
      { user_id: userId, location_id: locationId },
      { onConflict: "user_id,location_id", ignoreDuplicates: true },
    );
  if (error) throw error;
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
  setLike,
  isLiked,
};
