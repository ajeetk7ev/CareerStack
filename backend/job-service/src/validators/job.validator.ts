import { z } from "zod";

const employmentTypeEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERN",
  "FREELANCE",
]);
const workplaceTypeEnum = z.enum(["ONSITE", "REMOTE", "HYBRID"]);
const experienceLevelEnum = z.enum([
  "FRESHER",
  "JUNIOR",
  "MID",
  "SENIOR",
  "LEAD",
  "MANAGER",
  "DIRECTOR",
]);
const visibilityEnum = z.enum(["PUBLIC", "PRIVATE"]);
const currencyEnum = z.enum(["INR", "USD", "EUR", "GBP"]);
const statusEnum = z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED", "CLOSED"]);

const skillSchema = z.object({
  name: z.string().trim().min(1).max(50),
  isRequired: z.boolean().default(true),
});

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(150),
    summary: z.string().trim().max(300).optional(),
    description: z.string().trim().min(20).max(20000),
    responsibilities: z
      .array(z.string().trim().min(1).max(300))
      .max(50)
      .default([]),
    requirements: z
      .array(z.string().trim().min(1).max(300))
      .max(50)
      .default([]),
    benefits: z.array(z.string().trim().min(1).max(300)).max(50).default([]),
    preferredQualifications: z
      .array(z.string().trim().min(1).max(300))
      .max(50)
      .default([]),
    tags: z.array(z.string().trim().min(1).max(50)).max(30).default([]),

    employmentType: employmentTypeEnum,
    workplaceType: workplaceTypeEnum,
    experienceLevel: experienceLevelEnum,
    minExperienceYears: z.number().min(0).max(50).optional(),
    maxExperienceYears: z.number().min(0).max(50).optional(),

    minSalary: z.number().int().min(0).optional(),
    maxSalary: z.number().int().min(0).optional(),
    currency: currencyEnum.optional(),
    isSalaryVisible: z.boolean().default(true),

    openingsCount: z.number().int().min(1).max(10000).default(1),
    applicationDeadline: z.string().datetime().optional(),
    isUrgent: z.boolean().default(false),
    visibility: visibilityEnum.default("PUBLIC"),

    country: z.string().trim().max(100).optional(),
    state: z.string().trim().max(100).optional(),
    city: z.string().trim().max(100).optional(),
    locationText: z.string().trim().max(200).optional(),

    skills: z.array(skillSchema).max(100).default([]),
  }),
});

export const updateJobSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(150).optional(),
    summary: z.string().trim().max(300).optional(),
    description: z.string().trim().min(20).max(20000).optional(),
    responsibilities: z
      .array(z.string().trim().min(1).max(300))
      .max(50)
      .optional(),
    requirements: z.array(z.string().trim().min(1).max(300)).max(50).optional(),
    benefits: z.array(z.string().trim().min(1).max(300)).max(50).optional(),
    preferredQualifications: z
      .array(z.string().trim().min(1).max(300))
      .max(50)
      .optional(),
    tags: z.array(z.string().trim().min(1).max(50)).max(30).optional(),

    employmentType: employmentTypeEnum.optional(),
    workplaceType: workplaceTypeEnum.optional(),
    experienceLevel: experienceLevelEnum.optional(),
    minExperienceYears: z.number().min(0).max(50).optional(),
    maxExperienceYears: z.number().min(0).max(50).optional(),

    minSalary: z.number().int().min(0).optional(),
    maxSalary: z.number().int().min(0).optional(),
    currency: currencyEnum.optional(),
    isSalaryVisible: z.boolean().optional(),

    openingsCount: z.number().int().min(1).max(10000).optional(),
    applicationDeadline: z.string().datetime().optional(),
    isUrgent: z.boolean().optional(),
    visibility: visibilityEnum.optional(),

    country: z.string().trim().max(100).optional(),
    state: z.string().trim().max(100).optional(),
    city: z.string().trim().max(100).optional(),
    locationText: z.string().trim().max(200).optional(),

    skills: z.array(skillSchema).max(100).optional(),
  }),
});

export const jobIdParamSchema = z.object({
  params: z.object({
    jobId: z.string().min(1),
  }),
});

export const companyIdParamSchema = z.object({
  params: z.object({
    companyId: z.string().min(1),
  }),
});

export const slugParamSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
});

export const listJobsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    keyword: z.string().trim().optional(),
    status: statusEnum.optional(),
    employmentType: employmentTypeEnum.optional(),
    workplaceType: workplaceTypeEnum.optional(),
    experienceLevel: experienceLevelEnum.optional(),
    city: z.string().trim().optional(),
    country: z.string().trim().optional(),
    companyId: z.string().trim().optional(),
    minSalary: z.coerce.number().int().min(0).optional(),
    maxSalary: z.coerce.number().int().min(0).optional(),
    skill: z.string().trim().optional(),
    sortBy: z
      .enum(["newest", "oldest", "salaryHigh", "salaryLow"])
      .default("newest"),
  }),
});
