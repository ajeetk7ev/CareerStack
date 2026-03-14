import { z } from "zod";

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(150),
    tagline: z.string().trim().max(200).optional(),
    description: z.string().trim().max(3000).optional(),
    website: z.string().url().optional(),
    logoUrl: z.string().url().optional(),
    bannerUrl: z.string().url().optional(),
    industry: z.string().trim().max(100).optional(),
    companySize: z.string().trim().max(50).optional(),
    foundedYear: z.number().int().min(1800).max(2100).optional(),
    location: z.string().trim().max(150).optional(),
    email: z.string().email().optional(),
    phone: z.string().trim().max(20).optional(),
  }),
});

export const updateCompanySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(150).optional(),
    tagline: z.string().trim().max(200).optional(),
    description: z.string().trim().max(3000).optional(),
    website: z.string().url().optional(),
    logoUrl: z.string().url().optional(),
    bannerUrl: z.string().url().optional(),
    industry: z.string().trim().max(100).optional(),
    companySize: z.string().trim().max(50).optional(),
    foundedYear: z.number().int().min(1800).max(2100).optional(),
    location: z.string().trim().max(150).optional(),
    email: z.string().email().optional(),
    phone: z.string().trim().max(20).optional(),
  }),
});

export const inviteRecruiterSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    role: z.enum(["ADMIN", "RECRUITER"]).default("RECRUITER"),
  }),
});

export const acceptInviteSchema = z.object({
  body: z.object({
    token: z.string().min(1),
  }),
});

export const updateMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(["ADMIN", "RECRUITER"]),
  }),
  params: z.object({
    memberId: z.string().min(1),
  }),
});

export const memberIdParamSchema = z.object({
  params: z.object({
    memberId: z.string().min(1),
  }),
});

export const companyIdParamSchema = z.object({
  params: z.object({
    companyId: z.string().min(1),
  }),
});

export const inviteIdParamSchema = z.object({
  params: z.object({
    inviteId: z.string().min(1),
  }),
});

export const slugParamSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
});
