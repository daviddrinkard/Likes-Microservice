const likesService = require("../services/likes.service");

// location_id is an integer identity column in the Arcadia schema.
function parseLocationId(raw) {
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

// POST /api/likes  body: { userId, locationId }
// Sets the like relation between the user and the location.
async function setLike(req, res) {
  const { userId } = req.body || {};
  const locationId = parseLocationId(req.body?.locationId);

  if (!userId || locationId === null) {
    return res
      .status(400)
      .json({ error: "userId and a positive integer locationId are required" });
  }

  console.log(`setLike user=${userId} location=${locationId}`);
  try {
    await likesService.setLike({ userId, locationId });
    res.status(200).json({ status: "ok", liked: true });
  } catch (err) {
    console.error("setLike failed:", err.message);
    res.status(500).json({ error: "Failed to set like" });
  }
}

// GET /api/likes?userId=...&locationId=...
// Returns whether the user has liked the location.
async function getLike(req, res) {
  const { userId } = req.query;
  const locationId = parseLocationId(req.query.locationId);

  if (!userId || locationId === null) {
    return res
      .status(400)
      .json({ error: "userId and a positive integer locationId are required" });
  }

  console.log(`getLike user=${userId} location=${locationId}`);
  try {
    const liked = await likesService.isLiked({ userId, locationId });
    res.status(200).json({ liked });
  } catch (err) {
    console.error("getLike failed:", err.message);
    res.status(500).json({ error: "Failed to get like" });
  }
}

module.exports = {
  setLike,
  getLike,
};
