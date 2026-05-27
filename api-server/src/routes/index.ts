import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import trackersRouter from "./trackers";
import sectionsRouter from "./sections";
import trackerItemsRouter from "./tracker_items";
import completionsRouter from "./completions";
import analyticsRouter from "./analytics";
import shareRouter from "./share";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(trackersRouter);
router.use(sectionsRouter);
router.use(trackerItemsRouter);
router.use(completionsRouter);
router.use(analyticsRouter);
router.use(shareRouter);

export default router;
