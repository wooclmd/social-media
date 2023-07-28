import express from "express";
import { getUserProfile, updateUser } from "../controllers/user.js";

const router = express.Router();

router.get("/find/:id", getUserProfile);
router.put("/", updateUser);

export default router;
