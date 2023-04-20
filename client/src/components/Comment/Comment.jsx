import React, { useEffect, useContext, useState } from "react";
import { selectCurrentUser } from "../../app/features/userSlice";
import { useSelector } from "react-redux";
import styles from "./Comment.module.css";
import {
  useGetTokenQuery,
  useLazyGetUserInfoQuery,
} from "../../app/api/authApiSlice";
import {
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "../../app/api/postsApiSlice";
import { ThemeContext } from "../../ThemeContext";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FiEdit } from "react-icons/fi";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";

const Comment = ({ comment }) => {
  const { data: antiCsrfToken } = useGetTokenQuery();

  const currentUser = useSelector(selectCurrentUser);

  const { theme } = useContext(ThemeContext);

  const [commentLiked, setCommentLiked] = useState(false);

  const [editedComment, setEditedComment] = useState(comment.comment);

  const [selfAuthor, setSelfAuthor] = useState(false);

  const [commentEditing, setCommentEditing] = useState(false);

  const navigate = useNavigate();

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  const [
    getUserInfo,
    { data: userInfo, isLoading: userInfoLoading, isSuccess: userInfoSuccess },
  ] = useLazyGetUserInfoQuery();

  const [likeComment, { isLoading: likeCommentLoading }] =
    useLikeCommentMutation();

  const [unlikeComment, { isLoading: unlikeCommentLoading }] =
    useUnlikeCommentMutation();

  const [deleteComment, { isLoading: deleteCommentLoading }] =
    useDeleteCommentMutation();

  const [updateComment, { isLoading: updateCommentLoading }] =
    useUpdateCommentMutation();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    getUserInfo(comment.commenterID);
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.user) {
      setCommentLiked(
        comment.likes.some((like) => like.userID === currentUser.user.userID)
      );
      setSelfAuthor(currentUser.user.userID === comment.commenterID);
    }
  }, [currentUser, comment]);

  return (
    <>
      {(userInfoLoading ||
        likeCommentLoading ||
        unlikeCommentLoading ||
        deleteCommentLoading ||
        updateCommentLoading) && (
        <CircularProgress
          sx={{
            position: "absolute",
            zIndex: "20",
            top: "50%",
            left: "50%",
          }}
        />
      )}
      {userInfo && (
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
          <div className={styles.commentSection}>
            {commentEditing ? (
              <input
                type="text"
                value={editedComment}
                onChange={(event) => {
                  setEditedComment(event.target.value);
                }}
                className={styles.bodyInput}
              />
            ) : (
              <p className={styles.body}>{comment.comment}</p>
            )}
            {selfAuthor && (
              <div className={styles.editButtons}>
                {commentEditing ? (
                  <button
                    className={styles.updateButton}
                    onClick={() => {
                      if (editedComment.length > 0) {
                        updateComment({
                          postID: comment.postID,
                          commentID: comment._id,
                          updatedComment: editedComment,
                          antiCsrfToken: antiCsrfToken.token,
                        });
                      }
                      setCommentEditing((prevVal) => !prevVal);
                    }}
                  >
                    Update
                  </button>
                ) : (
                  <FiEdit
                    style={{ cursor: "pointer", margin: "0 10px" }}
                    size="25px"
                    onClick={() => {
                      setCommentEditing((prevVal) => !prevVal);
                    }}
                  />
                )}
                {commentEditing ? (
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      setCommentEditing((prevVal) => !prevVal);
                      setEditedComment(comment.comment);
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

            <Dialog
              open={dialogOpen}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">
                {"Delete Comment?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this comment?
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
                    deleteComment({
                      postID: comment.postID,
                      commentID: comment._id,
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
            <div className={styles.likeSection}>
              {commentLiked ? (
                <FavoriteIcon
                  onClick={() => {
                    if (currentUser && currentUser.user) {
                      unlikeComment({
                        antiCsrfToken: antiCsrfToken.token,
                        postID: comment.postID,
                        commentID: comment._id,
                      });
                    } else {
                      navigate(`/login`, { replace: true });
                    }
                  }}
                  fontSize="medium"
                  sx={{
                    color: "red",
                  }}
                />
              ) : (
                <FavoriteBorderIcon
                  onClick={() => {
                    if (currentUser && currentUser.user) {
                      likeComment({
                        antiCsrfToken: antiCsrfToken.token,
                        postID: comment.postID,
                        commentID: comment._id,
                      });
                    } else {
                      navigate(`/login`, { replace: true });
                    }
                  }}
                  fontSize="medium"
                  color={theme.text}
                />
              )}
              <p>{comment.likes.length}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
