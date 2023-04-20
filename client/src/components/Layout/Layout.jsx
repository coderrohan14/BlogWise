import React, { useEffect, useContext } from "react";
import { useLoaderData, Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import styles from "./Layout.module.css";
import { useDispatch } from "react-redux";
import {
  useGetTokenQuery,
  useLazyGetUserInfoQuery,
} from "../../app/api/authApiSlice";
import { setUserInfo } from "../../app/features/userSlice";
import { ThemeContext } from "../../ThemeContext";

const Layout = () => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { data } = useGetTokenQuery();
  const [getUser, { data: userInfo, isLoading }] = useLazyGetUserInfoQuery();
  useEffect(() => {
    if (data && data.success) {
      getUser(data.user.userID);
    }
  }, [data]);
  useEffect(() => {
    if (userInfo) {
      dispatch(setUserInfo(userInfo));
    }
  }, [userInfo]);
  return (
    <div
      className={styles.layoutStyle}
      style={{ backgroundColor: theme.body, color: theme.text }}
    >
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
