import axios from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export class JobClientService {
  async getPublicJobById(jobId: string, cookieHeader?: string) {
    try {
      const response = await axios.get(
        `${env.JOB_SERVICE_URL}/internal/jobs/${jobId}`,
        {
          headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        },
      );

      return response.data?.data;
    } catch {
      throw new AppError("Job not found or unavailable", 404);
    }
  }

  async getRecruiterJobById(jobId: string, cookieHeader?: string) {
    try {
      const response = await axios.get(
        `${env.JOB_SERVICE_URL}/internal/recruiter/jobs/${jobId}`,
        {
          headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        },
      );

      return response.data?.data;
    } catch {
      throw new AppError("Recruiter job not found", 404);
    }
  }
}
