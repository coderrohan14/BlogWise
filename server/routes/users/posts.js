const express = require("express");
const router = express.Router();
const {
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
} = require("../../controllers/users/posts");
const authMiddleware = require("../../middlewares/authentication");
const csrfAuthMiddleware = require("../../middlewares/csrfAuthMiddleware");

// post specific routes

router.get("/", getPosts);

router.get("/getTotalPages", getTotalPages);

router.get("/:postID", getPost);

router.delete("/:postID", authMiddleware, csrfAuthMiddleware, deletePost);

router.post("/", authMiddleware, csrfAuthMiddleware, addPost);

router.patch("/:postID", authMiddleware, csrfAuthMiddleware, updatePostContent);

router.patch("/:postID/like", authMiddleware, csrfAuthMiddleware, likePost);

router.patch("/:postID/unlike", authMiddleware, csrfAuthMiddleware, unlikePost);

// post comments routes

router.get("/:postID/comments", getAllPostComments);

router.post(
  "/:postID/comments",
  authMiddleware,
  csrfAuthMiddleware,
  addPostComment
);

router.get("/:postID/comments/:commentID", getComment);

router.delete(
  "/:postID/comments/:commentID",
  authMiddleware,
  csrfAuthMiddleware,
  deletePostComment
);

router.patch(
  "/:postID/comments/:commentID",
  authMiddleware,
  csrfAuthMiddleware,
  updatePostComment
);

router.patch(
  "/:postID/comments/:commentID/like",
  authMiddleware,
  csrfAuthMiddleware,
  likePostComment
);

router.patch(
  "/:postID/comments/:commentID/unlike",
  authMiddleware,
  csrfAuthMiddleware,
  unlikePostComment
);

module.exports = router;
