const express = require("express");
const likesController = require("../controllers/likes.controller");

const router = express.Router();

// POST /api/likes -> set (create) a like for a location
router.post("/", likesController.setLike);

// GET /api/likes -> get the likes for the current user
router.get("/", likesController.getLikes);

module.exports = router;
