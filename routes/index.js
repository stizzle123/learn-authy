const express = require("express");
const router = express.Router();
const userController = require("../controller/users");

router.post("/api/register", userController.register);
router.get("/api/home", userController.getHome);
router.get("/api/verify/:id", userController.verify);

module.exports = router;
