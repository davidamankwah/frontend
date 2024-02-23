import { createSlice } from "@reduxjs/toolkit";

// Initial state for the chats slice of the Redux store
const initialState = {
  chats: [], // Add your chat-related state here
};

// Creating the chatsSlice using createSlice
export const chatsSlice = createSlice({
  name: "chats", // Name of the slice
  initialState, // Initial state
  reducers: {
    // Action to set the list of chats in the state
    setChats: (state, action) => {
      state.chats = action.payload.chats;
    },
    // Action to add a new chat to the state
    addChat: (state, action) => {
      state.chats.push(action.payload.chat);
    },
    // Action to update a specific chat in the state
    updateChat: (state, action) => {
      const updatedChats = state.chats.map((chat) => {
        if (chat.id === action.payload.chat.id) {
          return action.payload.chat;
        }
        return chat;
      });
      state.chats = updatedChats;
    },
  },
});

// Exporting specific actions from the chatsSlice
export const { setChats, addChat, updateChat } = chatsSlice.actions;

export default chatsSlice.reducer; // Exporting the chatsSlice reducer for use in the Redux store
