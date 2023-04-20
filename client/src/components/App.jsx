import React from "react";
import Home from "./Home/Home";
import Layout from "./Layout/Layout";
import SignInPage from "./SingInPage/SignInPage";
import ForgotPassword from "./forgotPasswordPage/ForgotPassword";
import VerifyEmailPage from "./VerifyEmailPage/VerifyEmailPage";
import CheckMailPage from "./CheckMailPage/CheckMailPage";
import PostPage from "./PostPage/PostPage";
import NotFound from "./NotFound/NotFound";
import MyPosts from "./MyPosts/MyPosts";
import Profile from "./Profile/Profile";
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import RegisterPage from "./RegisterPage/RegisterPage";

const App = () => {
  const router = createHashRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "login",
            element: <SignInPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
          {
            path: "verifyEmail",
            element: <VerifyEmailPage />,
          },
          {
            path: "forgotPassword",
            element: <ForgotPassword />,
          },
          {
            path: "checkMail",
            element: <CheckMailPage />,
          },
          {
            path: "posts/:postID",
            Component: PostPage,
          },
          {
            path: "myPosts",
            element: <MyPosts />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ]
    // { basename: "/BlogWise-Client" }
  );

  return <RouterProvider router={router} />;
};

export default App;
