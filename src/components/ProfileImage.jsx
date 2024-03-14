import { Box } from "@mui/material";


const ProfileImage = ({ image, size = "60px" }) => {
  // Check if picture is not defined or an empty string
  if (!image) {
    return null; // or provide a default image or placeholder
  }

  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`https://server-tyt9.onrender.com/assets/${image}`}
      />
    </Box>
  );
};

export default ProfileImage;
