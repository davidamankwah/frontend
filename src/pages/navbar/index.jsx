import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  Menu,
  Close,
} from "@mui/icons-material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../state";

import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";

const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);

    const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
    const [searchResult, setSearchResult] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const token = useSelector((state) => state.token);
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const fullName = `${user.userName}`;
    const handleSearch = async () => {
      try {
        const response = await fetch(`http://localhost:4000/users/search/${searchQuery}`);
  
        if (response.ok) {
          const result = await response.json();
          setSearchResult(result);
        } else {
          console.error('Search request failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error during search:', error);
      }
    };      

    //navigate functions
    const handleProfileClick = (userId) => {
      // Navigate to the user's profile page
      navigate(`/profile/${userId}`);
    };

   const handleChatClick = () => {
    console.log('Navigating to chat');
    navigate(`/chats/`);
   };

   const handleNotifyClick = () => {
    console.log('Navigating to chat');
    navigate(`/notification/`);
   };

   const handleMessageClick = () => {
    console.log('Navigating to Message');
    navigate(`/message/`);
   };

    return (
        <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          ConnectSphere
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
           {/* Search input */}
           <InputBase
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <IconButton onClick={handleSearch}>
        <Search />
      </IconButton>
      <Typography>Search Results:</Typography>
      <ul>
          {searchResult.map((user) => (
            <li key={user._id} onClick={() => handleProfileClick(user._id)}>
              {user.userName}
            </li>
          ))}
        </ul>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <Message key={user._id} onClick={() => handleChatClick()}  sx={{ fontSize: "25px" }} />
          <NotificationsIcon onClick={() => handleNotifyClick()}></NotificationsIcon>
          <MailIcon onClick={() => handleMessageClick()}></MailIcon>
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >    
            <Message key={user._id}  onClick={() => handleChatClick()} sx={{ fontSize: "25px" }} />
            <NotificationsIcon onClick={() => handleNotifyClick()}></NotificationsIcon>
            <MailIcon onClick={() => handleMessageClick()}></MailIcon>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
    );
    };
    export default Navbar;