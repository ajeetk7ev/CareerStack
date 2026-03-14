import { getChannel } from "../config/rabbitmq.js";
import { logger } from "../config/logger.js";

export class JobEventService {
  private readonly EXCHANGE_NAME = "job_events";

  private async getChannel() {
    try {
      const channel = getChannel();
      await channel.assertExchange(this.EXCHANGE_NAME, "topic", {
        durable: true,
      });
      return channel;
    } catch (error) {
      logger.error("Failed to assert RabbitMQ exchange:", error);
      throw error;
    }
  }

  private async publish(routingKey: string, payload: Record<string, unknown>) {
    try {
      const channel = await this.getChannel();
      channel.publish(
        this.EXCHANGE_NAME,
        routingKey,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true },
      );
      logger.info(`Published event ${routingKey} to RabbitMQ`);
    } catch (error) {
      logger.error(`Failed to publish event ${routingKey} to RabbitMQ:`, error);
      // In prod we might want to retry or use a fallback
    }
  }

  async publishJobCreated(payload: Record<string, unknown>) {
    await this.publish("job.created", payload);
  }

  async publishJobUpdated(payload: Record<string, unknown>) {
    await this.publish("job.updated", payload);
  }

  async publishJobPublished(payload: Record<string, unknown>) {
    await this.publish("job.published", payload);
  }

  async publishJobUnpublished(payload: Record<string, unknown>) {
    await this.publish("job.unpublished", payload);
  }

  async publishJobClosed(payload: Record<string, unknown>) {
    await this.publish("job.closed", payload);
  }

  async publishJobDeleted(payload: Record<string, unknown>) {
    await this.publish("job.deleted", payload);
  }
}
