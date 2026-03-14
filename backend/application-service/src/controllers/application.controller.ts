import { Request, Response } from "express";
import { ApplicationService } from "../services/application.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const applicationService = new ApplicationService();

export class ApplicationController {
  static async applyToJob(req: Request, res: Response) {
    const result = await applicationService.applyToJob(
      req.user!.userId,
      req.headers.cookie,
      req.body,
    );

    res
      .status(201)
      .json(
        new ApiResponse(true, "Application submitted successfully", result),
      );
  }

  static async listMyApplications(req: Request, res: Response) {
    const result = await applicationService.listMyApplications(
      req.user!.userId,
      req.query,
    );

    res
      .status(200)
      .json(new ApiResponse(true, "Applications fetched successfully", result));
  }

  static async getMyApplication(req: Request, res: Response) {
    const result = await applicationService.getMyApplication(
      req.user!.userId,
      (req as any).params.applicationId,
    );

    res
      .status(200)
      .json(new ApiResponse(true, "Application fetched successfully", result));
  }

  static async withdrawApplication(req: Request, res: Response) {
    const result = await applicationService.withdrawApplication(
      req.user!.userId,
      (req as any).params.applicationId,
    );

    res
      .status(200)
      .json(
        new ApiResponse(true, "Application withdrawn successfully", result),
      );
  }

  static async listApplicationsForJob(req: Request, res: Response) {
    const result = await applicationService.listApplicationsForJob(
      req.user!.userId,
      req.headers.cookie,
      (req as any).params.jobId,
      req.query,
    );

    res
      .status(200)
      .json(
        new ApiResponse(true, "Job applications fetched successfully", result),
      );
  }

  static async getRecruiterApplicationDetail(req: Request, res: Response) {
    const result = await applicationService.getRecruiterApplicationDetail(
      req.user!.userId,
      req.headers.cookie,
      (req as any).params.applicationId,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "Application detail fetched successfully",
          result,
        ),
      );
  }

  static async updateApplicationStatus(req: Request, res: Response) {
    const result = await applicationService.updateApplicationStatus(
      req.user!.userId,
      req.headers.cookie,
      (req as any).params.applicationId,
      req.body,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "Application status updated successfully",
          result,
        ),
      );
  }

  static async addRecruiterNote(req: Request, res: Response) {
    const result = await applicationService.addRecruiterNote(
      req.user!.userId,
      req.headers.cookie,
      (req as any).params.applicationId,
      req.body,
    );

    res
      .status(200)
      .json(new ApiResponse(true, "Recruiter note added successfully", result));
  }

  static async addRecruiterRating(req: Request, res: Response) {
    const result = await applicationService.addRecruiterRating(
      req.user!.userId,
      req.headers.cookie,
      (req as any).params.applicationId,
      req.body,
    );

    res
      .status(200)
      .json(
        new ApiResponse(true, "Recruiter rating added successfully", result),
      );
  }

  static async getJobApplicationAnalytics(req: Request, res: Response) {
    const result = await applicationService.getJobApplicationAnalytics(
      req.user!.userId,
      req.headers.cookie,
      (req as any).params.jobId,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "Application analytics fetched successfully",
          result,
        ),
      );
  }
}
