import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSlider, sendMessages } from "../controllers/messsage.controller.js";

const router = express.Router();

router.get("users",protectRoute,getUserForSlider)

router.get("/:id",protectRoute,getMessages)

router.post("/send/:id",protectRoute,sendMessages)


export default router;