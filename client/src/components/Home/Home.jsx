import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../ThemeContext";
import styles from "./Home.module.css";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../app/features/userSlice";
import {
  useLazyGetAllPostsQuery,
  useLazyGetTotalPagesQuery,
  useAddPostMutation,
} from "../../app/api/postsApiSlice";
import PostCard from "../PostCard/PostCard";
import Pagination from "@mui/material/Pagination";
import { useGetTokenQuery } from "../../app/api/authApiSlice";
import { GoPlus } from "react-icons/go";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";

const Home = () => {
  const { data: antiCsrfToken } = useGetTokenQuery();
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

  const [addPost, { isSuccess: addPostSuccess, isLoading: addPostLoading }] =
    useAddPostMutation();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAllPosts({ page: currentPage });
    getTotalPages();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage, addPostSuccess]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const currentUser = useSelector(selectCurrentUser);

  const { theme } = useContext(ThemeContext);

  const [open, setOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTitle("");
    setNewBody("");
  };

  return (
    <div
      className={styles.home}
      style={{
        backgroundColor: theme.body,
        color: theme.color,
      }}
    >
      {(postsDataLoading || addPostLoading) && (
        <CircularProgress
          sx={{
            position: "absolute",
            zIndex: "20",
            top: "50%",
            left: "50%",
          }}
        />
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={newTitle}
            onChange={(event) => {
              setNewTitle(event.target.value);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="body"
            label="Body"
            type="text"
            fullWidth
            variant="standard"
            value={newBody}
            onChange={(event) => {
              setNewBody(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "red" }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              // add new post
              addPost({
                post: { title: newTitle, body: newBody },
                antiCsrfToken: antiCsrfToken.token,
              });
              handleClose();
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {postsDataSuccess &&
        postsData.posts.map((post) => <PostCard key={post._id} post={post} />)}
      <div className={styles.bottomButtons}>
        {pagesData && (
          <Pagination
            sx={{
              marginLeft: "10px",
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
            count={Number(pagesData.totalPages)}
            size={isMobile ? "small" : "medium"}
            color="primary"
            onChange={(event, page) => {
              setCurrentPage(page);
            }}
          />
        )}
        {currentUser.user && (
          <button className={styles.addButton} onClick={handleClickOpen}>
            <GoPlus
              size={isMobile ? "16px" : "25px"}
              style={{ marginRight: "10px" }}
            />
            New Post
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
