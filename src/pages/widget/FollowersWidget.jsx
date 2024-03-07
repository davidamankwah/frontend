import { Box, Typography, useTheme } from "@mui/material";
import Follower from "../../components/Follower";
import StyledWrapper from "../../components/Wrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFollowers } from "../../state";

const FollowersWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const followers = useSelector((state) => state.user.followers);

  // Function to fetch followers for the given user
  const getFollowers = async () => {
    const response = await fetch(
      `https://frontend-dnnx.onrender.com/users/${userId}/followers`,
      {
        method: "GET",
        headers: { Permitted: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFollowers({ followers: data }));
  };

  useEffect(() => {
    // Fetch followers when the component mounts
    getFollowers();
  }, []); 

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
          <Follower
            key={follower._id}
            followerId={follower._id}
            name={`${follower.userName}`}
            profileImage={follower.picturePath}
          />
        ))}
      </Box>
    </StyledWrapper>
  );
};

export default FollowersWidget;