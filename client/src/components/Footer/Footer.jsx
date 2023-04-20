import React, { useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import styles from "./Footer.module.css";

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();
  return (
    <div
      className={styles.footer}
      style={{
        backgroundColor: theme.navBar,
        color: theme.text,
        boxShadow: `0 -2px ${theme.shadow}`,
      }}
    >
      <p>Copyright © {currentYear} Rohan Pradhan.</p>
    </div>
  );
};

export default Footer;
