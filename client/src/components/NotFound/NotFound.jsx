import React, { useContext } from "react";
import styles from "./NotFound.module.css";
import { ThemeContext } from "../../ThemeContext";
import { useNavigate } from "react-router-dom";
import notFoundImage from "../../404_image.png";

const NotFound = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={styles.notFoundPage}
      style={{
        backgroundColor: theme.body,
        color: theme.text,
      }}
    >
      <div className={styles.container}>
        <img src={notFoundImage} alt="404 image" />
        <h1> Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <button
          className={styles.button}
          onClick={() => {
            navigate("/", { replace: true });
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
