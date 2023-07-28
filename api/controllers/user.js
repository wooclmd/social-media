import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUserProfile = (req, res) => {
  const q = "SELECT * FROM users WHERE id = ?";
  const userId = req.params.id;

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...others } = data[0];

    return res.status(200).json(others);
  });
};

export const updateUser = (req, res) => {
  //get token
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not logged in");

  //verify token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token.");

    //update user profile
    const q =
      "UPDATE users SET `name` =?, `city`=?, `website`=?, `coverPic`=?, `profilePic`=? WHERE id = ?";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0)
          return res.status(200).json("Profile has been updated.");
        return res.status(403).json("You cam only update your profile.");
      }
    );
  });
};
