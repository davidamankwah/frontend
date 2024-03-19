import {ChatBubbleOutlineOutlined,FavoriteBorderOutlined,FavoriteOutlined, DeleteOutlined, EditOutlined, ThumbDownOutlined,ThumbDownAltOutlined} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, Button, TextField } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Follower from "../../components/Follower";
import StyledWrapper from "../../components/Wrapper";
import CommentReplies from "../../components/CommentReplies";
import { useState, useEffect  } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditsPostForm from "../../components/EditsPostForm";
import { setPost } from "../../state";
import io from 'socket.io-client'; // Import Socket.IO client
  
  const PostWidget = ({
    postId,
    postUserId,
    name,
    text,
    picturePath,
    profileImage,
    likes,
    dislikes,
    comments,
  }) => {

    // State to manage the display of comments
    const [commentText, setCommentText] = useState('');
    const [isComments, setIsComments] = useState(false);
    const [isReplying, setIsReplying] = useState(false); // Added state for replying
    const [isUpdating, setIsUpdating] = useState(false);
    // Get the userName from your Redux state or wherever it's stored
    const names = useSelector((state) => state.user.userName);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = likes && Boolean(likes[loggedInUserId]);
    const isDisliked = dislikes && Boolean(dislikes[loggedInUserId]);
    const likeCount = likes ? Object.keys(likes).length : 0;
    const dislikeCount = dislikes ? Object.keys(dislikes).length : 0;
    
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    // Socket.IO connection
   const socket = io('https://server-tyt9.onrender.com'); 

    // Listen for notifications from the server
    useEffect(() => {
      socket.on("notification", (data) => {
        console.log('Notification:', data.message);
         alert(data.message); 
      });
    
      return () => {
        socket.disconnect();
      };
    });
    
// Function to handle liking or unliking a post
const patchLike = async () => {
  try {
    // Sending a PATCH request to update like status
    const response = await fetch(`https://server-tyt9.onrender.com/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Permitted: `Bearer ${token}`, // Including the bearer token for authentication
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });

    if (response.ok) {
      // Updating the Redux state with the updated post
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));

      // Emit a socket event to notify users of the like action
      socket.emit('like', { postId, userId: loggedInUserId, userName: names });

      // Optionally, you can also handle the notification here on the client-side
      console.log('Liked post:', postId);
      
    } else {
      console.error("Failed to update like status");
    }
  } catch (error) {
    console.error("Error in patchLike:", error);
  }
};


    // Function to handle disliking or undisliking a post
  const patchDislike = async () => {
    try {
       // Log the postId before making the request
      console.log('Disliking post with postId:', postId);
      const response = await fetch(`https://server-tyt9.onrender.com/posts/${postId}/dislike`, {
        method: "PATCH",
        headers: {
          Permitted: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
  
      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
      
      } else {
        if (response.status === 404) {
          console.error("Post not found:", postId);
        } else {
          console.error("Failed to patch dislike. Server response:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error in patchDislike:", error);
    }
};

    // Function to handle post deletion
  const handleDelete = async () => {
    // Sending a DELETE request to delete the post
    const response = await fetch(
      `https://server-tyt9.onrender.com/posts/${postId}`,
      {
        method: "DELETE",
        headers: {
          Permitted: `Bearer ${token}`, // Including the bearer token for authentication
        },
      }
    );

    if (response.ok) {
      // Updating the Redux state to remove the deleted post
      dispatch(setPost({ post: null }));
    } else {
      // Handle error if the delete request fails
      console.error("Failed to delete post");
    }
  };

   // Function to handle post editing
   const handleEdit = () => {
    setIsUpdating(true);
  };
  
 
  // Function to handle comment submission
const handleCommentSubmit = async () => {
  // Send a POST request to add a comment
  const response = await fetch(`https://server-tyt9.onrender.com/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearep ${token}`, 
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: loggedInUserId, userName: names, text: commentText }),
  });

  if (response.ok) {
    // Update the Redux state with the updated post
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));

    // Clear the comment text and close the comment form
    setCommentText('');
    setIsComments(false);
  } else {
    // Handle error if the comment request fails
    console.error("Failed to add comment");
  }
};

const handleReplySubmit = async (commentId) => {
  try {
    const response = await fetch(`https://server-tyt9.onrender.com/posts/${postId}/comments/${commentId}/replies`, {
      method: 'POST',
      headers: {
        Authorization: `Bearep ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: loggedInUserId,
        userName: names,
        text: commentText,
      }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));

      // Clear the comment text
      setCommentText('');
    } else {
      console.error('Failed to add reply. Server response:', response.statusText);
    }
  } catch (error) {
    console.error('Error in handleReplySubmit:', error);
  }
};

// In your React component
const handleDeleteComment = async (postId, commentId) => {
  try {
    const response = await fetch(`https://server-tyt9.onrender.com/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearep ${token}`,
      },
    });

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      // Optionally, you can update the local state to reflect the deletion immediately
    } else {
      console.error('Failed to delete comment:', response.statusText);
    }
  } catch (error) {
    console.error('Error in handleDeleteComment:', error);
  }
};


    return (
      <StyledWrapper m="2rem 0">
        {/* Displaying the user who made the post */}
        <Follower
          followerId={postUserId}
          name={name}
          profileImage={profileImage}
        />
        {/* Displaying the post text */}
        <Typography color={main} sx={{ mt: "1rem" }}>
          {text}
        </Typography>
      {/* Displaying the post media if available */}
{picturePath && (
  <div style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}>
    {picturePath.endsWith('.mp4') ? (
      <video width="100%" height="auto" controls>
        <source src={`https://server-tyt9.onrender.com/assets/${picturePath}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <img
        width="100%"
        height="auto"
        alt="post"
        src={`https://server-tyt9.onrender.com/assets/${picturePath}`}
      />
    )}
  </div>
)}
        {/* Section for like and comment */}
        <FlexBetween mt="0.25rem">
          {/* Section for like and comment counts */}
          <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
  <IconButton onClick={patchLike}>
    {isLiked ? (
      <FavoriteOutlined sx={{ color: '#ff4081' }} />
    ) : (
      <FavoriteBorderOutlined />
    )}
  </IconButton>
  <Typography>{likeCount}</Typography>
  <IconButton onClick={patchDislike}>
    {isDisliked ? (
      <ThumbDownOutlined sx={{ color: '#000000' }} />
    ) : (
      <ThumbDownAltOutlined />
    )}
      </IconButton>
      <Typography>{dislikeCount}</Typography>
     </FlexBetween>
             {/* Comment button and count */}
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>

          {/* Displaying comments if the comments section is open */}
        </FlexBetween>
        {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              {/* Displaying each comment with a divider */}
              <Typography sx={{ color: '#ffffff', m: "0.5rem 0", pl: "1rem" }}>
                <strong>{comment.userName}: </strong>
                {comment.text}
              {loggedInUserId === comment.userId && (
              <IconButton onClick={() => handleDeleteComment(postId, comment._id)} sx={{ color: '#f44336' }}>
              <DeleteOutlined />
             </IconButton>
              )}
              </Typography>

          {/* Allow users to reply to comments */}
         <Box>
        <Button onClick={() => setIsReplying(!isReplying)}  
        sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}>
          {isReplying ? 'Cancel Reply' : 'Add Reply'}
        </Button>

        {/* Display textarea and Submit Reply button when replying */}
        {isReplying && (
          <Box>
            <TextField
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Type your reply..."
            />
            <Button onClick={() => handleReplySubmit(comment._id)}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}>
              Submit Reply
            </Button>
          </Box>
        )}

        {/* Display replies for each comment */}
        {comment.replies && comment.replies.length > 0 && (
          <CommentReplies replies={comment.replies} />
        )}
      </Box>
    </Box>
  ))}
          <Divider />
        </Box>
      )}

        {/* Delete button */}
      {loggedInUserId === postUserId && (
        <IconButton onClick={handleDelete} sx={{ color: "#f44336" }}>
          <DeleteOutlined />
        </IconButton>
      )}

       {/* Edit button */}
      {loggedInUserId === postUserId && (
        <IconButton onClick={handleEdit} sx={{ color: "blue" }}>
          <EditOutlined />
        </IconButton>
      )}

      {/* Displaying the EditPostForm if updating is true */}
      {isUpdating && (
        <EditsPostForm
          postId={postId}
          currentText={text}
          onCancel={() => setIsUpdating(false)}
        />
      )}
      {/* Display the comment form if isCommenting is true */}
      {isComments && (
        <Box>
          <TextField
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type your comment..."
          />
          <Button onClick={handleCommentSubmit}  sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}>Submit Comment</Button>
        </Box>
      )}
      </StyledWrapper>
    );
  };
  // Exporting the PostWidget component for use in other parts of the application
  export default PostWidget;