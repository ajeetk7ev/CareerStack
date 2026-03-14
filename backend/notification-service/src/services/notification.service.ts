import { NotificationRepository } from "../repositories/notification.repository.js";
import { EmailService } from "./email.service.js";
import { NotificationCategory, NotificationType } from "../generated/prisma/client.js";

export class NotificationService {
  private repository = new NotificationRepository();
  private emailService = new EmailService();

  async notifyInApp(data: {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    category?: NotificationCategory;
    metadata?: any;
  }) {
    return this.repository.create({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || "INFO",
      category: data.category || "SYSTEM",
      metadata: data.metadata,
    });
  }

  async notifyEmail(to: string, subject: string, html: string) {
    return this.emailService.sendEmail(to, subject, html);
  }

  async getUserNotifications(userId: string, isRead?: boolean) {
    return this.repository.findManyByUser(userId, isRead);
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.repository.markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId: string) {
    return this.repository.markAllAsRead(userId);
  }
}
