import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApiSlice = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_URL}/auth`,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginCredentials) => ({
        url: "/login",
        method: "POST",
        body: loginCredentials,
        credentials: "include",
      }),
    }),
    register: builder.mutation({
      query: (registerCredentials) => ({
        url: "/register",
        method: "POST",
        body: registerCredentials,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: (antiCsrfToken) => ({
        url: "/logout",
        method: "POST",
        headers: {
          x_xsrf_token: antiCsrfToken.toString(),
        },
        credentials: "include",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/forgotPassword",
        method: "POST",
        body: email,
        credentials: "include",
      }),
    }),
    getToken: builder.query({
      query: () => ({
        url: "/getToken",
        method: "GET",
        credentials: "include",
      }),
    }),
    getUserInfo: builder.query({
      query: (userID) => ({
        url: `/getUserInfo/${userID}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateUserInfo: builder.mutation({
      query: (args) => ({
        url: `/updateUserInfo/${args.userID}`,
        method: "PATCH",
        body: {
          name: args.name,
          picture: args.picture,
        },
        headers: {
          x_xsrf_token: args.antiCsrfToken.toString(),
        },
        credentials: "include",
      }),
    }),
  }),
  injectCredentials: true,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useGetTokenQuery,
  useLazyGetUserInfoQuery,
  useUpdateUserInfoMutation,
} = authApiSlice;
