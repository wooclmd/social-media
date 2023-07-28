import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationship = (req, res) => {
  const q = "SELECT followerUser_id FROM relationship WHERE followUser_id = ?";

  db.query(q, [req.query.followUser_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(data.map((relationship) => relationship.followerUser_id));
  });
};

export const addRelationship = (req, res) => {
  //get token
  const token = req.cookies.token;
  if (!token) return res.json(401).json("Not logged in.");

  //verify token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token.");

    //add relationship
    const q =
      "INSERT INTO relationship (`followerUser_id`, `followUser_id`) VALUES(?)";
    const values = [userInfo.id, req.body.followUser_id];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Relationship created.");
    });
  });
};

export const deleteRelationship = (req, res) => {
  //get token
  const token = req.cookies.token;
  if (!token) return res.json(401).json("Not logged in.");

  //verify token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token.");
    //delete relationship
    const q =
      "DELETE FROM relationship WHERE `followerUser_id` = ? AND `followUser_id` = ?";
    db.query(q, [userInfo.id, req.query.followUser_id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollowed the user.");
    });
  });
};
