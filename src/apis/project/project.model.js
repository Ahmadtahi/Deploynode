const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  project_id: {
    type: String,
    text: true,
  },
  name: {
    type: String,
    required: true,
    text: true,
  },
  completion_date: {
    type: Date,
  },
  manager_name: {
    type: String,
  },
  functional_requirements: {
    type: String,
  },
  scope: {
    type: String,
  },
  usecases: {
    type: String,
  },
  ssds: {
    type: String,
  },
  system_architecture: {
    type: String,
  },
  fileNames: {
    type: [String],
  },
  isNewModule: {
    type: String,
    default: false,
  },
  projectDeadline: {
    type: Date,
  },
  status: {
    type: String,
    default: 'Pending'
  },
  remarks: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

projectSchema.index({ "$**": "text" });

module.exports = mongoose.model("Projects", projectSchema);
