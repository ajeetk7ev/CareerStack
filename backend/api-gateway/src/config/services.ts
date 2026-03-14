import { env } from "./env";

export const services = {
  auth: env.AUTH_SERVICE_URL,
  user: env.USER_SERVICE_URL,
  job: env.JOB_SERVICE_URL,
  application: env.APPLICATION_SERVICE_URL,
  company: env.COMPANY_SERVICE_URL,
  notification: env.NOTIFICATION_SERVICE_URL,
  search: env.SEARCH_SERVICE_URL,
  ai: env.AI_SERVICE_URL,
};
