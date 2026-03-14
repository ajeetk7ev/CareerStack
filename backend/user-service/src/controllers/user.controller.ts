import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { USER_MESSAGES } from "../constants/user.constants.js";
import { AppError } from "../utils/AppError.js";

const userService = new UserService();

export class UserController {
  static async createProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const profile = await userService.createProfile(
        req.user.userId,
        req.body,
      );

      res
        .status(201)
        .json(new ApiResponse(true, USER_MESSAGES.PROFILE_CREATED, profile));
    } catch (error) {
      next(error);
    }
  }

  static async getMyProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const profile = await userService.getMyProfile(req.user.userId);

      res
        .status(200)
        .json(new ApiResponse(true, USER_MESSAGES.PROFILE_FETCHED, profile));
    } catch (error) {
      next(error);
    }
  }

  static async getProfileByAuthUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const profile = await userService.getProfileByAuthUserId(
        (req as any).params.authUserId,
      );

      res
        .status(200)
        .json(new ApiResponse(true, USER_MESSAGES.PROFILE_FETCHED, profile));
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const profile = await userService.updateProfile(
        req.user.userId,
        req.body,
      );

      res
        .status(200)
        .json(new ApiResponse(true, USER_MESSAGES.PROFILE_UPDATED, profile));
    } catch (error) {
      next(error);
    }
  }

  static async addSkill(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const skill = await userService.addSkill(req.user.userId, req.body);

      res
        .status(201)
        .json(new ApiResponse(true, USER_MESSAGES.SKILL_ADDED, skill));
    } catch (error) {
      next(error);
    }
  }

  static async addEducation(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const education = await userService.addEducation(
        req.user.userId,
        req.body,
      );

      res
        .status(201)
        .json(new ApiResponse(true, USER_MESSAGES.EDUCATION_ADDED, education));
    } catch (error) {
      next(error);
    }
  }

  static async addExperience(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const experience = await userService.addExperience(
        req.user.userId,
        req.body,
      );

      res
        .status(201)
        .json(
          new ApiResponse(true, USER_MESSAGES.EXPERIENCE_ADDED, experience),
        );
    } catch (error) {
      next(error);
    }
  }

  static async addProject(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const project = await userService.addProject(req.user.userId, req.body);

      res
        .status(201)
        .json(new ApiResponse(true, USER_MESSAGES.PROJECT_ADDED, project));
    } catch (error) {
      next(error);
    }
  }

  static async updateSkill(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const skill = await userService.updateSkill(
        (req as any).params.id,
        req.body,
      );

      res
        .status(200)
        .json(new ApiResponse(true, USER_MESSAGES.ITEM_UPDATED, skill));
    } catch (error) {
      next(error);
    }
  }

  static async updateEducation(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const education = await userService.updateEducation(
        (req as any).params.id,
        req.body,
      );

      res
        .status(200)
        .json(new ApiResponse(true, USER_MESSAGES.ITEM_UPDATED, education));
    } catch (error) {
      next(error);
    }
  }

  static async updateExperience(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const experience = await userService.updateExperience(
        (req as any).params.id,
        req.body,
      );

      res
        .status(200)
        .json(new ApiResponse(true, USER_MESSAGES.ITEM_UPDATED, experience));
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const project = await userService.updateProject(
        (req as any).params.id,
        req.body,
      );

      res
        .status(200)
        .json(new ApiResponse(true, USER_MESSAGES.ITEM_UPDATED, project));
    } catch (error) {
      next(error);
    }
  }

  static async deleteSkill(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await userService.deleteSkill((req as any).params.id);

      res.status(200).json(new ApiResponse(true, USER_MESSAGES.ITEM_DELETED));
    } catch (error) {
      next(error);
    }
  }

  static async deleteEducation(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await userService.deleteEducation((req as any).params.id);

      res.status(200).json(new ApiResponse(true, USER_MESSAGES.ITEM_DELETED));
    } catch (error) {
      next(error);
    }
  }

  static async deleteExperience(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await userService.deleteExperience((req as any).params.id);

      res.status(200).json(new ApiResponse(true, USER_MESSAGES.ITEM_DELETED));
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await userService.deleteProject((req as any).params.id);

      res.status(200).json(new ApiResponse(true, USER_MESSAGES.ITEM_DELETED));
    } catch (error) {
      next(error);
    }
  }
}
