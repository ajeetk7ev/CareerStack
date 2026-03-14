import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addEducationSchema,
  addExperienceSchema,
  addProjectSchema,
  addSkillSchema,
  createProfileSchema,
  itemIdParamSchema,
  updateProfileSchema,
} from "../validators/user.validator.js";

const router = Router();

router.post(
  "/profile",
  asyncHandler(protect),
  validate(createProfileSchema),
  asyncHandler(UserController.createProfile),
);
router.get(
  "/profile/me",
  asyncHandler(protect),
  asyncHandler(UserController.getMyProfile),
);
router.patch(
  "/profile/me",
  asyncHandler(protect),
  validate(updateProfileSchema),
  asyncHandler(UserController.updateProfile),
);
router.get(
  "/profile/:authUserId",
  asyncHandler(UserController.getProfileByAuthUserId),
);

router.post(
  "/skills",
  asyncHandler(protect),
  validate(addSkillSchema),
  asyncHandler(UserController.addSkill),
);
router.patch(
  "/skills/:id",
  asyncHandler(protect),
  validate(itemIdParamSchema),
  asyncHandler(UserController.updateSkill),
);
router.delete(
  "/skills/:id",
  asyncHandler(protect),
  validate(itemIdParamSchema),
  asyncHandler(UserController.deleteSkill),
);

router.post(
  "/educations",
  asyncHandler(protect),
  validate(addEducationSchema),
  asyncHandler(UserController.addEducation),
);
router.patch(
  "/educations/:id",
  asyncHandler(protect),
  validate(itemIdParamSchema),
  asyncHandler(UserController.updateEducation),
);
router.delete(
  "/educations/:id",
  asyncHandler(protect),
  validate(itemIdParamSchema),
  asyncHandler(UserController.deleteEducation),
);

router.post(
  "/experiences",
  asyncHandler(protect),
  validate(addExperienceSchema),
  asyncHandler(UserController.addExperience),
);
router.patch(
  "/experiences/:id",
  asyncHandler(protect),
  validate(itemIdParamSchema),
  asyncHandler(UserController.updateExperience),
);
router.delete(
  "/experiences/:id",
  asyncHandler(protect),
  validate(itemIdParamSchema),
  asyncHandler(UserController.deleteExperience),
);

router.post(
  "/projects",
  asyncHandler(protect),
  validate(addProjectSchema),
  asyncHandler(UserController.addProject),
);
router.patch(
  "/projects/:id",
  asyncHandler(protect),
  validate(itemIdParamSchema),
  asyncHandler(UserController.updateProject),
);
router.delete(
  "/projects/:id",
  asyncHandler(protect),
  validate(itemIdParamSchema),
  asyncHandler(UserController.deleteProject),
);

export default router;
