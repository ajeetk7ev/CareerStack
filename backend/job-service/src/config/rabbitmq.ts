import { connect, Channel, Connection } from "amqplib";
import { env } from "./env.js";
import { logger } from "./logger.js";

let connection: any;
let channel: any;

export async function connectRabbitMQ() {
  try {
    connection = await connect(env.RABBIT_URL);
    channel = await connection.createChannel();
    
    logger.info("Successfully connected to RabbitMQ");

    process.on("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });
  } catch (error) {
    logger.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
}

export function getChannel(): Channel {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized. Call connectRabbitMQ first.");
  }
  return channel;
}
