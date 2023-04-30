const express = require("express");
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRoute = express.Router();

userRoute.post("/register", async (req, res) => {
  const { email, password, name, age } = req.body;
  try {
    bcrypt.hash(password, 6, async (err, hash) => {
      // Store hash in your password DB.
      const newUser = new UserModel({ email, name, age, password: hash });
      await newUser.save();
      //   console.log(newUser);
      res.status(200).send({ msg: "New user is register" });
    });
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          const token = jwt.sign({ userId: user._id }, "masai");
          res.status(200).send({ msg: "Login Succesful", token: token });
        } else {
          res.status(200).send({ msg: "Wrong credentials" });
        }
      });
    } else {
      res.status(200).send({ msg: "Wrong credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = { userRoute };
