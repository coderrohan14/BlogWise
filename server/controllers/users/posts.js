const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const { BadRequestError, NotFoundError } = require("../../errors");

// post specific controllers

const getPosts = async (req, res) => {
  const { page, sortBy, search, userID } = await req.query;
  const queryObject = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { body: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  if (userID !== "null") {
    queryObject.userID = userID;
  }
  const pageQuery = Number(page) || 1;
  const limitQuery = 10;
  const skipBy = (pageQuery - 1) * limitQuery;
  const sortByQuery = sortBy ? sortBy : "-createdAt";
  const posts = await Post.find(queryObject)
    .sort(sortByQuery)
    .skip(skipBy)
    .limit(limitQuery);
  if (posts) {
    res.status(200).json({ success: true, posts });
  } else {
    res.status(404).json({
      success: false,
      msg: "Unable to fetch the posts at this time, please try again later.",
    });
  }
};

const getPost = async (req, res) => {
  const { postID } = await req.params;
  const post = await Post.findOne({ _id: postID });
  if (post) {
    res.status(200).json({ success: true, post });
  } else {
    throw new NotFoundError("No post found with the given postID.");
  }
};

const getTotalPages = async (req, res) => {
  const posts = await Post.find({});
  if (posts) {
    const totalPages = Math.ceil(posts.length / 10.0);
    res.status(200).json({ success: true, totalPages });
  } else {
    res.status(404).json({
      success: false,
      msg: "Unable to fetch the total number of pages at this time, please try again later.",
    });
  }
};

const deletePost = async (req, res) => {
  const { postID } = await req.params;
  const deletedPost = await Post.findOneAndRemove({ _id: postID });
  if (deletedPost) {
    await Comment.deleteMany({ postID });
    res.status(200).json({
      success: true,
      deletedPost,
    });
  } else {
    res.status(500).json({
      success: false,
      msg: "Unable to delete the post, please try again later.",
    });
  }
};

const addPost = async (req, res) => {
  const { user, title, body } = await req.body;
  const { userID } = await user;
  if (!userID || !title || !body) {
    throw new BadRequestError(
      "Please provide all the necessary information for the post."
    );
  }
  const newPost = await Post.create({ userID, title, body });
  if (newPost) {
    res.status(201).json({
      success: true,
      newPost,
    });
  } else {
    res.status(500).json({
      success: false,
      msg: "Unable to create the post, please try again later.",
    });
  }
};

const updatePostContent = async (req, res) => {
  const { postID } = await req.params;
  const { title, body } = await req.body;
  const updateBody = {};
  if (title) updateBody.title = title;
  if (body) updateBody.body = body;
  const updatedPost = await Post.findOneAndUpdate({ _id: postID }, updateBody, {
    new: true,
    runValidators: true,
  });
  if (updatedPost) {
    res.status(200).json({ success: true, updatedPost });
  } else {
    res.status(500).json({
      success: false,
      msg: "Unable to update the post, please try again later.",
    });
  }
};

const likePost = async (req, res) => {
  const { postID } = await req.params;
  const { userID } = await req.body.user;
  if (!userID) {
    throw new BadRequestError(
      "Please provide all the necessary information for the comment."
    );
  }

  const post = await Post.findOne({ _id: postID });

  if (!post) {
    throw new NotFoundError("No post found with the given post ID.");
  }

  const likes = post.likes.map((like) => like.userID.toString());

  if (likes.includes(userID)) {
    throw new BadRequestError("You have already liked the post.");
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postID,
    {
      $push: { likes: { userID } },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (updatedPost) {
    res.status(200).json({ success: true, updatedPost });
  } else {
    res.status(500).json({
      success: false,
      msg: "Unable to like the post, please try again later.",
    });
  }
};

const unlikePost = async (req, res) => {
  const { postID } = await req.params;
  const { userID } = await req.body.user;
  if (!userID) {
    throw new BadRequestError(
      "Please provide all the necessary information for the comment."
    );
  }

  const post = await Post.findOne({ _id: postID });

  if (!post) {
    throw new NotFoundError("No post found with the given post ID.");
  }

  const likes = post.likes.map((like) => like.userID.toString());

  if (!likes.includes(userID)) {
    throw new BadRequestError("You have not already liked the post.");
  }

  const updatedPost = await Post.findOneAndUpdate(
    {
      _id: postID,
      likes: {
        $elemMatch: {
          userID,
        },
      },
    },
    {
      $pull: {
        likes: {
          userID,
        },
      },
    },
    {
      new: true,
    }
  );
  if (updatedPost) {
    res.status(200).json({ success: true, updatedPost });
  } else {
    res.status(500).json({
      success: false,
      msg: "Unable to unlike the post, please try again later.",
    });
  }
};

// post comments controllers

const getComment = async (req, res) => {
  const { commentID } = await req.params;
  const comment = await Comment.findOne({ _id: commentID });
  if (comment) {
    res.status(200).json({ success: true, comment });
  } else {
    res.status(404).json({
      success: false,
      msg: "Unable to fetch the comment.",
    });
  }
};

const getAllPostComments = async (req, res) => {
  const { postID } = await req.params;
  const comments = await Comment.find({ postID }).sort("-createdAt");
  if (comments) {
    res.status(200).json({ success: true, comments });
  } else {
    res.status(404).json({
      success: false,
      msg: "Unable to fetch the comments.",
    });
  }
};

const addPostComment = async (req, res) => {
  const { postID } = await req.params;
  const { comment, user } = await req.body;
  const { userID: commenterID } = user;
  if (!comment || !commenterID) {
    throw new BadRequestError(
      "Please provide all the necessary information for the comment."
    );
  }
  const newComment = await Comment.create({ postID, commenterID, comment });
  if (newComment) {
    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      {
        $push: { comments: newComment._id },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (updatedPost) {
      res.status(201).json({
        success: true,
        updatedPost,
        newComment,
      });
    } else {
      await Comment.findOneAndRemove({ _id: newComment._id });
      res.status(500).json({
        success: false,
        msg: "Unable to add the comment, please try again later.",
      });
    }
  } else {
    res.status(500).json({
      success: false,
      msg: "Unable to add the comment, please try again later.",
    });
  }
};

const deletePostComment = async (req, res) => {
  const { postID, commentID } = await req.params;
  const deletedComment = await Comment.findOneAndRemove({ _id: commentID });
  if (deletedComment) {
    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      {
        $pull: { comments: commentID },
      },
      { new: true }
    );
    if (updatedPost) {
      res.status(200).json({ success: true, updatedPost, deletedComment });
    } else {
      res.status(500).json({
        success: false,
        msg: "Unable to delete the comment, please try again later.",
      });
    }
  } else {
    res.status(500).json({
      success: false,
      msg: "Unable to delete the comment, please try again later.",
    });
  }
};

const updatePostComment = async (req, res) => {
  const { commentID } = await req.params;
  const { comment } = await req.body;
  if (!comment) {
    throw new BadRequestError(
      "Please provide all the necessary information for the comment."
    );
  }
  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentID },
    { comment },
    { new: true, runValidators: true }
  );
  if (updatedComment) {
    res.status(200).json({ success: true, updatedComment });
  } else {
    res.status(500).json({
      success: false,
      msg: "Unable to update the comment, please try again later.",
    });
  }
};

const likePostComment = async (req, res) => {
  const { commentID } = await req.params;
  const { userID } = await req.body.user;
  if (!userID) {
    throw new BadRequestError(
      "Please provide all the necessary information for the comment."
    );
  }

  const comment = await Comment.findOne({ _id: commentID });

  if (!comment) {
    throw new NotFoundError("No comment found with the given comment ID.");
  }

  const likes = comment.likes.map((like) => like.userID.toString());

  if (likes.includes(userID)) {
    throw new BadRequestError("You have already liked the comment.");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentID,
    {
      $push: { likes: { userID } },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (updatedComment) {
    res.status(200).json({ success: true, updatedComment });
  } else {
    res.status(500).json({
      success: false,
      msg: "Unable to like the comment, please try again later.",
    });
  }
};

const unlikePostComment = async (req, res) => {
  const { commentID } = await req.params;
  const { userID } = await req.body.user;
  if (!userID) {
    throw new BadRequestError(
      "Please provide all the necessary information for the comment."
    );
  }

  const comment = await Comment.findOne({ _id: commentID });

  if (!comment) {
    throw new NotFoundError("No comment found with the given comment ID.");
  }

  const likes = comment.likes.map((like) => like.userID.toString());

  if (!likes.includes(userID)) {
    throw new BadRequestError("You have not already liked the comment.");
  }

  const updatedComment = await Comment.findOneAndUpdate(
    {
      _id: commentID,
      likes: {
        $elemMatch: {
          userID,
        },
      },
    },
    {
      $pull: {
        likes: {
          userID,
        },
      },
    },
    {
      new: true,
    }
  );
  if (updatedComment) {
    res.status(200).json({ success: true, updatedComment });
  } else {
    res.status(500).json({
      success: false,
      msg: "Unable to unlike the comment, please try again later.",
    });
  }
};

module.exports = {
  getPosts,
  getPost,
  getTotalPages,
  deletePost,
  addPost,
  updatePostContent,
  addPostComment,
  deletePostComment,
  updatePostComment,
  likePostComment,
  unlikePostComment,
  likePost,
  unlikePost,
  getComment,
  getAllPostComments,
};
