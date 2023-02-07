"use strict";

let Project = require("./project.model");
let ProjectFeature = require("../project-features/projectFeature.model");
let ProjectTask = require("../task/task.model");
var errorHandler = require("../../util/errorHandler");
var stringSimilarity = require("string-similarity");

// Create API
const create = async (req, res) => {
  try {
    const {
      name,
      project_id,
      completion_date,
      manager_name,
      functional_requirements,
      scope,
      fileNames,
      features,
      isNewModule,
      projectDeadline,
    } = req.body;

    const projectModel = {
      name,
      project_id,
      completion_date,
      manager_name,
      functional_requirements,
      scope,
      fileNames,
      isNewModule,
      projectDeadline,
    };

    const project = new Project(projectModel);
    let result = await project.save();

    if (isNewModule) {
      let insert = [];
      let projectFeatures = JSON.parse(features);

      projectFeatures.map((feature) => {
        insert.push({
          project_id: result._id,
          feature: feature.name,
          assigned_by: result.manager_name,
          completion_date: result.completion_date,
        });
      });
      const response = await ProjectFeature.insertMany(insert);
    }

    res
      .status(200)
      .json({ status: true, message: "Project Created Successfully!" });
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Update API
const update = async (req, res) => {
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

    const updateProjectModel = await Project.findOneAndUpdate(
      { _id: req.params.id },
      { $set: setProjectModelQuery }
    );

    if (!updateProjectModel) {
      return res.status(500).json({
        status: false,
        message: "Unexpected error",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Project Updated Successfully",
      });
    }
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Get All Project API
const all = async (req, res) => {
  try {
    var { page, limit, search } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    var skip = (page - 1) * limit;
    let where = {};
    if (search) {
      where["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { project_id: { $regex: search, $options: "i" } },
        { isNewModule: { $regex: search, $options: "i" } },
      ];
    }

    let result = await Project.find(where).skip(skip).limit(limit);
    var totalPages, totalCount;
    if (limit > 0) {
      totalCount = await Project.countDocuments();
      totalPages = Math.ceil(totalCount / limit);
    }

    res.send({
      projects: result,
      totalPages,
      totalCount,
    });
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Get Similarity Project API
const similarity = async (req, res) => {
  try {
    var { selectedSimilarityType, search } = req.query;
    let where = {};
    if (search) {
      // where['name'] = { $regex: search, $options: "i" }
      // where['project_id'] = { $regex: search, $options: "i" }
      // if (selectedSimilarityType?.toLowerCase() == 'scope') {
      where["$or"] = [
        // { scope: { $regex: search, $options: "i" } },
        { $text: { $search: search } },
      ];
      // }
      // } else if (selectedSimilarityType?.toLowerCase() == 'functional requirement') {
      //     where['$or'] = [
      //         { functional_requirements: { $regex: search, $options: "i" } }
      //         // { $text: { $search: search } },
      //     ]
      // }
    }

    let result = await Project.find(where);
    const temp = result.map((r) => {
      return {
        _id: r._id,
        project_id: r.project_id,
        name: r.name,
        completion_date: r.completion_date,
        manager_name: r.manager_name,
        functional_requirements: r.functional_requirements,
        scope: r.scope,
        fileNames: r.fileNames,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        __v: r.__v,
        scopeSimilarity: stringSimilarity.compareTwoStrings(r.scope, search),
        functionalSimilarity: stringSimilarity.compareTwoStrings(
          r.functional_requirements,
          search
        ),
      };
    });
    res.send({
      projects: temp,
      result,
    });
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Delete Project API
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const setProjectModelQuery = {
      _id: projectId,
    };

    const setProjectFeatureModelQuery = {
      project_id: projectId,
    };

    const setProjectTaskModelQuery = {
      project_id: projectId,
    };

    const deleteProjectModel = await Project.deleteOne(setProjectModelQuery);
    const deleteProjectFeatureModel = await ProjectFeature.deleteMany(
      setProjectFeatureModelQuery
    );
    const deleteProjectTaskModel = await ProjectTask.deleteMany(
      setProjectTaskModelQuery
    );

    if (!deleteProjectModel) {
      return res.status(500).json({
        status: false,
        message: "Unexpected error",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Project Deleted Successfully",
      });
    }
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Get Project API
const get = async (req, res) => {
  try {
    let projectId = req.params.id;
    let result = await Project.findOne({
      _id: projectId,
    });

    res.send(result);
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

// Get Project API
const getManagerProject = async (req, res) => {
  try {
    let name = req.params.name;
    let result = await Project.find({
      manager_name: name,
    });

    res.send(result);
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};
// Get Project API
const downloadFile = async (req, res) => {
  try {
    var file = req.params.file;
    var fileLocation = path.join("../../../../uploads", file);
    // console.log(fileLocation);
    res.download(fileLocation, file);

    // res.send(result);
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

const getprojectById = async (req, res) => {
  try {
    let results = await Project.aggregate([
      {
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: req.params.id }] },
        },
      },
      {
        $lookup: {
          from: "projectfeatures",
          localField: "_id",
          foreignField: "project_id",
          as: "project_features",
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "project_id",
          as: "project_tasks",
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "Project Detail",
      data: results,
    });
  } catch (err) {
    let error = errorHandler.handle(err);
    return res.status(500).json(error);
  }
};

module.exports = {
  create: create,
  update: update,
  all: all,
  similarity: similarity,
  deleteProject: deleteProject,
  get: get,
  getManagerProject: getManagerProject,
  downloadFile: downloadFile,
  getprojectById: getprojectById,
};
