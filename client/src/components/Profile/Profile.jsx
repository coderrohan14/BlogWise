import React, { useState, useEffect, useContext } from "react";
import styles from "./Profile.module.css";
import {
  useGetTokenQuery,
  useLazyGetUserInfoQuery,
  useUpdateUserInfoMutation,
} from "../../app/api/authApiSlice";
import { selectCurrentUser } from "../../app/features/userSlice";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../ThemeContext";
import { formatDistanceToNow } from "date-fns";
import { FiEdit } from "react-icons/fi";

const Profile = () => {
  const currentUser = useSelector(selectCurrentUser);

  const { data: antiCsrfToken } = useGetTokenQuery();

  const { theme } = useContext(ThemeContext);

  const [createdAt, setCreatedAt] = useState("");

  const [nameEditing, setNameEditing] = useState(false);

  const [name, setName] = useState("");

  const [getUserInfo, { data: userInfo, isLoading: userInfoLoading }] =
    useLazyGetUserInfoQuery();

  const [updateUserInfo, { isSuccess: updateUserInfoSuccess }] =
    useUpdateUserInfoMutation();

  useEffect(() => {
    if (currentUser && currentUser.user) {
      getUserInfo(currentUser.user.userID);
    }
  }, [currentUser, updateUserInfoSuccess]);

  useEffect(() => {
    if (userInfo && userInfo.user) {
      setCreatedAt(
        formatDistanceToNow(new Date(userInfo.user.createdAt), {
          addSuffix: true,
        })
      );
      setName(userInfo.user.name);
    }
  }, [userInfo]);

  return (
    <>
      {userInfo && userInfo.user && (
        <div
          className={styles.userProfile}
          style={{ backgroundColor: theme.formBackground, color: theme.text }}
        >
          <div className={styles.profilePicContainer}>
            <img
              src={userInfo.user.picture}
              alt="Profile Picture"
              className={styles.profilePic}
            />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.nameSection}>
              {nameEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  className={styles.titleInput}
                  style={{ borderColor: theme.text }}
                />
              ) : (
                <h1 className={styles.name}>{userInfo.user.name}</h1>
              )}

              {nameEditing ? (
                <button
                  className={styles.updateButton}
                  onClick={() => {
                    // handle update
                    if (name.length > 0) {
                      updateUserInfo({
                        userID: currentUser.user.userID,
                        name,
                        antiCsrfToken: antiCsrfToken.token,
                      });
                    }
                    setNameEditing((prevVal) => !prevVal);
                  }}
                >
                  Update
                </button>
              ) : (
                <FiEdit
                  style={{ cursor: "pointer", margin: "0 10px" }}
                  size="30px"
                  onClick={() => {
                    setNameEditing((prevVal) => !prevVal);
                  }}
                />
              )}
              {nameEditing && (
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    setNameEditing((prevVal) => !prevVal);
                    setName(userInfo.user.name);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
            <p className={styles.email}>{userInfo.user.email}</p>
            <p className={styles.accountCreated}>~ joined {createdAt}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
