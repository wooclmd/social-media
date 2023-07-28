import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Comments from "../comments/Comments";
import moment from "moment";
import "./post.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [showComment, setShowComment] = useState(null);
  const [showBin, setShowBin] = useState(false);

  const { currentUser } = useContext(AuthContext);

  //get likes
  const { isLoading, error, data } = useQuery(["likes", post.id], async () => {
    try {
      const res = await makeRequest.get(`/likes?postId=${post.id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    //check if liked
    (liked) => {
      if (liked) return makeRequest.delete(`/likes?postId=${post.id}`);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        //invalidate and refetch likes
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );

  const handleLike = (e) => {
    e.preventDefault();
    mutation.mutate(data.includes(currentUser.id));
  };

  //handle delete post
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        //invalidate and refetch posts
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  const showComments = (postId) => {
    setShowComment((prev) => (prev === postId ? null : postId));
  };
  return (
    <div className="posts">
      <div className="post" key={post.id}>
        <div className="author">
          <Link
            to={`/profile/${post.user_id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="left">
              <img src={"/public/uploads/" + post.profilePic} alt="" />
              <div className="name">
                <span>{post.name}</span>
                <span className="time">{moment(post.createAt).fromNow()}</span>
              </div>
            </div>
          </Link>
          <div className="more">
            <span onClick={() => setShowBin(!showBin)}>...</span>

            {currentUser.id === post.user_id && showBin && (
              <div className="bin" onClick={handleDelete}>
                <i class="fa-solid fa-trash"></i>
              </div>
            )}
          </div>
        </div>
        <div className="content">
          <p>{post.desc}</p>
        </div>
        {post.img && (
          <div className="img">
            <img src={`/public/uploads/${post.img}`} alt="" />
          </div>
        )}

        <div className="icons">
          <div className="icon" onClick={handleLike}>
            {data?.includes(currentUser.id) ? (
              <i class="fa-solid fa-heart" style={{ color: "red" }}></i>
            ) : (
              <i class="fa-regular fa-heart"></i>
            )}
            <span>{data?.length} Likes</span>
          </div>
          <div
            className="icon"
            onClick={() => {
              showComments(post.id);
            }}
          >
            <i class="fa-regular fa-message"></i>
            <span>Comments</span>
          </div>
          <div className="icon">
            <i class="fa-solid fa-link"></i>
            <span>Share</span>
          </div>
        </div>
        {showComment === post.id && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
