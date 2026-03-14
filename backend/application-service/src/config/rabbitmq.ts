import { connect, Channel, Connection, ChannelModel } from "amqplib";
import { env } from "./env";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export const connectRabbitMQ = async () => {
  if (connection && channel) return { connection, channel };

  connection = await connect(env.RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertExchange(env.RABBITMQ_EXCHANGE, "topic", {
    durable: true,
  });

  return { connection, channel };
};

export const getRabbitChannel = () => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
};

export const disconnectRabbitMQ = async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
};
