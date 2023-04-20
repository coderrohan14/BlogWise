const mongoose = require("mongoose");
const LikeSchema = require("./Like");

const CommentSchema = mongoose.Schema(
  {
    postID: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: [true, "Please provide the postID."],
    },
    commenterID: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the commenter's userID."],
    },
    comment: {
      type: String,
      required: [true, "Please provide a comment body."],
      minLength: 1,
      maxLength: 200,
    },
    likes: {
      type: [LikeSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Comment", CommentSchema);
