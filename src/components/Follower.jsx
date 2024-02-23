import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFollowers } from "../state";
import FlexBetween from "../components/FlexBetween";
import ProfileImage from "../components/ProfileImage";

// Importing necessary dependencies and components
const Follower = ({ followerId, name,profileImage }) => {
  // Redux hooks for dispatching actions and accessing state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const followers = useSelector((state) => state.user.followers);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;

  // Check if the user is already a follower
  const isFollower = Array.isArray(followers) && followers.find((follower) => follower._id === followerId);


  // Function to toggle follower status
  const patchFollower = async () => {
    // Sending a PATCH request to update follower status
    const response = await fetch(
      `http://localhost:4000/users/${_id}/${followerId}`,
      {
        method: "PATCH",
        headers: {
          Permitted: `Bearer ${token}`, // Including the bearer token for authentication
          "Content-Type": "application/json",
        },
      }
    );
    // Dispatching an action to update the Redux state with the new followers list
    const data = await response.json();
    dispatch(setFollowers({ followers: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        {/* Displaying the profile image and navigating to the follower's profile on click */}
        <ProfileImage image={profileImage} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${followerId}`);
            navigate(0);
          }}
        >
          {/* Displaying the follower's name with a hover effect for navigation */}
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
        </Box>
      </FlexBetween>
       {/* Button to toggle follower status, displaying different icons based on the current status */}
      <IconButton
        onClick={() => patchFollower()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFollower ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

// Exporting the Follower component for use in other parts of the application
export default Follower;