import { z } from "zod";

export const createProfileSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(100),
    headline: z.string().trim().max(150).optional(),
    bio: z.string().trim().max(1000).optional(),
    phone: z.string().trim().max(20).optional(),
    location: z.string().trim().max(100).optional(),
    currentCompany: z.string().trim().max(100).optional(),
    currentRole: z.string().trim().max(100).optional(),
    totalExperience: z.number().min(0).max(50).optional(),
    expectedSalary: z.number().min(0).optional(),
    noticePeriodDays: z.number().int().min(0).max(365).optional(),
    profilePicture: z.string().url().optional(),
    resumeUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    linkedinUrl: z.string().url().optional(),
    portfolioUrl: z.string().url().optional(),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(100).optional(),
    headline: z.string().trim().max(150).optional(),
    bio: z.string().trim().max(1000).optional(),
    phone: z.string().trim().max(20).optional(),
    location: z.string().trim().max(100).optional(),
    currentCompany: z.string().trim().max(100).optional(),
    currentRole: z.string().trim().max(100).optional(),
    totalExperience: z.number().min(0).max(50).optional(),
    expectedSalary: z.number().min(0).optional(),
    noticePeriodDays: z.number().int().min(0).max(365).optional(),
    profilePicture: z.string().url().optional(),
    resumeUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    linkedinUrl: z.string().url().optional(),
    portfolioUrl: z.string().url().optional(),
  }),
});

export const addSkillSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(50),
    level: z.string().trim().max(50).optional(),
  }),
});

export const addEducationSchema = z.object({
  body: z.object({
    institution: z.string().trim().min(2).max(150),
    degree: z.string().trim().min(2).max(100),
    fieldOfStudy: z.string().trim().max(100).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    grade: z.string().trim().max(50).optional(),
    description: z.string().trim().max(1000).optional(),
  }),
});

export const addExperienceSchema = z.object({
  body: z.object({
    companyName: z.string().trim().min(2).max(150),
    role: z.string().trim().min(2).max(100),
    employmentType: z.string().trim().max(50).optional(),
    location: z.string().trim().max(100).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    isCurrent: z.boolean().optional(),
    description: z.string().trim().max(1500).optional(),
  }),
});

export const addProjectSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(150),
    description: z.string().trim().max(1500).optional(),
    projectUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    techStack: z.string().trim().max(500).optional(),
  }),
});

export const itemIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
