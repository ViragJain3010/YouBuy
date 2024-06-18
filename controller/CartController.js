const { CartModel } = require("../model/CartModel");

exports.addToCart = async (req, res) => {
  const cartItem = new CartModel({...req.body, userId:req.user.id});
  try {
    const doc = await cartItem.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Gets all the cart items for a particular user
exports.fetchCartItemsByUserId = async (req, res) => {
  const userId  = req.user.id;
  try {
    const cartItems = await CartModel.find({ userId: userId }).exec();
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

// updates the cart item for a specific cart ID (only Qty is updated)
exports.updateCart = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cartItem = await CartModel.findByIdAndUpdate(cartId, req.body, {
      new: true,
    });
    const updatedCart = await cartItem.save();
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(400).json(err);
  }
};

// handles the remove from cart
exports.deleteItemFromCart = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cartItem = await CartModel.findByIdAndDelete(cartId);
    res
      .status(200)
      .json({ cartItem: cartItem, message: "Item deleted successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
};
