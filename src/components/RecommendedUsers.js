// RecommendedUsers.js
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Follower from "./Follower";
import { useSelector } from "react-redux";

const RecommendedUsers = ({ token }) => {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const currentUserID = useSelector((state) => state.user?._id);

  useEffect(() => {
    const fetchRecommendedUsers = async () => {
      try {
        const response = await fetch("http://localhost:4000/users/recommended", {
          method: "GET",
          headers: { Permitted: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recommended users");
        }

        const data = await response.json();
        // Filter out the current user from the recommended users
        const filteredUsers = data.filter(user => user._id !== currentUserID);
        // Shuffle the array randomly
        const shuffledUsers = shuffleArray(filteredUsers);
        // Set the state with the shuffled array
        setRecommendedUsers(shuffledUsers);

      } catch (error) {
        console.error(error);
      }
    };

    fetchRecommendedUsers();
  }, [token, currentUserID]);

    // Function to shuffle an array randomly
    const shuffleArray = (array) => {
      const shuffledArray = [...array];
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }
      return shuffledArray;
    };

  return (
    <div className="recommended-users">
      <Typography variant="h6">Who to Follow:</Typography>
      {recommendedUsers.map((recommendedUser) => (
        <Follower
          key={recommendedUser._id}
          followerId={recommendedUser._id}
          name={recommendedUser.userName}
          profileImage={recommendedUser.picturePath}
        />
      ))}
    </div>
  );
};

export default RecommendedUsers;