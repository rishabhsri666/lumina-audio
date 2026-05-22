import { Router } from "express";

import { streamController } from "../controllers/streamController";

const router = Router();

router.get("/:id", streamController);

export default router;