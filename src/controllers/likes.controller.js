const likesService = require("../services/likes.service");

// location_id is a positive integer identity column in the Arcadia schema.
// Returns the parsed integer, or null when the value is missing/malformed.
function parseLocationId(raw) {
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

// POST /api/likes/location  body: { userId, locationId }
// Stores the like relation. 201 when newly created, 200 when it already existed.
async function addLike(req, res) {
  const locationId = parseLocationId(req.body?.locationId);
  if (locationId === null) {
    return res.status(400).json({ error: "invalid locationId" });
  }
  const { userId } = req.body || {};
  if (!userId) {
    return res.status(400).json({ error: "invalid userId" });
  }

  console.log(`addLike user=${userId} location=${locationId}`);
  try {
    const { created } = await likesService.addLike({ userId, locationId });
    res.status(created ? 201 : 200).json({ liked: true });
  } catch (err) {
    console.error("addLike failed:", err.message);
    res.status(500).json({ error: "Failed to set like" });
  }
}

// GET /api/likes/location/status?userId=...&locationId=...
// Returns whether the user has liked the location.
async function getLikeStatus(req, res) {
  const locationId = parseLocationId(req.query.locationId);
  if (locationId === null) {
    return res.status(400).json({ error: "invalid locationId" });
  }
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "invalid userId" });
  }

  console.log(`getLikeStatus user=${userId} location=${locationId}`);
  try {
    const liked = await likesService.isLiked({ userId, locationId });
    res.status(200).json({ liked });
  } catch (err) {
    console.error("getLikeStatus failed:", err.message);
    res.status(500).json({ error: "Failed to get like status" });
  }
}

module.exports = {
  addLike,
  getLikeStatus,
};
