import React, { useContext, useState, useEffect } from "react";
import styles from "./RegisterPage.module.css";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useRegisterMutation } from "../../app/api/authApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const googleUrl = `${process.env.REACT_APP_SERVER_URL}/auth/google`;
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerUser, { isLoading, isError, data, isSuccess, error }] =
    useRegisterMutation();
  useEffect(() => {
    if (isError) {
      if (error.data.err) {
        toast.error(error.data.err.msg);
      } else if (error.data.msg) {
        toast.error(error.data.msg);
      } else {
        toast.error("Some error occured, please try again.");
      }
    }
  }, [isError]);
  if (isSuccess) {
    navigate("/verifyEmail", { replace: true });
    window.location.reload(true);
  }
  return (
    <div
      className={styles.registerPage}
      style={{
        backgroundColor: theme.body,
      }}
    >
      <form
        className={styles.registerForm}
        style={{
          backgroundColor: theme.formBackground,
          color: theme.text,
        }}
        onSubmit={(event) => {
          event.preventDefault();
          registerUser({ name, email, password });
        }}
      >
        <ToastContainer
          style={{ color: "red", position: "absolute", top: "10%" }}
        />
        <h1>Sign Up</h1>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={isLoading}
        />

        <button
          className={styles.signUpButton}
          type="submit"
          style={{ pointerEvents: isLoading ? "none" : "auto" }}
        >
          {isLoading && (
            <CircularProgress
              size={25}
              sx={{ margin: "0 20px 0 0", color: "#F5F5F5" }}
            />
          )}
          Sign Up
        </button>
        <p>
          Already have an account?{" "}
          <span
            className={styles.signIn}
            onClick={() => {
              navigate("/login", { replace: true });
            }}
            style={{ pointerEvents: isLoading ? "none" : "auto" }}
          >
            Sign In
          </span>
        </p>
        <div
          className={styles.divider}
          style={{
            borderColor: theme.text,
            pointerEvents: isLoading ? "none" : "auto",
          }}
        ></div>
        <a className={styles.googleButton} href={googleUrl}>
          <FcGoogle size="30px" />
          <p>Continue with google</p>
        </a>
      </form>
    </div>
  );
};

export default RegisterPage;
