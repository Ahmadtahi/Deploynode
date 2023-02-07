"use strict";

let express = require("express");

// *app routes
let userRoutes = require("https://deploynode.onrender.com/apis/users/user.route");
let projectRoutes = require("https://deploynode.onrender.com/apis/project/project.route");
let projectFeatureRoutes = require("https://deploynode.onrender.com/apis/feature-assign/featureAssign.route");
let taskRoutes = require("https://deploynode.onrender.com/apis/task/task.route");

let router = express.Router();

// *Prefix Path --- '/api/'
router.use("/user", userRoutes);
router.use("/project", projectRoutes);
router.use("/feature", projectFeatureRoutes);
router.use("/task", taskRoutes);

module.exports = router;
