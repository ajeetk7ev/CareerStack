import axios from "axios";
import { env } from "./env.js";

export const companyServiceClient = axios.create({
  baseURL: env.COMPANY_SERVICE_URL,
  timeout: 5000,
  withCredentials: true,
});
