const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects",
  },
  feature_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projectfeatures",
  },
  team_lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  dev_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  team_lead_name: {
    type: String,
  },
  task: {
    type: String,
  },
  fileNames: {
    type: [String],
  },
  status: {
    type: String,
    default: "Pending",
  },
  project_deadline: {
    type: Date,
  },
});

module.exports = mongoose.model("Tasks", TaskSchema);
