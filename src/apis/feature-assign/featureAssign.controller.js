"use strict";

let ProjectFeature = require("../project-features/projectFeature.model");
var errorHandler = require("../../util/errorHandler");

// Get All Project API
// const allFeatureAssign = async (req, res) => {
//   try {
//     var { page, limit } = req.query;
//     page = parseInt(page) || 1;
//     limit = parseInt(limit) || 10;
//     var skip = (page - 1) * limit;

//     let result = await ProjectFeature.find.skip(skip).limit(limit);
//     var totalPages, totalCount;
//     if (limit > 0) {
//         totalCount = await ProjectFeature.countDocuments()
//         totalPages = Math.ceil(totalCount / limit);
//     }

//     res.send({
//         features: result,
//         totalPages,
//         totalCount
//     });
//   } catch (err) {
//     let error = errorHandler.handle(err);
//     return res.status(500).json(error);
//   }
// };

const allFeatureAssign = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await ProjectFeature.find({
      team_lead_id: id,
    });

    res.send(result);
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Get Features of Single Project
const allProjectFeatureAssign = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await ProjectFeature.find({
      team_lead_id: id,
    });

    res.send(result);
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Get Features by Project ID
const projectFeaturesByProjectID = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await ProjectFeature.find({
      project_id: id,
    });

    res.send(result);
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Feature Assign API
const featureAssignToTL = async (req, res) => {
  try {
    let teamLeads = req.body;

    teamLeads.map(async (leads) => {
      let setFeatureUpdatedQuery = {
        team_lead_id: leads.team_lead_id,
        project_name: leads.project_name,
      };
      await ProjectFeature.findOneAndUpdate(
        { _id: leads.feature_id },
        { $set: setFeatureUpdatedQuery }
      );
    });

    res.status(200).json({
      status: true,
      message: "Project Feature Assigned Successfully!",
    });
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Feature Completion By TL API
const featureCompleteByTL = async (req, res) => {
  try {
    if (
      req.body.status &&
      req.body.status != "Completed" &&
      req.body.status != "Pending"
    ) {
      return res.status(404).json({
        status: false,
        message: "Invalid status passed",
      });
    }

    const setProjectModelQuery = {
      status: req.body.status ? req.body.status : "",
      remarks: req.body.remarks ? req.body.remarks : "",
    };

    const taskStatus = await ProjectFeature.findOneAndUpdate(
      { _id: req.body.feature_id },
      { $set: setProjectModelQuery }
    );

    if (!taskStatus) {
      return res.status(500).json({
        status: false,
        message: "Unexpected error",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Project Feature Updated Successfully",
      });
    }
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

module.exports = {
  allFeatureAssign: allFeatureAssign,
  allProjectFeatureAssign: allProjectFeatureAssign,
  projectFeaturesByProjectID: projectFeaturesByProjectID,
  featureAssignToTL: featureAssignToTL,
  featureCompleteByTL: featureCompleteByTL,
};
