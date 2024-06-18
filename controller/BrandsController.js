const { BrandModel } = require("../model/BrandModel");

exports.fetchAllBrands = async (req, res) => {
  try {
    const brands = await BrandModel.find().exec();
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createBrand = async (req, res) => {
  const brand = new BrandModel(req.body);
  try {
    const doc = await brand.save();
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
