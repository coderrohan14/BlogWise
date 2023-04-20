import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postsApiSlice = createApi({
  reducerPath: "posts",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_URL}/posts`,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }),
  tagTypes: ["posts", "pages", "comments"],
  endpoints: (builder) => ({
    getAllPosts: builder.query({
      query: (args) => ({
        url: `/?page=${args.page}&userID=${args.userID ? args.userID : "null"}`,
        method: "GET",
      }),
      providesTags: ["posts"],
    }),
    getPost: builder.query({
      query: (args) => ({
        url: `/${args.postID}`,
        method: "GET",
      }),
    }),
    getTotalPages: builder.query({
      query: () => ({
        url: "/getTotalPages",
        method: "GET",
      }),
      providesTags: ["pages"],
    }),
    addPost: builder.mutation({
      query: (args) => ({
        url: "/",
        method: "POST",
        body: args.post,
        headers: {
          x_xsrf_token: args.antiCsrfToken.toString(),
        },
      }),
      invalidatesTags: ["posts"],
    }),
    deletePost: builder.mutation({
      query: (args) => ({
        url: `/${args.postID}`,
        method: "DELETE",
        headers: {
          x_xsrf_token: args.antiCsrfToken.toString(),
        },
      }),
      invalidatesTags: ["posts"],
    }),
    updatePostContent: builder.mutation({
      query: (args) => ({
        url: `/${args.postID}`,
        method: "PATCH",
        body: args.updateBody,
        headers: {
          x_xsrf_token: args.antiCsrfToken.toString(),
        },
      }),
      invalidatesTags: ["posts"],
    }),
    likePost: builder.mutation({
      query: (args) => ({
        url: `/${args.postID}/like`,
        method: "PATCH",
        headers: {
          x_xsrf_token: args.antiCsrfToken.toString(),
        },
      }),
      invalidatesTags: ["posts"],
    }),
    unlikePost: builder.mutation({
      query: (args) => ({
        url: `/${args.postID}/unlike`,
        method: "PATCH",
        headers: {
          x_xsrf_token: args.antiCsrfToken.toString(),
        },
      }),
      invalidatesTags: ["posts"],
    }),
    addComment: builder.mutation({
      query: (args) => ({
        url: `/${args.postID}/comments`,
        method: "POST",
        body: { comment: args.comment },
        headers: {
          x_xsrf_token: args.antiCsrfToken.toString(),
        },
      }),
      invalidatesTags: ["posts", "comments"],
    }),
    deleteComment: builder.mutation({
      query: (args) => ({
        url: `/${args.postID}/comments/${args.commentID}`,
        method: "DELETE",
        headers: {
          x_xsrf_token: args.antiCsrfToken.toString(),
        },
      }),
      invalidatesTags: ["posts", "comments"],
    }),
    updateComment: builder.mutation({
      query: (args) => ({
        url: `/${args.postID}/comments/${args.commentID}`,
        method: "PATCH",
        body: { comment: args.updatedComment },
        headers: {
          x_xsrf_token: args.antiCsrfToken.toString(),
        },
      }),
      invalidatesTags: ["comments"],
    }),
    likeComment: builder.mutation({
      query: (args) => ({
        url: `/${args.postID}/comments/${args.commentID}/like`,
        method: "PATCH",
        headers: {
          x_xsrf_token: args.antiCsrfToken.toString(),
        },
      }),
      invalidatesTags: ["comments"],
    }),
    unlikeComment: builder.mutation({
      query: (args) => ({
        url: `/${args.postID}/comments/${args.commentID}/unlike`,
        method: "PATCH",
        headers: {
          x_xsrf_token: args.antiCsrfToken.toString(),
        },
      }),
      invalidatesTags: ["comments"],
    }),
    getAllPostComments: builder.query({
      query: (args) => ({
        url: `/${args.postID}/comments`,
        method: "GET",
      }),
      providesTags: ["comments"],
    }),
    getComment: builder.query({
      query: (args) => ({
        url: `/${args.postID}/comments/${args.commentID}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLazyGetAllPostsQuery,
  useLazyGetPostQuery,
  useLazyGetTotalPagesQuery,
  useAddPostMutation,
  useDeletePostMutation,
  useUpdatePostContentMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useLazyGetAllPostCommentsQuery,
  useLazyGetCommentQuery,
} = postsApiSlice;
