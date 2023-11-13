const express = require("express");
const propertyController = require("./../controllers/propertyController");
const authController = require("./../controllers/authController");
const multer = require("multer");
const { propertyStorage } = require("../utils/cloudinaryStorage");
const propertyImagesParser = multer({ storage: propertyStorage });
const router = express.Router();

//uploading routes
router
  .route("/upload/:propertyId")
  .post(
    propertyImagesParser.array("images", 10),
    propertyController.uploadMultiplePropertyImages
  );
//removingImages
router
  .route("/remove/:propertyId")
  .patch(propertyController.removePropertyImages);
router
  .route("/recents")
  .get(
    propertyController.aliasRecentProperties,
    propertyController.getAllProperties
  );

router
  .route("/properties-within/:distance/center/:latlng/unit/:unit")
  .get(propertyController.getPropertiesWithin);

router
  .route("/")
  .get(propertyController.getAllProperties)
  .post(
    authController.protect,
    authController.restrictTo("admin", "agent"),
    propertyController.createProperty
  );

router
  .route("/:id")
  .get(propertyController.getProperty)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "agent"),
    propertyController.updateProperty
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "agent"),
    propertyController.deleteProperty
  );

module.exports = router;
