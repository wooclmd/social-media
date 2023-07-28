import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);

  const [desc, setDesc] = useState(null);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery(
    ["comments", postId],
    async () => {
      try {
        const response = await makeRequest.get(`/comments?postId=${postId}`);
        return response.data;
      } catch (error) {
        console.error("Fetch Posts Error:", error);
        throw error;
      }
    }
  );

  const mutation = useMutation(
    //new comment
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        //invalidate and refetch posts
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  if (error) {
    return <div>{error}</div>;
  }

  const handleClick = (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} />
        <input
          placeholder="write a comment"
          name="desc"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading
        ? "Loading..."
        : data.map((comment) => (
            <div className="comment" key={comment.id}>
              <div className="left">
                <div className="commentImg">
                  <img src={comment.profilePic} />
                </div>
                <div className="content">
                  <div className="name">{comment.name}</div>
                  <div className="text">{comment.desc}</div>
                </div>
              </div>

              <span>{moment(comment.createAt).fromNow()}</span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
