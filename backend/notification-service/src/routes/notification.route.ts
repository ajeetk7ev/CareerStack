import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", asyncHandler(protect), asyncHandler(NotificationController.getMyNotifications));
router.patch("/:notificationId/read", asyncHandler(protect), asyncHandler(NotificationController.markAsRead));
router.patch("/read-all", asyncHandler(protect), asyncHandler(NotificationController.markAllAsRead));

export default router;
