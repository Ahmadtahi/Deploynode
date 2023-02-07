"use strict";

let express = require("express");
let featureAssignCtrl = require("./featureAssign.controller");
let router = express.Router();

// *Prefix Path --- '/api/features'

//post
router.get("/all/", featureAssignCtrl.allFeatureAssign);
router.get("/all-features/:id", featureAssignCtrl.allProjectFeatureAssign);
router.get("/project-id/:id", featureAssignCtrl.projectFeaturesByProjectID);
router.post("/assign", featureAssignCtrl.featureAssignToTL);
router.post("/update", featureAssignCtrl.featureCompleteByTL);

module.exports = router;
