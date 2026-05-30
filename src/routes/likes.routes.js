const express = require("express");
const likesController = require("../controllers/likes.controller");

const router = express.Router();

// POST /api/likes -> set the like relation for a (userId, locationId)
router.post("/", likesController.setLike);

// GET /api/likes?userId=...&locationId=... -> is this location liked by the user?
router.get("/", likesController.getLike);

module.exports = router;
