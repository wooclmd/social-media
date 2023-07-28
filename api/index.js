import express from "express";
import authRoute from "../api/routes/auth.js";
import commentsRoute from "../api/routes/comments.js";
import likesRoute from "../api/routes/likes.js";
import postsRoute from "../api/routes/posts.js";
import usersRoute from "../api/routes/users.js";
import followRoute from "../api/routes/relationships.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

const app = express();

//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/uploads");
  },
  filename: function (req, file, cb) {
    //Date.now() + file.originalname => create new file name
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  return res.status(200).json(file.filename);
});

app.use("/api/auth", authRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/likes", likesRoute);
app.use("/api/posts", postsRoute);
app.use("/api/users", usersRoute);
app.use("/api/follow", followRoute);

app.listen(8800, () => {
  console.log("connect");
});
