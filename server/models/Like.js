const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide the user ID."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = LikeSchema;
