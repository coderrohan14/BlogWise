import React, { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import "react-toastify/dist/ReactToastify.css";
import { useForgotPasswordMutation } from "../../app/api/authApiSlice";
import { ThemeContext } from "../../ThemeContext";
import styles from "./ForgotPassword.module.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [
    forgotPassword,
    {
      isSuccess: isForgotPasswordSuccess,
      isLoading: isForgotPasswordLoading,
      isError: isForgotPasswordError,
      data: forgotPasswordResponse,
      error: forgotPasswordError,
    },
  ] = useForgotPasswordMutation();

  useEffect(() => {
    if (isForgotPasswordError) {
      if (forgotPasswordError.data.err) {
        toast.error(forgotPasswordError.data.err.msg);
      } else if (forgotPasswordError.data.msg) {
        toast.error(forgotPasswordError.data.msg);
      } else {
        toast.error("Some error occured, please try again.");
      }
    }
  }, [isForgotPasswordError]);

  if (isForgotPasswordSuccess) {
    navigate("/checkMail", { replace: true });
  }

  return (
    <div
      className={styles.forgotPasswordPage}
      style={{
        backgroundColor: theme.body,
      }}
    >
      <form
        className={styles.forgotPasswordForm}
        style={{
          backgroundColor: theme.formBackground,
          color: theme.text,
        }}
        onSubmit={(event) => {
          event.preventDefault();
          if (email && confirmEmail && email === confirmEmail) {
            forgotPassword({ email });
          } else {
            toast.error("Passwords don't match.");
          }
        }}
      >
        <ToastContainer
          style={{ color: "red", position: "absolute", top: "10%" }}
        />
        <h1>Forgot Password?</h1>
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
          type="text"
          id="confirmEmail"
          name="confirmEmail"
          placeholder="Confirm Email"
          value={confirmEmail}
          onChange={(event) => setConfirmEmail(event.target.value)}
          required
        />

        <button
          className={styles.resetPasswordButton}
          type="submit"
          style={{ pointerEvents: isForgotPasswordLoading ? "none" : "auto" }}
        >
          {isForgotPasswordLoading && (
            <CircularProgress
              size={25}
              sx={{ margin: "0 20px 0 0", color: "#F5F5F5" }}
            />
          )}
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
