import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import "./share.scss";

import React, { useContext, useState } from "react";

const Share = () => {
  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState(null);

  const mutation = useMutation(
    //newPost = file, desc
    (newPost) => {
      return makeRequest.post("/posts/addPost", newPost);
    },
    {
      onSuccess: () => {
        //invalidate and refetch posts
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) {
      imgUrl = await upload();
    }
    mutation.mutate({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="up">
          <div className="left">
            <img src={"/public/uploads/" + currentUser.profilePic} />
            <input
              placeholder={`What's on your mind ${currentUser.name}?`}
              name="desc"
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && <img className="img" src={URL.createObjectURL(file)} />}
          </div>
        </div>
        <div className="down">
          <div className="left">
            <label htmlFor="file">
              <div className="item">
                <input
                  type="file"
                  id="file"
                  name="file"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <i class="fa-solid fa-image"></i>
                <span>Add Image</span>
              </div>
            </label>

            <div className="item">
              <i class="fa-solid fa-map"></i>
              <span>Add Place</span>
            </div>
            <div className="item">
              <i class="fa-solid fa-tag"></i>
              <span>Tag Friends</span>
            </div>
          </div>
          <button onClick={handleClick}>Share</button>
        </div>
      </div>
    </div>
  );
};

export default Share;
