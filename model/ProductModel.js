const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be less than 0"],
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: [0, "Discount cannot be less than 0"],
    max: [100, "Discount cannot be greater than 100"],
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, "Rating cannot be less than 0"],
    max: [5, "Rating cannot be greater than 5"],
  },
  description: { type: String, required: true },
  stock: { type: Number, min: [0, "Stock cannot be less than 0"] },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  deleted: { type: Boolean, default: false },
});

const virtual = productSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// This is the name of the mongoose model \|/ and the name of the mongoDB collection
exports.ProductModel = mongoose.model("products", productSchema);
