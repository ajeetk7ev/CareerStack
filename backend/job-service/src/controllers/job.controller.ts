import { NextFunction, Request, Response } from "express";
import { JobService } from "../services/job.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { JOB_MESSAGES } from "../constants/job.constant.js";
import { AppError } from "../utils/AppError.js";

const jobService = new JobService();

export class JobController {
  static async createJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) throw new AppError("Unauthorized", 401);

      const job = await jobService.createJob(
        req.user.userId,
        (req as any).params.companyId,
        req.headers.cookie,
        req.body,
      );

      res
        .status(201)
        .json(new ApiResponse(true, JOB_MESSAGES.JOB_CREATED, job));
    } catch (error) {
      next(error);
    }
  }

  static async getRecruiterJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) throw new AppError("Unauthorized", 401);

      const job = await jobService.getRecruiterJob(
        req.user.userId,
        (req as any).params.companyId,
        req.headers.cookie,
        (req as any).params.jobId,
      );

      res
        .status(200)
        .json(new ApiResponse(true, JOB_MESSAGES.JOB_FETCHED, job));
    } catch (error) {
      next(error);
    }
  }

  static async getPublicJobBySlug(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const job = await jobService.getPublicJobBySlug((req as any).params.slug);

      res
        .status(200)
        .json(new ApiResponse(true, JOB_MESSAGES.JOB_FETCHED, job));
    } catch (error) {
      next(error);
    }
  }

  static async updateJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) throw new AppError("Unauthorized", 401);

      const job = await jobService.updateJob(
        req.user.userId,
        (req as any).params.companyId,
        req.headers.cookie,
        (req as any).params.jobId,
        req.body,
      );

      res
        .status(200)
        .json(new ApiResponse(true, JOB_MESSAGES.JOB_UPDATED, job));
    } catch (error) {
      next(error);
    }
  }

  static async publishJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) throw new AppError("Unauthorized", 401);

      const job = await jobService.publishJob(
        req.user.userId,
        (req as any).params.companyId,
        req.headers.cookie,
        (req as any).params.jobId,
      );

      res
        .status(200)
        .json(new ApiResponse(true, JOB_MESSAGES.JOB_PUBLISHED, job));
    } catch (error) {
      next(error);
    }
  }

  static async unpublishJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) throw new AppError("Unauthorized", 401);

      const job = await jobService.unpublishJob(
        req.user.userId,
        (req as any).params.companyId,
        req.headers.cookie,
        (req as any).params.jobId,
      );

      res
        .status(200)
        .json(new ApiResponse(true, JOB_MESSAGES.JOB_UNPUBLISHED, job));
    } catch (error) {
      next(error);
    }
  }

  static async closeJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) throw new AppError("Unauthorized", 401);

      const job = await jobService.closeJob(
        req.user.userId,
        (req as any).params.companyId,
        req.headers.cookie,
        (req as any).params.jobId,
      );

      res.status(200).json(new ApiResponse(true, JOB_MESSAGES.JOB_CLOSED, job));
    } catch (error) {
      next(error);
    }
  }

  static async deleteDraftJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) throw new AppError("Unauthorized", 401);

      await jobService.deleteDraftJob(
        req.user.userId,
        (req as any).params.companyId,
        req.headers.cookie,
        (req as any).params.jobId,
      );

      res.status(200).json(new ApiResponse(true, JOB_MESSAGES.JOB_DELETED));
    } catch (error) {
      next(error);
    }
  }

  static async duplicateJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) throw new AppError("Unauthorized", 401);

      const job = await jobService.duplicateJob(
        req.user.userId,
        (req as any).params.companyId,
        req.headers.cookie,
        (req as any).params.jobId,
      );

      res
        .status(201)
        .json(new ApiResponse(true, JOB_MESSAGES.JOB_DUPLICATED, job));
    } catch (error) {
      next(error);
    }
  }

  static async listRecruiterJobs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) throw new AppError("Unauthorized", 401);

      const jobs = await jobService.listRecruiterJobs(
        req.user.userId,
        (req as any).params.companyId,
        req.headers.cookie,
        req.query,
      );

      res
        .status(200)
        .json(new ApiResponse(true, JOB_MESSAGES.JOBS_FETCHED, jobs));
    } catch (error) {
      next(error);
    }
  }

  static async listPublicJobs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const jobs = await jobService.listPublicJobs(req.query);

      res
        .status(200)
        .json(new ApiResponse(true, JOB_MESSAGES.JOBS_FETCHED, jobs));
    } catch (error) {
      next(error);
    }
  }

  static async getInternalJobById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const job = await jobService.getInternalJobById(
        (req as any).params.jobId,
      );

      res
        .status(200)
        .json(new ApiResponse(true, JOB_MESSAGES.JOB_FETCHED, job));
    } catch (error) {
      next(error);
    }
  }

  static async getInternalRecruiterJobById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const job = await jobService.getInternalRecruiterJobById(
        (req as any).params.jobId,
        req.headers.cookie,
      );

      res
        .status(200)
        .json(new ApiResponse(true, JOB_MESSAGES.JOB_FETCHED, job));
    } catch (error) {
      next(error);
    }
  }
}
