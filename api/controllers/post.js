import moment from "moment";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const userId = req.query.userId;

  //check token
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not logged in.");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("token is not valid.");

    const q =
      userId !== "undefined"
        ? `SELECT DISTINCT p.*,u.id as user_id, u.name, u.profilePic 
    FROM posts p 
    JOIN users u ON (p.user_id = u.id) WHERE p.user_id = ?`
        : `SELECT DISTINCT p.*,u.id as user_id, u.name, u.profilePic 
      FROM posts p 
      JOIN users u ON (p.user_id = u.id)
      LEFT JOIN relationship AS r ON (p.user_id = r.followUser_id AND followerUser_id = ? OR p.user_id=?)
      ORDER BY p.createAt DESC`;
    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  //check token see if it's logged in

  //check token
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not logged in.");

  //verify token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid.");

    //add post
    const q =
      "INSERT INTO posts (`desc`,`img`, `user_id`, `createAt`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};

//delete post
export const deletePost = (req, res) => {
  //get token
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not logged in.");

  //verify token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token.");

    //delete post
    const q = "DELETE FROM posts WHERE id = ? AND user_id = ?";

    db.query(q, [req.params.postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(401).json("You can delete your own post.");
    });
  });
};
