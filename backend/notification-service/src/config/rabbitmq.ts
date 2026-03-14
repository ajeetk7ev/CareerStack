import { connect, Channel, ChannelModel } from "amqplib";
import { env } from "./env.js";
import { logger } from "./logger.js";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export const connectRabbitMQ = async () => {
  try {
    connection = await connect(env.RABBITMQ_URL);
    if (!connection) throw new Error("Failed to create RabbitMQ connection");
    
    channel = await connection.createChannel();
    if (!channel) throw new Error("Failed to create RabbitMQ channel");

    await channel.assertExchange(env.RABBITMQ_EXCHANGE, "topic", {
      durable: true,
    });

    logger.info("Connected to RabbitMQ");
  } catch (error) {
    logger.error("Failed to connect to RabbitMQ", { error });
    throw error;
  }
};

export const getRabbitChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
};

export const disconnectRabbitMQ = async () => {
  try {
    await channel?.close();
    await connection?.close();
    logger.info("Disconnected from RabbitMQ");
  } catch (error) {
    logger.error("Error disconnecting from RabbitMQ", { error });
  }
};
