const mongoose = require("mongoose");
const { Schema } = mongoose;

const CatergorySchema = Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
});

const virtual = CatergorySchema.virtual("id");
virtual.get(function () {
  return this._id;
});
CatergorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.CatergoryModel = mongoose.model("categories", CatergorySchema);