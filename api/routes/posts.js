import express from "express";
import { getPosts, addPost, deletePost } from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/addPost", addPost);
router.delete("/:postId", deletePost);

export default router;

// /:id => params
// /?key=value => query
