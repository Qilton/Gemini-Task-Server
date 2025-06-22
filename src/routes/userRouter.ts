import {emailWebhook} from "../controllers/userController"
import { Router } from "express";

const router = Router();

router.post("/create", emailWebhook as any);

export default router;
