const mongoose = require("mongoose");
const slugify = require("slugify");

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A property must have a name"],
      unique: true,
    },
    slogan: String,
    slug: String,
    description: {
      type: String,
      trim: true,
      required: [true, "A property must have a description"],
    },
    type: {
      type: String,
      required: [true, "A property must have a type"],
      enum: {
        values: ["apartment", "house", "villa", "land"],
        message:
          "Property type must be choosen from apartment, house, villa,land",
      },
    },
    price: {
      type: Number,
      required: [true, "A property must have a price"],
    },
    area: {
      type: Number,
      required: [true, "A property must have a price"],
    },
    beds: {
      type: Number,
    },

    images: [String],
    completion: {
      type: Boolean,
      default: true,
    },
    features: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    location: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        required:true
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    forSale: {
      type: Boolean,
      default: true,
    },
    forRent: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
propertySchema.index({ price: 1, ratingsAverage: -1 });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
propertySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
propertySchema.pre(/^find/, function (next) {
  this.populate({
    path: "owner",
    select: "-__v -passwordChangedAt",
  });

  next();
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
