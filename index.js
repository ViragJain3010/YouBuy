const express = require("express");
const server = express();

const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require('dotenv').config()
const path = require('path');

const productRouter = require("./routes/ProductRoutes");
const categoryRouter = require("./routes/CategoryRoutes");
const brandRouter = require("./routes/BrandsRoutes");
const userRouter = require("./routes/UserRoutes");
const authRouter = require("./routes/AuthRoutes");
const cartRouter = require("./routes/CartRoutes");
const orderRouter = require("./routes/OrderRoutes");
const { AuthModel } = require("./model/AuthModel");
const { sanitize, isAuth, cookieExtractor } = require("./common");


// JWT token
const token = jwt.sign({}, process.env.JWT_SECRET_KEY);
var opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

// MIDDLEWARE
server.use(cors({ exposedHeaders: ["X-Total-Count"] }));
server.use(express.json()); // to parse req.body in json format
server.use(express.raw({ type: "application/json" }));

// Session middleware setup
server.use(express.static(path.resolve(__dirname, 'build')));
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware setup
server.use(passport.authenticate("session"));

// Passport Local Strategy
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email" }, // Specify that the username is the email field
    async function (username, password, done) {
      try {
        const auth = await AuthModel.findOne({ email: username });
        if (!auth) {
          return done(null, false, { message: "Invalid Credentials" }); //User not found
        }
        crypto.pbkdf2(
          password,
          auth.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(auth.password, hashedPassword)) {
              return done(null, false, { message: "Invalid Credentials" }); //Invalid password
            }
            const token = jwt.sign(sanitize(auth), process.env.JWT_SECRET_KEY);
            done(null, { id: auth.id, role: auth.role, token }); // this is sent to serializer
          }
        );
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const auth = await AuthModel.findById(jwt_payload.id);
      if (auth) {
        return done(null, sanitize(auth)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// Serialize and deserialize user
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Stripe Integration
const stripe = require("stripe")(
  process.env.STRIPE_APIKEY
);

server.post("/create-payment-intent", async (req, res) => {
  const { amount, description, shipping } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
    description: description,
    shipping: {
      name: shipping.fullName,
      address: {
        line1: shipping.street,
        postal_code: shipping.pincode,
        city: shipping.city,
        state: shipping.state,
        country: "India",
      },
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Webhook
const endpointSecret = process.env.ENDPOINT_SECRET;
server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// Routes
server.use("/products", productRouter.routes);
server.use("/category", categoryRouter.routes);
server.use("/brands", brandRouter.routes);
server.use("/users", isAuth(), userRouter.routes);
server.use("/auth", authRouter.routes);
server.use("/cart", isAuth(), cartRouter.routes);
server.use("/orders", isAuth(), orderRouter.routes);

// Database connection
main().catch((err) => console.error(err));
async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {dbName: 'Ecommerce'});
    console.log("Database connection established");
  } catch (error) {
    console.error(error);
  }
}

// Port connection
server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
