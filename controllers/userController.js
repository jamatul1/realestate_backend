const multer = require("multer");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./allFactory");
const { getPublicId, removeImageFromCloud } = require("../utils/cloudinary");

// Create a multer storage in the images/users path
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/images/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

// Only image is allowed to be uploaded
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

// multer instance for upload the image
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

// Helper function to filter allowed fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Filtered out unwanted fields names that are not allowed to be updated
  let user = await User.findById(req.user.id);
  const filteredBody = filterObj(req.body, "email");
  if (req.file) {
    if (user.photo) {
      const photoId = getPublicId(user.photo);
      try {
        removeImageFromCloud("profile/" + photoId);
      } catch (error) {
        console.log("The photopath is invalid in userController/updateMe");
      }
    }
    filteredBody.photo = req.file.path;
  }

  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  let user = await User.findByIdAndUpdate(req.user.id, { active: false });
  if (user.photo) {
    const photoId = getPublicId(user.photo);
    try {
      removeImageFromCloud("profile/" + photoId);
    } catch (error) {
      console.log("The photopath is invalid in userController/updateMe");
    }
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Just for demo purposes
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

// Those routes are useful for admin functionality
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
