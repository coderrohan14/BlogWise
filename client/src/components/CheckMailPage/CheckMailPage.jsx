import React, { useContext } from "react";
import styles from "./CheckMailPage.module.css";
import { ThemeContext } from "../../ThemeContext";

const CheckMailPage = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={styles.checkMailPage}
      style={{
        backgroundColor: theme.body,
        color: theme.text,
      }}
    >
      <h4>
        An email with the further steps to reset your password has been sent to
        your email address, please check your inbox.
      </h4>
    </div>
  );
};

export default CheckMailPage;
