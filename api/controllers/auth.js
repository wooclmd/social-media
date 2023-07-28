import { db } from "../connect.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //check if username already exists
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length) return res.status(409).json("Username already exists.");

    //hash password
    const salt = bcryptjs.genSaltSync(10);
    const hashPassword = bcryptjs.hashSync(req.body.password, salt);

    //add new user to db
    const q =
      "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";
    const value = [
      req.body.username,
      req.body.email,
      hashPassword,
      req.body.name,
    ];
    db.query(q, [value], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  //check if username exists
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json("Username or password is incorrect.");
    //check password
    const isPasswordOk = bcryptjs.compareSync(
      req.body.password,
      data[0].password
    );
    if (!isPasswordOk) return res.status(400).json("Incorrect password.");

    //create jwt token
    const token = jwt.sign({ id: data[0].id }, "secretkey");
    const { password, ...others } = data[0];

    //create cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  //clear cookie
  res
    .clearCookie("token", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};
