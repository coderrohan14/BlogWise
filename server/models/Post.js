const mongoose = require("mongoose");
const LikeSchema = require("./Like");

const PostSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the user ID."],
    },
    title: {
      type: String,
      required: [true, "Please provide the post's title."],
      unique: [true, "Post with this title already exists!"],
      minLength: 1,
      maxLength: 200,
    },
    body: {
      type: String,
      required: [true, "Please provide the post's body."],
      minLength: 1,
    },
    comments: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
          required: [true, "Please provide the commentID"],
        },
      ],
      default: [],
    },
    likes: {
      type: [LikeSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Post", PostSchema);
