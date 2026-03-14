import { Router } from "express";
import { CompanyController } from "../controllers/company.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  acceptInviteSchema,
  createCompanySchema,
  inviteIdParamSchema,
  inviteRecruiterSchema,
  memberIdParamSchema,
  slugParamSchema,
  updateCompanySchema,
  updateMemberRoleSchema,
} from "../validators/company.validator.js";

const router = Router();

router.post(
  "/",
  asyncHandler(protect),
  validate(createCompanySchema),
  asyncHandler(CompanyController.createCompany),
);
router.get(
  "/:companyId/membership",
  asyncHandler(protect),
  asyncHandler(CompanyController.checkMembership),
);
router.get(
  "/me",
  asyncHandler(protect),
  asyncHandler(CompanyController.getMyCompany),
);
router.patch(
  "/me",
  asyncHandler(protect),
  validate(updateCompanySchema),
  asyncHandler(CompanyController.updateMyCompany),
);

router.get(
  "/slug/:slug",
  validate(slugParamSchema),
  asyncHandler(CompanyController.getCompanyBySlug),
);

router.get(
  "/members/me",
  asyncHandler(protect),
  asyncHandler(CompanyController.listMyCompanyMembers),
);
router.post(
  "/invites",
  asyncHandler(protect),
  validate(inviteRecruiterSchema),
  asyncHandler(CompanyController.inviteRecruiter),
);
router.post(
  "/invites/accept",
  asyncHandler(protect),
  validate(acceptInviteSchema),
  asyncHandler(CompanyController.acceptInvite),
);
router.patch(
  "/members/:memberId/role",
  asyncHandler(protect),
  validate(updateMemberRoleSchema),
  asyncHandler(CompanyController.updateMemberRole),
);
router.delete(
  "/members/:memberId",
  asyncHandler(protect),
  validate(memberIdParamSchema),
  asyncHandler(CompanyController.removeMember),
);
router.delete(
  "/invites/:inviteId",
  asyncHandler(protect),
  validate(inviteIdParamSchema),
  asyncHandler(CompanyController.cancelInvite),
);

export default router;
