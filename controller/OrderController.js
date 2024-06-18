const { OrderModel } = require("../model/OrderModel");

exports.addOrder = async (req, res) => {
  const order = OrderModel({...req.body, userId: req.user.id});
  try {
    const doc = await order.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrdersByUserId = async (req, res) => {
  const userId = req.user.id;
  console.log(userId)
  try {
    const order =await OrderModel.find({ userId: userId }).exec();
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  let query = OrderModel.find();
  let totalDocs = OrderModel.find();

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalDocs = totalDocs.sort({ [req.query._sort]: req.query._order });
  }
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  const totalCount = await totalDocs.count().exec();

  try {
    const doc = await query.exec();
    res.set("X-Total-Count", totalCount);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await OrderModel.findByIdAndUpdate(orderId, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};
