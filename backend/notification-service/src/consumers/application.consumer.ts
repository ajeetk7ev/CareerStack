import { getRabbitChannel } from "../config/rabbitmq.js";
import { logger } from "../config/logger.js";
import { env } from "../config/env.js";
import { NotificationService } from "../services/notification.service.js";
import {
  applicationSubmittedTemplate,
  recruiterNewApplicationTemplate,
} from "../templates/application.template.js";
import { statusChangedTemplate } from "../templates/status.template.js";

const notificationService = new NotificationService();

export const startApplicationConsumers = async () => {
  const channel = getRabbitChannel();
  const queue = "notification.application.queue";

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, env.RABBITMQ_EXCHANGE, "application.#");

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());
      const { eventName, payload } = content;

      logger.info(`Received event: ${eventName}`, { payload });

      switch (eventName) {
        case "application.created":
          await handleApplicationCreated(payload);
          break;
        case "application.status.changed":
          await handleStatusChanged(payload);
          break;
        default:
          logger.debug(`Unhandled event: ${eventName}`);
      }

      channel.ack(msg);
    } catch (error) {
      logger.error("Error processing application event", { error });
      // Depending on error, we might want to nack or reject
      channel.nack(msg, false, false);
    }
  });
};

const handleApplicationCreated = async (payload: any) => {
  // In a real app, we'd fetch user details (email, name) from User Service
  // For now, we'll assume the payload might have some info or we'd fetch it.
  // Ideally, the event payload should contain basic info or IDs to fetch info.
  
  const { authUserId, jobId, companyId, candidateName, candidateEmail, jobTitle, companyName } = payload;

  // 1. Notify Candidate
  await notificationService.notifyInApp({
    userId: authUserId,
    title: "Application Submitted",
    message: `You have successfully applied to ${jobTitle || "the job"}.`,
    type: "SUCCESS",
    category: "APPLICATION_STATUS",
    metadata: { jobId, companyId },
  });

  if (candidateEmail) {
    await notificationService.notifyEmail(
      candidateEmail,
      "Application Submitted",
      applicationSubmittedTemplate({
        candidateName: candidateName || "Candidate",
        jobTitle: jobTitle || "Job",
        companyName: companyName || "Company",
      }),
    );
  }

  // 2. Notify Recruiter (would need to find recruiter ID for the company/job)
  // This would involve calling the company or job service.
};

const handleStatusChanged = async (payload: any) => {
  const { authUserId, jobId, fromStatus, toStatus, candidateName, candidateEmail, jobTitle } = payload;

  await notificationService.notifyInApp({
    userId: authUserId,
    title: "Status Updated",
    message: `Your application status for ${jobTitle || "the job"} has changed to ${toStatus}.`,
    type: "INFO",
    category: "APPLICATION_STATUS",
    metadata: { jobId, fromStatus, toStatus },
  });

  if (candidateEmail) {
    await notificationService.notifyEmail(
      candidateEmail,
      "Application Status Updated",
      statusChangedTemplate({
        candidateName: candidateName || "Candidate",
        jobTitle: jobTitle || "Job",
        status: toStatus,
      }),
    );
  }
};
