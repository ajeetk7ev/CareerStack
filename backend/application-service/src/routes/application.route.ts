import { Router } from "express";
import { ApplicationController } from "../controllers/application.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  applyJobSchema,
  applicationIdParamSchema,
  recruiterAddNoteSchema,
  recruiterAddRatingSchema,
  recruiterJobApplicationsQuerySchema,
  recruiterUpdateStatusSchema,
  listApplicationsQuerySchema,
} from "../validators/application.validator.js";
import {
  candidateApplyRateLimit,
  recruiterApplicationRateLimit,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post(
  "/",
  candidateApplyRateLimit,
  asyncHandler(protect),
  validate(applyJobSchema),
  asyncHandler(ApplicationController.applyToJob),
);

router.get(
  "/me",
  asyncHandler(protect),
  validate(listApplicationsQuerySchema),
  asyncHandler(ApplicationController.listMyApplications),
);

router.get(
  "/me/:applicationId",
  asyncHandler(protect),
  validate(applicationIdParamSchema),
  asyncHandler(ApplicationController.getMyApplication),
);

router.post(
  "/me/:applicationId/withdraw",
  asyncHandler(protect),
  validate(applicationIdParamSchema),
  asyncHandler(ApplicationController.withdrawApplication),
);

router.get(
  "/recruiter/jobs/:jobId",
  recruiterApplicationRateLimit,
  asyncHandler(protect),
  validate(recruiterJobApplicationsQuerySchema),
  asyncHandler(ApplicationController.listApplicationsForJob),
);

router.get(
  "/recruiter/:applicationId",
  recruiterApplicationRateLimit,
  asyncHandler(protect),
  validate(applicationIdParamSchema),
  asyncHandler(ApplicationController.getRecruiterApplicationDetail),
);

router.post(
  "/recruiter/:applicationId/status",
  recruiterApplicationRateLimit,
  asyncHandler(protect),
  validate(recruiterUpdateStatusSchema),
  asyncHandler(ApplicationController.updateApplicationStatus),
);

router.post(
  "/recruiter/:applicationId/note",
  recruiterApplicationRateLimit,
  asyncHandler(protect),
  validate(recruiterAddNoteSchema),
  asyncHandler(ApplicationController.addRecruiterNote),
);

router.post(
  "/recruiter/:applicationId/rating",
  recruiterApplicationRateLimit,
  asyncHandler(protect),
  validate(recruiterAddRatingSchema),
  asyncHandler(ApplicationController.addRecruiterRating),
);

router.get(
  "/recruiter/jobs/:jobId/analytics",
  recruiterApplicationRateLimit,
  asyncHandler(protect),
  validate(recruiterJobApplicationsQuerySchema),
  asyncHandler(ApplicationController.getJobApplicationAnalytics),
);

export default router;
