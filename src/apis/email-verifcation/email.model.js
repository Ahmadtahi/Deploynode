const mongoose = require('mongoose')

const emailVerificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailVerification", emailVerificationSchema)