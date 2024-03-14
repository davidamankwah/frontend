import {EditOutlined,DeleteOutlined,ImageOutlined,} from "@mui/icons-material";
  import { Box, Divider, Typography, InputBase, useTheme, Button, IconButton, useMediaQuery,} from "@mui/material";
  import FlexBetween from "../../components/FlexBetween";
  import Dropzone from "react-dropzone";
  import ProfileImage from "../../components/ProfileImage";
  import StyledWrapper from "../../components/Wrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPosts } from "../../state";
  
  const UserPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
  
    // Function to handle post creation
    const handlePost = async () => {
      //Creating a FormData object to handle multipart form data
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("text", post);
      if (image) {
        formData.append("pic", image);
        formData.append("picturePath", image.name);
      }
      // Sending a POST request to create a new post
      const response = await fetch(`https://server-tyt9.onrender.com/posts`, {
        method: "POST",
        headers: { Permitted: `Bearer ${token}` },
        body: formData,
      });
      // Updating the Redux state with the new posts
      const posts = await response.json();
      dispatch(setPosts({ posts }));
      // Resetting state variables after successful post creation
      setImage(null);
      setPost("");
    };
  
    return (
      <StyledWrapper>
        <FlexBetween gap="1.5rem">
          {/* Displaying the profile image */}
          <ProfileImage image={picturePath} />
          {/* Input field for post text */}
          <InputBase
            placeholder="What is happening?!"
            onChange={(e) => setPost(e.target.value)}
            value={post}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />
        </FlexBetween>
        {/* Image upload section */}
        {isImage && (
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png,.gif,.mp4"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!image ? (
                      <p>Add File Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{image.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>
                  {image && (
                    <IconButton
                      onClick={() => setImage(null)}
                      sx={{ width: "15%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}
         {/* Divider between post input and options */}
        <Divider sx={{ margin: "1.25rem 0" }} />

        {/* Options for adding image and posting */}            
        <FlexBetween>
           {/* Option to add or remove an image */}
          <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Upload File
            </Typography>
          </FlexBetween>
           {/* Button to submit the post, disabled if no text is entered */}
          <Button
            disabled={!post}
            onClick={handlePost}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            POST
          </Button>
        </FlexBetween>
      </StyledWrapper>
    );
  };
  
  export default UserPostWidget;