import { NextFunction, Request, Response } from "express";
import { CompanyService } from "../services/company.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { COMPANY_MESSAGES } from "../constants/company.constant.js";
import { AppError } from "../utils/AppError.js";

const companyService = new CompanyService();

export class CompanyController {
  static async createCompany(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const company = await companyService.createCompany(
        req.user.userId,
        req.body,
      );

      res
        .status(201)
        .json(new ApiResponse(true, COMPANY_MESSAGES.COMPANY_CREATED, company));
    } catch (error) {
      next(error);
    }
  }

  static async getMyCompany(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const company = await companyService.getMyCompany(req.user.userId);

      res
        .status(200)
        .json(new ApiResponse(true, COMPANY_MESSAGES.COMPANY_FETCHED, company));
    } catch (error) {
      next(error);
    }
  }

  static async updateMyCompany(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const company = await companyService.updateMyCompany(
        req.user.userId,
        req.body,
      );

      res
        .status(200)
        .json(new ApiResponse(true, COMPANY_MESSAGES.COMPANY_UPDATED, company));
    } catch (error) {
      next(error);
    }
  }

  static async getCompanyBySlug(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const company = await companyService.getCompanyBySlug(
        (req as any).params.slug,
      );

      res
        .status(200)
        .json(new ApiResponse(true, COMPANY_MESSAGES.COMPANY_FETCHED, company));
    } catch (error) {
      next(error);
    }
  }

  static async listMyCompanyMembers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const members = await companyService.listMyCompanyMembers(
        req.user.userId,
      );

      res
        .status(200)
        .json(new ApiResponse(true, COMPANY_MESSAGES.MEMBERS_FETCHED, members));
    } catch (error) {
      next(error);
    }
  }

  static async inviteRecruiter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const invite = await companyService.inviteRecruiter(
        req.user.userId,
        req.body,
      );

      res
        .status(201)
        .json(new ApiResponse(true, COMPANY_MESSAGES.INVITE_CREATED, invite));
    } catch (error) {
      next(error);
    }
  }

  static async acceptInvite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId || !req.user?.email) {
        throw new AppError("Unauthorized", 401);
      }

      const result = await companyService.acceptInvite(
        req.user.userId,
        req.user.email,
        req.body.token,
      );

      res
        .status(200)
        .json(new ApiResponse(true, COMPANY_MESSAGES.INVITE_ACCEPTED, result));
    } catch (error) {
      next(error);
    }
  }

  static async updateMemberRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const member = await companyService.updateMemberRole(
        req.user.userId,
        (req as any).params.memberId,
        req.body.role,
      );

      res
        .status(200)
        .json(
          new ApiResponse(true, COMPANY_MESSAGES.MEMBER_ROLE_UPDATED, member),
        );
    } catch (error) {
      next(error);
    }
  }

  static async removeMember(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      await companyService.removeMember(
        req.user.userId,
        (req as any).params.memberId,
      );

      res
        .status(200)
        .json(new ApiResponse(true, COMPANY_MESSAGES.MEMBER_REMOVED));
    } catch (error) {
      next(error);
    }
  }

  static async cancelInvite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      await companyService.cancelInvite(
        req.user.userId,
        (req as any).params.inviteId,
      );

      res
        .status(200)
        .json(new ApiResponse(true, COMPANY_MESSAGES.INVITE_CANCELLED));
    } catch (error) {
      next(error);
    }
  }
}
