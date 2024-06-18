const { CatergoryModel } = require("../model/CategoryModel");

exports.fetchAllCategory = async (req, res) => {
  try {
    const categories = await CatergoryModel.find().exec();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createCategory = async (req, res) => {
  const category = new CatergoryModel(req.body);
  try {
    const doc = await category.save();
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
