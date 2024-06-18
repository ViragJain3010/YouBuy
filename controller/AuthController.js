const { sanitize } = require("../common");
const { AuthModel } = require("../model/AuthModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/UserModel");

exports.loginUser = async (req, res) => {
  const user = req.user;
  
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ role: user.role, token: user.token });
};

exports.logoutUser = async (req, res) => {
  res
    .cookie('jwt', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200)
};

exports.checkUser = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

exports.createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let auth = await AuthModel.exists({ email: email });
    if (auth) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      "sha256",
      async (err, hashedPassword) => {
        if (err) {
          return res.status(400).json(err);
        }
        auth = new AuthModel({ ...req.body, password: hashedPassword, salt });
        try {
          const doc = await auth.save();

          req.login(sanitize(auth), async (err) => {
            if (err) {
              return res.status(400).json(err);
            }
            const token = jwt.sign(sanitize(doc), process.env.JWT_SECRET_KEY);

            // creating a new user (not auth) whenever a new user is created successfully
            const user = new UserModel({
              email: email,
              userId: doc._id,
              address: [],
            });

            try {
              const userDoc = await user.save();
              res
                .cookie("jwt", token, {
                  expires: new Date(Date.now() + 3600000),
                  httpOnly: true,
                })
                .status(201)
                .json({ role: doc.role, token: token });
            } catch (userErr) {
              res.status(400).json(userErr);
            }
          });
        } catch (authErr) {
          res.status(400).json(authErr);
        }
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const auth = await AuthModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    const doc = await auth.save();
    res.status(200).json({
      message: "Password changed successfully",
      email: doc.email,
      role: doc.role,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};
