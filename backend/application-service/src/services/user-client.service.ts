import axios from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export class UserClientService {
  async getMyProfile(cookieHeader?: string) {
    try {
      const response = await axios.get(
        `${env.USER_SERVICE_URL}/internal/users/me-profile`,
        {
          headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        },
      );

      return response.data?.data;
    } catch {
      throw new AppError("User profile not found", 404);
    }
  }
}
