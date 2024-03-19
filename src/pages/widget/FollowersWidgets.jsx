import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button } from "@mui/material";
import Follower from "../../components/Follower";
import StyledWrapper from "../../components/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { setFollowers } from "../../state";
import { useNavigate } from "react-router-dom";

const FollowersWidgets = ({ userId, onSelectReceiver }) => { // Pass onSelectReceiver as a prop
  const { palette } = useTheme();
  const [followers, setFollowers] = useState([]);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();



  // Function to fetch followers for the given user
  const getFollowers = async () => {
    const response = await fetch(
      `https://server-tyt9.onrender.com/users/${userId}/followers`,
      {
        method: "GET",
        headers: { Permitted: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setFollowers(data);
  };

  useEffect(() => {
    // Fetch followers when the component mounts
    getFollowers();
  }, []); 

  const handleSendMessage = (followerId) => {
    onSelectReceiver(followerId); // Call onSelectReceiver with the followerId when message button is clicked
    //navigate(`/chats/`);
  };

  const handleChatClick = () => {
    console.log('Navigating to chat');
    navigate(`/chats/`);
   };

  return (
    <StyledWrapper>
      {/* Display the title */}
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Following
      </Typography>

      {/* Display the list of followers */}
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {Array.isArray(followers) && followers.map((follower) => (
          <Box key={follower._id} display="flex" alignItems="center">
            <Follower
              followerId={follower._id}
              name={`${follower.userName}`}
              profileImage={follower.picturePath}
            />
            <Button variant="contained"  onClick={() => handleSendMessage(follower._id)} >Message</Button> {/* Add message button */}
          </Box>
        ))}
      </Box>
    </StyledWrapper>
  );
};

export default FollowersWidgets;
