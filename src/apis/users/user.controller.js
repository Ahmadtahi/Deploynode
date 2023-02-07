"use strict";

let User = require("./user.model");
const userEmail = require("../email-verifcation/emailVerification.controller");
// var jwt = require('../../services/jwt.service');
var { validator } = require("../../util/helper");
var errorHandler = require("../../util/errorHandler");
const { sendMail } = require("../../services/email");
const {
  emailVerificationTemplate,
} = require("../../templates/email/email_verification");

// Login User
const login = async (req, res) => {
  try {
    // *request body validation
    const validationRule = {
      email: "required|email",
      password: "required",
    };

    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        return res.status(412).json({
          status: false,
          responseCode: 412,
          message: "Validation failed",
          data: err,
        });
      }
    });

    const { email, password } = req.body;
    let user = await User.findOne({ email });

    //let checkPwd = await findUser.isPasswordMatch(password);
    if (!user || !(await user.isPasswordMatch(password))) {
      res.send({ code: 401, message: "Incorrect email or password" });
    }
    user.password = null;
    console.log(user);
    res.send(user);
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Register User
const register = async (req, res) => {
  try {
    // *request body validation
    const validationRule = {
      name: "required",
      email: "required|email",
      password: "required",
    };

    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        return res.status(412).json({
          status: false,
          responseCode: 412,
          message: "Validation failed",
          data: err,
        });
      }
    });

    let newUser = new User(req.body);
    let result = await newUser.save();

    await userEmail.createNewEmailVerification({
      userId: newUser._id,
    });
    const url = `${process.env.FRONT_END_URL}/VerifyEmail/${newUser._id}`;

    await sendMail({
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Please Verify Email",
      html: emailVerificationTemplate(url, "Verify Email"),
    });

    res.send(result);
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Verify User
const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("🚀 ~ file: index.js ~ line 63 ~ app.patch ~ id", id)
    let user = await User.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!user) {
      return res.send({ code: 401, message: "User not verified." });
    }
    res.send(user);
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Get User Type API
const getAllUserType = async (req, res) => {
  try {
    let name = req.params.type;
    let result = await User.find({
      userType: name,
    });

    res.send(result);
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};
// Get User Type API
const getUserByID = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await User.find({
      _id: id,
    });

    res.send(result);
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

module.exports = {
  login: login,
  register: register,
  verifyUser: verifyUser,
  getAllUserType: getAllUserType,
  getUserByID: getUserByID,
};
