import React, { useState } from 'react';
import { Box, Divider, IconButton, Typography } from "@mui/material";

const CommentReplies = ({ replies }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Box mt="0.5rem">
      <Divider />
      <IconButton onClick={toggleVisibility}>
        {isVisible ? (
          <Typography>Hide Replies</Typography>
        ) : (
          <Typography>Show Replies ({replies.length})</Typography>
        )}
      </IconButton>

      {isVisible && replies.map((reply, i) => (
        <Box key={i}>
          <Divider />
          {/* Displaying each reply with a divider */}
          <Typography sx={{ color: '#ffffff', m: "0.5rem 0", pl: "1rem" }}>
            <strong>{reply.userName}: </strong>
            {reply.text}
          </Typography>
        </Box>
      ))}
      <Divider />
    </Box>
  );
};

export default CommentReplies;
