const mongoose = require("mongoose");
const { Schema } = mongoose;

const AuthSchema = Schema(
  {
    email: { type: String, required: true },
    password: { type: Buffer, required: true },
    role: { type: String, required: true, default: "user" },
    salt: Buffer,
  },
  { collection: "auth" }
);

const virtual = AuthSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
exports.AuthModel = mongoose.model("auth", AuthSchema);
AuthSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.AuthModel = mongoose.model("auth", AuthSchema);
