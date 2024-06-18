const { ProductModel } = require("../model/ProductModel");
const mongoose = require("mongoose");


exports.createNewProduct = async (req, res) => {
  const product = new ProductModel(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductsByFilter = async (req, res) => {
  // filter = {"Catergory": ["smartphones","laptops"]}    --> filter will be this type of object
  //  sort = {_sort : "price", _order:"desc"}             --> sort will be this type of object
  // pagination = {_page: 1, _limit:10}
  let query = {};
  let totalDocs = {};
  if (req.user && req.user.role === "admin") {
    query = ProductModel.find({});
    totalDocs = ProductModel.find();
  } else {
    query = ProductModel.find({ deleted: { $ne: true } });
    totalDocs = ProductModel.find({ deleted: { $ne: true } });
  }

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalDocs = totalDocs.find({ category: req.query.category });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalDocs = totalDocs.find({ brand: req.query.brand });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalDocs = totalDocs.sort({ [req.query._sort]: req.query._order });
  }
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }
  const totalCount = await totalDocs.countDocuments().exec();

  try {
    const doc = await query.exec();
    res.set("X-Total-Count", totalCount);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};


exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};
