const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    private: false
  },
  userType: {
    type: String,
    enum: ['project_manager', 'team_member', 'team_lead']
  },
  status: {
    type: String,
    default: 'not_verified'
  },
});

UserSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  console.log("debug this :", this);
  return password == user.password;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;