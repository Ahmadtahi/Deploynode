"use strict";

let express = require("express");
let projectCtrl = require("./project.controller");
// let auth = require('../../services/auth.service');
const upload = require("../../services/upload");
let router = express.Router();

// *Prefix Path --- '/api/project'

//post
router.post("/create", upload.any(), projectCtrl.create);
router.patch("/update/:id", projectCtrl.update);
router.get("/all", projectCtrl.all);
router.get("/similarity", projectCtrl.similarity);
router.delete("/delete/:id", projectCtrl.deleteProject);
router.get("/:id", projectCtrl.get);
router.get("/getprojects/:name", projectCtrl.getManagerProject);
router.get("/getProjectById/:id", projectCtrl.getprojectById);
router.get("/download-file/:file", projectCtrl.downloadFile);

module.exports = router;
