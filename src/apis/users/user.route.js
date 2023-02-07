"use strict";

let express = require("express");
let userCtrl = require("./user.controller");
// let auth = require('../../services/auth.service');
let router = express.Router();

// *Prefix Path --- '/api/user'

//post
router.post("/login", userCtrl.login);
router.post("/register", userCtrl.register);
router.patch("/verify/user/:id", userCtrl.verifyUser);
router.get("/get-user-type/:type", userCtrl.getAllUserType);
router.get("/get-user/:id", userCtrl.getUserByID);

module.exports = router;
