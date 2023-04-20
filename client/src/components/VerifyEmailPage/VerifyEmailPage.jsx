import React, { useContext } from "react";
import styles from "./VerifyEmailPage.module.css";
import { ThemeContext } from "../../ThemeContext";

const VerifyEmailPage = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={styles.verifyEmailPage}
      style={{
        backgroundColor: theme.body,
        color: theme.text,
      }}
    >
      <h4>
        A verification email has been sent to the given email address, please
        check your inbox.
      </h4>
    </div>
  );
};

export default VerifyEmailPage;
