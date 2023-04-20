import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../../ThemeContext";
import styles from "./Navbar.module.css";
import ThemeSwitch from "../ThemeSwitch";
import { darkTheme } from "../../themes";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, setUserInfo } from "../../app/features/userSlice";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { FiLogOut } from "react-icons/fi";
import {
  useGetTokenQuery,
  useLogoutMutation,
  authApiSlice,
} from "../../app/api/authApiSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: antiCsrfToken, refetch } = useGetTokenQuery();
  const [
    logoutUser,
    {
      data: logoutResult,
      isSuccess: isLogoutSuccess,
      isError: isLogoutError,
      error: logoutError,
      isLoading: logoutLoading,
    },
  ] = useLogoutMutation();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    if (option === "profile") {
      if (currentUser.user && antiCsrfToken && antiCsrfToken.token) {
        navigate("/profile");
      }
    } else if (option === "posts") {
      if (currentUser.user && antiCsrfToken && antiCsrfToken.token) {
        navigate("/myPosts");
      }
    } else if (option === "logout") {
      if (antiCsrfToken && antiCsrfToken.token) {
        logoutUser(antiCsrfToken.token);
        navigate("/", { replace: true });
      }
    }
    setAnchorEl(null);
  };

  useEffect(() => {
    dispatch(setUserInfo({}));
  }, [isLogoutSuccess]);

  useEffect(() => {
    if (isLogoutError) {
      if (logoutError.data.err) {
        toast.error(logoutError.data.err.msg);
      } else {
        toast.error("Unable to logout, please try again.");
      }
    }
  }, [isLogoutError]);

  const currentUser = useSelector(selectCurrentUser);
  const { toggleTheme, theme } = useContext(ThemeContext);
  return (
    <>
      <ToastContainer
        style={{
          color: "red",
          position: "absolute",
          top: "10%",
        }}
      />
      <div
        className={styles.header}
        style={{
          backgroundColor: theme.navBar,
          color: theme.text,
          boxShadow: `0 2px ${theme.shadow}`,
        }}
      >
        {logoutLoading && (
          <CircularProgress
            sx={{
              position: "absolute",
              zIndex: "20",
              top: "50%",
              left: "50%",
            }}
          />
        )}
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/", { replace: true });
          }}
        >
          Blogwise
        </h1>
        <div className={styles.rightSection}>
          <ThemeSwitch
            sx={{ m: 1 }}
            onChange={toggleTheme}
            checked={theme === darkTheme}
          />
          {(!currentUser || !currentUser.user) && (
            <button
              onClick={() => {
                navigate("/login", { replace: true });
              }}
            >
              Sign In
            </button>
          )}
          {currentUser && currentUser.user && (
            <>
              <h3>Hello, {currentUser.user.name.split(" ")[0]}</h3>
              <Tooltip title="Account menu">
                <img
                  className={styles.profileImage}
                  style={{ borderColor: theme.text }}
                  src={currentUser.user.picture}
                  onClick={handleClick}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                />
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    backgroundColor: theme.formBackground,
                    color: theme.text,
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: theme.formBackground,
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <div
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                  }}
                  onClick={() => handleClose("profile")}
                >
                  Profile
                </div>
                <Divider sx={{ borderColor: theme.text }} />
                <div
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                  }}
                  onClick={() => handleClose("posts")}
                >
                  Posts
                </div>
                <Divider sx={{ borderColor: theme.text }} />
                <div
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => handleClose("logout")}
                >
                  <FiLogOut style={{ marginRight: "5px" }} />
                  Logout
                </div>
              </Menu>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
