import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts} from "../../state";
import PostWidget from "./PostWidget";

const PostsWid = ({ userId, isProfile = false }) => {
  // Redux hooks for dispatching actions and accessing state
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  // Function to fetch all posts
  const getPosts = async () => {
    const response = await fetch("http://localhost:4000/posts", {
      method: "GET",
      headers: { Permitted: `Bearer ${token}` }, // Including the bearer token for authentication
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  // Function to fetch posts associated with a specific user
  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:4000/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Permitted: `Bearer ${token}` }, // Including the bearer token for authentication
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  // Effect hook to fetch posts when the component mounts
  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

   // Rendering the PostWidget for each post
  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          userName,
          text,
          picturePath,
          profileImage,
          likes,
          dislikes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${userName}`}
            text={text}
            picturePath={picturePath}
            profileImage={profileImage}
            likes={likes}
            dislikes={dislikes}
            comments={comments}
          />
        )
      )}
    </>
  );
};
// Exporting the PostsWid component for use in other parts of the application
export default PostsWid;