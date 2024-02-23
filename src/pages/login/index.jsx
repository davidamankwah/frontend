import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import "./login.css"; // Import the CSS file

const LoginPage = () => {
  const theme = useTheme();
  return (
    <Box>
      {/* Header */}
      <Box className="header">
        <Typography fontWeight="bold" fontSize="32px" color={theme.palette.background.alt}>
          ConnectSphere
        </Typography>
      </Box>

      {/* Main Content */}
      <Box className="main-content">
        <Typography fontWeight="500" variant="h5">
          Welcome to ConnectSphere, where connections thrive and conversations come to life! 🌟 Join our vibrant community, share your moments, and discover new stories. Connect with friends, explore exciting content, and make this space truly yours. Let the journey begin!!
        </Typography>
        
        {/* Form Component */}
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
