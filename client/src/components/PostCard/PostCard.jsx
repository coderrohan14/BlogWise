import React, { useContext, useEffect, useState } from "react";
import styles from "./PostCard.module.css";
import { ThemeContext } from "../../ThemeContext";
import {
  useGetTokenQuery,
  useLazyGetUserInfoQuery,
} from "../../app/api/authApiSlice";
import { BiComment } from "react-icons/bi";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { formatDistanceToNow } from "date-fns";
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../app/api/postsApiSlice";
import { selectCurrentUser } from "../../app/features/userSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const PostCard = ({ post }) => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { data: antiCsrfToken } = useGetTokenQuery();

  const { theme } = useContext(ThemeContext);

  const [postLiked, setPostLiked] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });
  const [getUserInfo, { data: userInfo, isLoading: userInfoLoading }] =
    useLazyGetUserInfoQuery();

  const [likePost, { isLoading: likeLoading }] = useLikePostMutation();

  const [unlikePost, { isLoading: unlikeLoading }] = useUnlikePostMutation();

  useEffect(() => {
    getUserInfo(post.userID);
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.user) {
      setPostLiked(
        post.likes.some((like) => like.userID === currentUser.user.userID)
      );
    }
  }, [currentUser, post]);

  return (
    <>
      {(userInfoLoading || likeLoading || unlikeLoading) && (
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
          <h2 className={styles.title}>{post.title}</h2>
          <p className={styles.body}>
            {post.body.slice(0, 320)}
            <span
              className={styles.readMore}
              onClick={() => {
                if (currentUser && currentUser.user) {
                  navigate(`/posts/${post._id}`);
                } else {
                  navigate(`/login`);
                }
              }}
            >
              Read More
            </span>
          </p>
          <div className={styles.userReactions}>
            <div className={styles.likeSection}>
              {postLiked ? (
                <FavoriteIcon
                  onClick={() => {
                    if (currentUser && currentUser.user) {
                      unlikePost({
                        antiCsrfToken: antiCsrfToken.token,
                        postID: post._id,
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
                        postID: post._id,
                      });
                    } else {
                      navigate(`/login`, { replace: true });
                    }
                  }}
                  fontSize="large"
                  color={theme.text}
                />
              )}
              <p>{post.likes.length}</p>
            </div>
            <div
              className={styles.commentSection}
              onClick={() => {
                if (currentUser && currentUser.user) {
                  navigate(`/posts/${post._id}`, { replace: true });
                } else {
                  navigate(`/login`, { replace: true });
                }
              }}
            >
              <BiComment size={30} color={theme.text} />
              <p>{post.comments.length}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
