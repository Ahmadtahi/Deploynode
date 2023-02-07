const mongoose = require("mongoose");

const projectFeatureSchema = mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects",
  },
  project_name: {
    type: String,
    ref: "projects",
  },
  team_lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  assigned_by: {
    type: String,
  },
  feature: {
    type: String,
    required: true,
  },
  fileNames: {
    type: [String],
  },
  status: {
    type: String,
    default: "Pending",
  },
  remarks: {
    type: String,
  },
  completion_date: {
    type: Date,
  },
});

module.exports = mongoose.model("ProjectFeatures", projectFeatureSchema);
