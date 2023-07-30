const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express();

router.route("/").post(registerUser).get(protect , allUsers);
router.post("/login", authUser);

module.exports = router;