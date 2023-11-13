const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const multer = require("multer");
const { profileStorage } = require("../utils/cloudinaryStorage");
const router = express.Router();
const profileImageParser = multer({ storage: profileStorage });

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/signout", authController.signout);
// Protect all routes after this middleware
router.use(authController.protect);

router.get("/me", userController.getMe, userController.getUser);
router.patch(
  "/updateMe",
  profileImageParser.single("photo"),
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

// Protect all routes after this middleware for admin
router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
