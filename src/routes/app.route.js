"use strict";

let express = require("express");

// *app routes
let userRoutes = require("../apis/users/user.route");
let projectRoutes = require("../apis/project/project.route");
let projectFeatureRoutes = require("../apis/feature-assign/featureAssign.route");
let taskRoutes = require("../apis/task/task.route");

let router = express.Router();

// *Prefix Path --- '/api/'
router.use("/user", userRoutes);
router.use("/project", projectRoutes);
router.use("/feature", projectFeatureRoutes);
router.use("/task", taskRoutes);

module.exports = router;
