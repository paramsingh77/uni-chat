const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require("../controllers/chatControllers");

const router = express.Router();


//if user is logged in then only this routes can be accessed.



router.route('/').post(protect,accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);


// //as we are going to update the name of the group so it would be a post request.
router.route("/rename").put(protect, renameGroup);


// //if someone wants to remove from the group 
router.route("/groupremove").put(protect,removeFromGroup );



// //if someone wants to remove from the group 
router.route("/groupadd").put(protect,addToGroup );

module.exports = router;