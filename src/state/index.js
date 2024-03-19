import { createSlice } from "@reduxjs/toolkit"; // Importing createSlice from Redux Toolkit for simplified reducer creation

// Initial state for the authentication slice of the Redux store
const initialState = {
  user: null,
  token: null,
  posts: [],
  users: [], // Array of users
  notifications: [], // New state to store notifications
  messages: [],
};
// Creating the authSlice using createSlice
export const authSlice = createSlice({
  name: "auth", // Name of the slice
  initialState, // Initial state
  reducers: {
    // Action to set user login information
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    // Action to set user logout information
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
     // Action to update user followers information
    setFollowers: (state, action) => {
      if (state.user) {
        state.user.followers = action.payload.followers;
      } else {
        console.error("followers non-existent :(");
      }
    },
    // Action to set the array of posts in the state
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
     // Action to update a specific post in the state
     setPost: (state, action) => {
      if (action.payload.post && action.payload.post._id) {
        const updatedPosts = state.posts.map((post) => {
          if (post._id === action.payload.post._id) {
            return action.payload.post;
          }
          return post;
        });
        state.posts = updatedPosts;
      }
    },  
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

// Exporting specific actions from the authSlice
  export const {
    setLogin,
    setLogout,
    setFollowers,
    setPosts,
    setPost,
    setNotifications,
    setMessages,
  } = authSlice.actions;
  
export default authSlice.reducer; // Exporting the authSlice reducer for use in the Redux store