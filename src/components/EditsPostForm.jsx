import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../state';
import { Button, TextField, useTheme} from "@mui/material";

const EditsPostForm = ({ postId, currentText, onUpdate }) => {
  const [editedText, setEditedText] = useState(currentText);

  // Assuming you have the user's token stored in some way (e.g., Redux state)
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const dispatch = useDispatch();
  const { palette } = useTheme();


  const handleUpdate = async () => {
    try {
      // Make a PATCH request to update the post
      const response = await axios.patch(
        `https://server-tyt9.onrender.com/posts/${postId}`,
        { text: editedText, userId: loggedInUserId }, // Include userId in the request body
        {
          headers: {
            Authorization: `Bearep ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Assuming the server responds with the updated post
      const updatedPost = response.data;
      dispatch(setPost({ post: updatedPost }));

      // Notify the parent component about the update
      //onUpdate(updatedPost);

      // Clear the edited text
      setEditedText('');
    } catch (error) {
      console.error('Error updating post:', error.message);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <div>
      <TextField value={editedText} onChange={(e) => setEditedText(e.target.value)}/>
      <Button onClick={handleUpdate} sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}>Update Post</Button>
    </div>
  );
};

export default EditsPostForm;
