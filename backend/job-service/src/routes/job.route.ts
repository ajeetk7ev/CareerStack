import { Router } from "express";
import { JobController } from "../controllers/job.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createJobSchema,
  updateJobSchema,
  jobIdParamSchema,
  companyIdParamSchema,
  slugParamSchema,
  listJobsQuerySchema,
} from "../validators/job.validator.js";

const router = Router();

router.get(
  "/public",
  validate(listJobsQuerySchema),
  asyncHandler(JobController.listPublicJobs),
);
router.get(
  "/public/:slug",
  validate(slugParamSchema),
  asyncHandler(JobController.getPublicJobBySlug),
);

router.post(
  "/companies/:companyId",
  asyncHandler(protect),
  validate(companyIdParamSchema),
  validate(createJobSchema),
  asyncHandler(JobController.createJob),
);
router.get(
  "/companies/:companyId",
  asyncHandler(protect),
  validate(companyIdParamSchema),
  validate(listJobsQuerySchema),
  asyncHandler(JobController.listRecruiterJobs),
);
router.get(
  "/companies/:companyId/:jobId",
  asyncHandler(protect),
  validate(companyIdParamSchema),
  validate(jobIdParamSchema),
  asyncHandler(JobController.getRecruiterJob),
);
router.patch(
  "/companies/:companyId/:jobId",
  asyncHandler(protect),
  validate(companyIdParamSchema),
  validate(updateJobSchema),
  asyncHandler(JobController.updateJob),
);
router.post(
  "/companies/:companyId/:jobId/publish",
  asyncHandler(protect),
  validate(companyIdParamSchema),
  validate(jobIdParamSchema),
  asyncHandler(JobController.publishJob),
);
router.post(
  "/companies/:companyId/:jobId/unpublish",
  asyncHandler(protect),
  validate(companyIdParamSchema),
  validate(jobIdParamSchema),
  asyncHandler(JobController.unpublishJob),
);
router.post(
  "/companies/:companyId/:jobId/close",
  asyncHandler(protect),
  validate(companyIdParamSchema),
  validate(jobIdParamSchema),
  asyncHandler(JobController.closeJob),
);
router.post(
  "/companies/:companyId/:jobId/duplicate",
  asyncHandler(protect),
  validate(companyIdParamSchema),
  validate(jobIdParamSchema),
  asyncHandler(JobController.duplicateJob),
);
router.delete(
  "/companies/:companyId/:jobId",
  asyncHandler(protect),
  validate(companyIdParamSchema),
  validate(jobIdParamSchema),
  asyncHandler(JobController.deleteDraftJob),
);

export default router;
