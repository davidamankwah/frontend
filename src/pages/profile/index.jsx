// ProfilePage.js
import { Box, Button } from "@mui/material";
import PostsWid from "../widget/PostsWid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import RecommendedUsers from "../../components/RecommendedUsers";
import FollowersWidget from "../widget/FollowersWidget";
import CustomUserWidget from "../widget/customUserWidget";
import "./profile.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [showPosts, setShowPosts] = useState(false);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:4000/users/${userId}`, {
          method: "GET",
          headers: { Permitted: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, [userId, token]);

  const handleTogglePosts = () => {
    setShowPosts(!showPosts);
  };
  

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <div className="profilePage">
        <div className="profilePageSection">
          <CustomUserWidget userId={userId} picturePath={user.picturePath} />
          <div className="profilePageSection large">
            <FollowersWidget userId={userId} />
            <RecommendedUsers token={token} />
          </div>
        </div>
      </div>
      <Box  m="2rem 0"  height="900px">
      <Button variant="contained" onClick={handleTogglePosts}>
      {showPosts ? "Hide Posts" : "Show Posts"}
      </Button>
      {showPosts && <PostsWid userId={userId} isProfile />}
      </Box>
    </Box>
  );
};

export default ProfilePage;
