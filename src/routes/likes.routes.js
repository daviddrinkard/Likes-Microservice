const express = require("express");
const likesController = require("../controllers/likes.controller");

const router = express.Router();

// POST /api/likes/location -> store the like relation for (userId, locationId)
router.post("/location", likesController.addLike);

// GET /api/likes/location/status?userId=...&locationId=... -> is it liked?
router.get("/location/status", likesController.getLikeStatus);

module.exports = router;
