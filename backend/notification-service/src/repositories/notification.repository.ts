import { NotificationCategory, NotificationType, Prisma } from "../generated/prisma/client.js";
import { prisma } from "../config/prisma.js";

export class NotificationRepository {
  async create(data: Prisma.NotificationCreateInput) {
    return prisma.notification.create({ data });
  }

  async findManyByUser(userId: string, isRead?: boolean) {
    return prisma.notification.findMany({
      where: {
        userId,
        ...(isRead !== undefined ? { isRead } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async delete(notificationId: string, userId: string) {
    return prisma.notification.delete({
      where: { id: notificationId, userId },
    });
  }
}
