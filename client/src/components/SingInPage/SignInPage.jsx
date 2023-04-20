import React, { useContext, useState, useEffect } from "react";
import styles from "./SignInPage.module.css";
import { ThemeContext } from "../../ThemeContext";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../app/api/authApiSlice";
import { ToastContainer, toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import "react-toastify/dist/ReactToastify.css";

const SignInPage = () => {
  const navigate = useNavigate();
  const googleUrl = `${process.env.REACT_APP_SERVER_URL}/auth/google`;
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [
    loginUser,
    {
      isSuccess: isLoginSuccess,
      isLoading: isLoginLoading,
      isError: isLoginError,
      data: loginResponse,
      error: loginError,
    },
  ] = useLoginMutation();

  useEffect(() => {
    if (isLoginError) {
      if (loginError.data.err) {
        toast.error(loginError.data.err.msg);
      } else if (loginError.data.msg) {
        toast.error(loginError.data.msg);
      } else {
        toast.error("Some error occured, please try again.");
      }
    }
  }, [isLoginError]);

  console.log(loginResponse);

  if (isLoginSuccess) {
    navigate("/", { replace: true });
    window.location.reload(true);
  }
  return (
    <div
      className={styles.signInPage}
      style={{
        backgroundColor: theme.body,
      }}
    >
      <form
        className={styles.signInForm}
        style={{
          backgroundColor: theme.formBackground,
          color: theme.text,
        }}
        onSubmit={(event) => {
          event.preventDefault();
          loginUser({ email, password });
        }}
      >
        <ToastContainer
          style={{
            color: "red",
            position: "absolute",
            top: "10%",
          }}
        />
        <h1>Sign In</h1>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <p
          className={styles.forgotPassword}
          onClick={() => {
            navigate("/forgotPassword", { replace: true });
          }}
        >
          Forgot Password
        </p>
        <button
          className={styles.loginButton}
          type="submit"
          style={{ pointerEvents: isLoginLoading ? "none" : "auto" }}
        >
          {isLoginLoading && (
            <CircularProgress
              size={25}
              sx={{ margin: "0 20px 0 0", color: "#F5F5F5" }}
            />
          )}
          Sign In
        </button>
        <p>
          Not registered yet?{" "}
          <span
            className={styles.createAccount}
            onClick={() => {
              navigate("/register", { replace: true });
            }}
          >
            Create an account
          </span>
        </p>
        <div
          className={styles.divider}
          style={{ borderColor: theme.text }}
        ></div>
        <a className={styles.googleButton} href={googleUrl}>
          <FcGoogle size="30px" />
          <p>Continue with google</p>
        </a>
      </form>
    </div>
  );
};

export default SignInPage;
