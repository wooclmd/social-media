import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

export const Posts = ({ id }) => {
  const { isLoading, error, data } = useQuery(["posts"], async () => {
    try {
      const response = await makeRequest.get(`/posts?userId=${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Fetch Posts Error:", error);
      throw error;
    }
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="posts">
      <div className="container">
        {isLoading ? "Loading..." : data.map((post) => <Post post={post} />)}
      </div>
    </div>
  );
};

export default Posts;
