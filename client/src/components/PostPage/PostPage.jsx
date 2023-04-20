import React, { useContext, useState, useEffect } from "react";
import {
  useGetTokenQuery,
  useLazyGetUserInfoQuery,
} from "../../app/api/authApiSlice";
import {
  useLazyGetPostQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useLazyGetAllPostCommentsQuery,
  useAddCommentMutation,
  useUpdatePostContentMutation,
  useDeletePostMutation,
} from "../../app/api/postsApiSlice";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext";
import styles from "./PostPage.module.css";
import { selectCurrentUser } from "../../app/features/userSlice";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { BiComment } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import Comment from "../Comment/Comment";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";

const PostPage = () => {
  const { data: antiCsrfToken } = useGetTokenQuery();

  const navigate = useNavigate();

  const { postID } = useParams();

  const { theme } = useContext(ThemeContext);

  const [
    getPost,
    { data: postData, isLoading: postDataLoading, isSuccess: postDataSuccess },
  ] = useLazyGetPostQuery();

  const [
    getPostComments,
    {
      data: postComments,
      isLoading: postCommentsLoading,
      isSuccess: postCommentsSuccess,
    },
  ] = useLazyGetAllPostCommentsQuery();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 480px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const [getUserInfo, { data: userInfo, isLoading: userInfoLoading }] =
    useLazyGetUserInfoQuery();

  const [
    likePost,
    { isSuccess: postLikeSuccessful, isLoading: likePostLoading },
  ] = useLikePostMutation();

  const [
    addComment,
    { isLoading: addCommentLoading, isSuccess: addCommentSuccess },
  ] = useAddCommentMutation();

  const [
    updatePostContent,
    { isSuccess: updatePostContentSuccess, isLoading: updateCommentLoading },
  ] = useUpdatePostContentMutation();

  const [
    deletePost,
    {
      isSuccess: deletePostSuccess,
      isLoading: deletePostLoading,
      data: deletePostData,
    },
  ] = useDeletePostMutation();

  const [
    unlikePost,
    { isSuccess: postUnlikeSuccessful, isLoading: unlikePostLoading },
  ] = useUnlikePostMutation();

  const currentUser = useSelector(selectCurrentUser);

  const [postLiked, setPostLiked] = useState(false);

  const [comment, setComment] = useState("");

  const [timeAgo, setTimeAgo] = useState("");

  const [postEditing, setPostEditing] = useState(false);

  const [title, setTitle] = useState("");

  const [body, setBody] = useState("");

  const [selfAuthor, setSelfAuthor] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    getPost({ postID });
  }, [
    postLikeSuccessful,
    postUnlikeSuccessful,
    addCommentSuccess,
    updatePostContentSuccess,
  ]);

  useEffect(() => {
    if (postData && postData.post) {
      getUserInfo(postData.post.userID);
      getPostComments({ postID: postData.post._id });
      const currTimeAgo = formatDistanceToNow(
        new Date(postData.post.createdAt.toString()),
        {
          addSuffix: true,
        }
      );
      setTimeAgo(currTimeAgo);
      setTitle(postData.post.title);
      setBody(postData.post.body);
    }
  }, [postData]);

  useEffect(() => {
    if (currentUser && currentUser.user && postData && postData.post) {
      setSelfAuthor(currentUser.user.userID === postData.post.userID);
      setPostLiked(
        postData.post.likes.some(
          (like) => like.userID === currentUser.user.userID
        )
      );
    }
  }, [currentUser, postData]);

  useEffect(() => {
    if (deletePostSuccess && deletePostData.success) {
      navigate("/", { replace: true });
    }
  }, [deletePostSuccess]);

  return (
    <div
      className={styles.postPage}
      style={{ backgroundColor: theme.body, color: theme.text }}
    >
      {(postDataLoading ||
        postCommentsLoading ||
        userInfoLoading ||
        likePostLoading ||
        addCommentLoading ||
        updateCommentLoading ||
        deletePostLoading ||
        unlikePostLoading) && (
        <CircularProgress
          sx={{
            position: "absolute",
            zIndex: "20",
            top: "50%",
            left: "50%",
          }}
        />
      )}
      {postData &&
        postData.post &&
        userInfo &&
        userInfo.user &&
        postComments &&
        postComments.comments && (
          <div
            className={styles.postCard}
            style={{
              backgroundColor: theme.formBackground,
              color: theme.text,
            }}
          >
            <div className={styles.userSection}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={userInfo.user.picture}
                  alt="Profile Image"
                  className={styles.profileImage}
                />
                <div className={styles.userDetails}>
                  <h4>{userInfo.user.name}</h4>
                  <p>{userInfo.user.email}</p>
                </div>
              </div>
              <div className={styles.timeAgo}>~ {timeAgo}</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {postEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                  className={styles.titleInput}
                />
              ) : (
                <h2 className={styles.title}>{postData.post.title}</h2>
              )}
              {selfAuthor && (
                <div className={styles.editButtons}>
                  {postEditing ? (
                    <button
                      className={styles.updateButton}
                      onClick={() => {
                        const updateBody = {};
                        if (title.length > 0) updateBody.title = title;
                        if (body.length > 0) updateBody.body = body;
                        updatePostContent({
                          postID: postData.post._id,
                          updateBody,
                          antiCsrfToken: antiCsrfToken.token,
                        });
                        setPostEditing((prevVal) => !prevVal);
                      }}
                    >
                      Update
                    </button>
                  ) : (
                    <FiEdit
                      style={{ cursor: "pointer", margin: "0 10px" }}
                      size="30px"
                      onClick={() => {
                        setPostEditing((prevVal) => !prevVal);
                      }}
                    />
                  )}
                  {postEditing ? (
                    <button
                      className={styles.deleteButton}
                      onClick={() => {
                        setPostEditing((prevVal) => !prevVal);
                        setTitle(postData.post.title);
                        setBody(postData.post.body);
                      }}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      className={styles.deleteButton}
                      onClick={handleClickOpen}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
            <Dialog
              open={dialogOpen}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">
                {"Delete Post?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this post?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  sx={{ color: "red" }}
                  onClick={() => {
                    // handle post delete
                    deletePost({
                      postID: postData.post._id,
                      antiCsrfToken: antiCsrfToken.token,
                    });
                    handleClose();
                  }}
                  autoFocus
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
            {postEditing ? (
              <input
                type="text"
                value={body}
                onChange={(event) => {
                  setBody(event.target.value);
                }}
                className={styles.bodyInput}
              />
            ) : (
              <p className={styles.body}>{postData.post.body}</p>
            )}
            <div className={styles.userReactions}>
              <div className={styles.likeSection}>
                {postLiked ? (
                  <FavoriteIcon
                    onClick={() => {
                      if (currentUser && currentUser.user) {
                        unlikePost({
                          antiCsrfToken: antiCsrfToken.token,
                          postID: postData.post._id,
                        });
                      } else {
                        navigate(`/login`, { replace: true });
                      }
                    }}
                    fontSize="large"
                    sx={{
                      color: "red",
                    }}
                  />
                ) : (
                  <FavoriteBorderIcon
                    onClick={() => {
                      if (currentUser && currentUser.user) {
                        likePost({
                          antiCsrfToken: antiCsrfToken.token,
                          postID: postData.post._id,
                        });
                      } else {
                        navigate(`/login`, { replace: true });
                      }
                    }}
                    fontSize="large"
                    color={theme.text}
                  />
                )}
                <p>{postData.post.likes.length}</p>
              </div>
              <div
                className={styles.commentSection}
                onClick={() => {
                  if (currentUser && currentUser.user) {
                    window.scrollTo({
                      top: document.documentElement.scrollHeight,
                      behavior: "smooth",
                    });
                  } else {
                    navigate(`/login`, { replace: true });
                  }
                }}
              >
                <BiComment size={30} color={theme.text} />
                <p>{postData.post.comments.length}</p>
              </div>
            </div>
            <div className={styles.divider}></div>
            <h2 className={styles.title}>Comments</h2>
            {postComments.comments.map((comment, index) => (
              <>
                <Comment key={comment._id} comment={comment} />
                <div className={styles.commentDivider}></div>
              </>
            ))}
            <div className={styles.addCommentSection}>
              <input
                onChange={(event) => setComment(event.target.value)}
                value={comment}
                placeholder="Add Comment"
                style={{
                  borderRadius: "5px",
                  borderColor: theme.text,
                  color: "#363537",
                }}
              />
              <button
                onClick={() => {
                  if (comment.length > 0 && !addCommentLoading) {
                    addComment({
                      antiCsrfToken: antiCsrfToken.token,
                      postID: postData.post._id,
                      comment,
                    });
                    setComment("");
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default PostPage;
