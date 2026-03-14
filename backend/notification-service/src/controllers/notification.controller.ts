import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const notificationService = new NotificationService();

export class NotificationController {
  static async getMyNotifications(req: Request, res: Response) {
    const isRead = req.query.isRead === "true" ? true : req.query.isRead === "false" ? false : undefined;
    const notifications = await notificationService.getUserNotifications(req.user!.userId, isRead);

    res.status(200).json(new ApiResponse(true, "Notifications fetched successfully", notifications));
  }

  static async markAsRead(req: Request, res: Response) {
    const { notificationId } = (req as any).params;
    await notificationService.markAsRead(notificationId, req.user!.userId);

    res.status(200).json(new ApiResponse(true, "Notification marked as read"));
  }

  static async markAllAsRead(req: Request, res: Response) {
    await notificationService.markAllAsRead(req.user!.userId);

    res.status(200).json(new ApiResponse(true, "All notifications marked as read"));
  }
}
