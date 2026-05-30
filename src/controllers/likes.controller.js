const likesService = require("../services/likes.service");

// POST /api/likes
// Eventually: persist that a user liked a location. For now just acknowledges.
async function setLike(req, res) {
  console.log("setLike called with body:", req.body);
  try {
    await likesService.setLike(req.body);
    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("setLike failed:", err.message);
    res.status(500).json({ error: "Failed to set like" });
  }
}

// GET /api/likes
// Eventually: return the locations a user has liked. For now returns an empty list.
async function getLikes(req, res) {
  console.log("getLikes called");
  try {
    const likes = await likesService.getLikes();
    res.status(200).json(likes);
  } catch (err) {
    console.error("getLikes failed:", err.message);
    res.status(500).json({ error: "Failed to get likes" });
  }
}

module.exports = {
  setLike,
  getLikes,
};
