const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = Schema(
  {
    userId: { type: String, required: true },
    product: { type: Schema.Types.Mixed, required: true },
    quantity: { type: Number, required: true },
  },
  { collection: "cart" }
);

const virtual = CartSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
CartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.CartModel = mongoose.model("cart", CartSchema);
