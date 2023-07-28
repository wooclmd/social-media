import moment from "moment";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.name, u.profilePic 
    FROM comments c
    JOIN users u 
    ON (c.user_id=u.id)
    WHERE post_id=?
    ORDER BY createAt DESC;`;

  //req.query.postId from url with ?　key=values

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const postComment = (req, res) => {
  //get token
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not logged in");

  //verify token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid.");

    //add post
    const q =
      "INSERT INTO comments (`desc`,`createAt`, `user_id`, `post_id`) VALUES (?)";

    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created.");
    });
  });
};
