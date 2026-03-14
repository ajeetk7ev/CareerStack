import { companyServiceClient } from "../config/axios.js";
import { AppError } from "../utils/AppError.js";

export class CompanyClientService {
  async getMyCompany(cookieHeader?: string) {
    try {
      const response = await companyServiceClient.get("/me", {
        headers: cookieHeader ? { cookie: cookieHeader } : {},
      });

      return response.data?.data;
    } catch (_error) {
      throw new AppError(
        "Unable to fetch company details from company service",
        502,
      );
    }
  }

  async verifyMembership(companyId: string, cookieHeader?: string) {
    try {
      const response = await companyServiceClient.get(
        `/${companyId}/membership`,
        {
          headers: cookieHeader ? { cookie: cookieHeader } : {},
        },
      );

      return response.data?.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new AppError(
          "Forbidden: you are not a member of this company",
          403,
        );
      }
      throw new AppError(
        "Unable to verify membership with company service",
        502,
      );
    }
  }

  async getMyCompanyMembers(cookieHeader?: string) {
    try {
      const response = await companyServiceClient.get("/members/me", {
        headers: cookieHeader ? { cookie: cookieHeader } : {},
      });

      return response.data?.data;
    } catch (_error) {
      throw new AppError(
        "Unable to fetch company members from company service",
        502,
      );
    }
  }
}
