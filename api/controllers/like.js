import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  //get likes
  const q = "SELECT user_id FROM likes WHERE post_id = (?)";
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((user) => user.user_id));
  });
};

export const postLike = (req, res) => {
  //get token
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not logged in.");

  //verify token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(402).json("Invalid token.");

    //post like
    const q = "INSERT INTO likes (`user_id`, `post_id`) VALUES (?)";

    const values = [userInfo.id, req.body.postId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Liked!");
    });
  });
};

export const deleteLike = (req, res) => {
  //get token
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not logged in.");

  //verify token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json(err);

    //delete like
    const q = "DELETE FROM likes WHERE `user_id` = ? AND `post_id` = (?)";

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Disliked!");
    });
  });
};
