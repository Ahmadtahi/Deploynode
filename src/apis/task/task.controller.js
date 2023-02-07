"use strict";

let ProjectTask = require("./task.model");
let ProjectFeatures = require("../project-features/projectFeature.model");
var errorHandler = require("../../util/errorHandler");

// Task Assign To Dev API
const taskAssignToDev = async (req, res) => {
  try {
    const task = new ProjectTask(req.body);
    let result = await task.save();
    res.status(200).json({
      status: true,
      message: "Task Assigned Successfully!",
    });
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Task Completion By Dev API
const taskCompleteByDev = async (req, res) => {
  try {
    let setTaskUpdatedQuery = {
      status: req.body.status,
      fileNames: req.body.fileNames,
    };
    const taskStatus = await ProjectTask.findOneAndUpdate(
      { _id: req.body._id },
      { $set: setTaskUpdatedQuery }
    );

    if (req.body.fileNames) {
      let setProjectFeatureUpdatedQuery = {
        fileNames: req.body.fileNames,
      };
      const projectFeature = await ProjectFeatures.findOneAndUpdate(
        { _id: req.body.feature_id },
        { $set: setProjectFeatureUpdatedQuery }
      );
    }

    res.status(200).json({
      status: true,
      message: "Task Status Updated Successfully!",
    });
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Get All Assign Task
const allTaskAssign = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await ProjectTask.find({
      dev_id: id,
    });

    res.send(result);
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

module.exports = {
  allTaskAssign: allTaskAssign,
  taskAssignToDev: taskAssignToDev,
  taskCompleteByDev: taskCompleteByDev,
};
