import { getRabbitChannel } from "../config/rabbitmq.js";
import { env } from "../config/env.js";

export class ApplicationEventService {
  private publish(routingKey: string, payload: Record<string, unknown>) {
    const channel = getRabbitChannel();

    channel.publish(
      env.RABBITMQ_EXCHANGE,
      routingKey,
      Buffer.from(
        JSON.stringify({
          eventName: routingKey,
          service: env.SERVICE_NAME,
          timestamp: new Date().toISOString(),
          payload,
        }),
      ),
      {
        persistent: true,
        contentType: "application/json",
      },
    );
  }

  async publishCreated(payload: Record<string, unknown>) {
    this.publish("application.created", payload);
  }

  async publishWithdrawn(payload: Record<string, unknown>) {
    this.publish("application.withdrawn", payload);
  }

  async publishStatusChanged(payload: Record<string, unknown>) {
    this.publish("application.status.changed", payload);
  }

  async publishNoteAdded(payload: Record<string, unknown>) {
    this.publish("application.note.added", payload);
  }

  async publishRated(payload: Record<string, unknown>) {
    this.publish("application.rated", payload);
  }
}
