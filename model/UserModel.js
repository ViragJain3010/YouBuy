const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = Schema({
  email: { type: String, required: true },
  address: { type: [Schema.Types.Mixed], required: true },
  userId: { type: String, required: true },
});

const virtual = UserSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.UserModel = mongoose.model("users", UserSchema);
