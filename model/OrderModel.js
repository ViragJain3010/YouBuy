const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrdersSchema = Schema({
  products: { type: [Schema.Types.Mixed], required: true },
  subtotal: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  userId: { type: String, required: true },
  selectedAddress: { type: Schema.Types.Mixed, required: true },
  status: { type: String, required: true, default: "SHIPPING" },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: "PENDING" },
});

const virtual = OrdersSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
OrdersSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.OrderModel = mongoose.model("orders", OrdersSchema);

