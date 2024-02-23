import { Box, useMediaQuery } from "@mui/material";
import LoadingComponent from "./LoadingComponent";
import NoPostsComponent from "./NoPostsComponent";
import { useSelector } from "react-redux";
import React, { useState } from 'react';
import Navbar from "../../pages/navbar";
import CustomUserWidget from "../widget/customUserWidget";
import FollowersWidget from "../widget/FollowersWidget";
import PostsWid from "../widget/PostsWid";
import UserPostWidget from "../widget/UserPostWidget";
import "./home.css";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);

  if (!user) {
    // Render loading state or redirect to login page
    return <LoadingComponent />;
  }

  return (
    <Box>
      <Navbar />
      <div className="homePage">
        <div className="homePageSection">
        <div className="homePageSectionWithSticky">
          <CustomUserWidget userId={user._id} picturePath={user.picturePath} />
          </div>
        </div>
        <div className="homePageSection large">
          <UserPostWidget picturePath={user.picturePath} />
          {posts.length > 0 ? (
            <PostsWid userId={user._id} />
          ) : (
            <NoPostsComponent />
          )}
        </div>
        <div className="homePageSection">
        <div className="homePageSectionWithSticky">
          <FollowersWidget userId={user._id} />
          </div>
        </div>
      </div>
    </Box>
  );
};

// You can create LoadingComponent and NoPostsComponent as needed.

export default HomePage;
