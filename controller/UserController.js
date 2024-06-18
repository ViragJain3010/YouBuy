const { UserModel } = require("../model/UserModel");

exports.fetchLoggedInUserData = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await UserModel.find({userId: userId});
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

// new user is created only when SIGN UP (this method is embedded in signup itself)
// exports.createLoggedInUserData = async (req, res) => {
//   const user = new UserModel({...req.body, userId: req.user.id});
//   try {
//     const doc = await user.save();
//     res.status(201).json(doc);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// used to add/delete/update new addresses
exports.updateLoggedInUserData = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await UserModel.findOneAndUpdate({userId: userId}, req.body, {
      new: true,
    });
    const doc = await user.save();
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
