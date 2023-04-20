import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../ThemeContext";
import styles from "./MyPosts.module.css";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../app/features/userSlice";
import {
  useLazyGetAllPostsQuery,
  useLazyGetTotalPagesQuery,
} from "../../app/api/postsApiSlice";
import PostCard from "../PostCard/PostCard";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";

const MyPosts = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [
    getAllPosts,
    {
      data: postsData,
      isLoading: postsDataLoading,
      isSuccess: postsDataSuccess,
    },
  ] = useLazyGetAllPostsQuery();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 480px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const [getTotalPages, { data: pagesData, isLoading: pagesDataLoading }] =
    useLazyGetTotalPagesQuery();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (currentUser.user) {
      getAllPosts({ page: currentPage, userID: currentUser.user.userID });
    }
    getTotalPages();
  }, [currentPage, currentUser]);

  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={styles.home}
      style={{
        backgroundColor: theme.body,
        color: theme.color,
      }}
    >
      {postsDataLoading && (
        <CircularProgress
          sx={{
            position: "absolute",
            zIndex: "20",
            top: "50%",
            left: "50%",
          }}
        />
      )}
      <h2 style={{ color: theme.text }}>My Posts</h2>
      {postsDataSuccess &&
        postsData.posts.map((post) => <PostCard key={post._id} post={post} />)}
      {postsDataSuccess && postsData.posts.length === 0 && (
        <h3>You haven't posted anything yet.</h3>
      )}
      {pagesData && (
        <div className={styles.paginationButton}>
          <Pagination
            sx={{
              width: "auto",
              zIndex: "10",
              padding: "10px",
              backgroundColor: "#F5F5F5",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.16)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              ":hover": {
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.16)",
                transform: "translateY(-2px)",
              },
            }}
            size={isMobile ? "small" : "medium"}
            count={Number(pagesData.totalPages)}
            color="primary"
            onChange={(event, page) => {
              setCurrentPage(page);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MyPosts;
