import { z } from "zod";

export const applyJobSchema = z.object({
  body: z.object({
    jobId: z.string().cuid(),
    coverLetter: z.string().max(5000).optional(),
    screeningAnswers: z
      .array(
        z.object({
          question: z.string().min(1).max(500),
          answer: z.string().min(1).max(2000),
        }),
      )
      .optional(),
  }),
});

export const applicationIdParamSchema = z.object({
  params: z.object({
    applicationId: z.string().cuid(),
  }),
});

export const recruiterUpdateStatusSchema = z.object({
  params: z.object({
    applicationId: z.string().cuid(),
  }),
  body: z.object({
    status: z.enum([
      "UNDER_REVIEW",
      "SHORTLISTED",
      "INTERVIEW_SCHEDULED",
      "INTERVIEWED",
      "OFFERED",
      "HIRED",
      "REJECTED",
    ]),
    note: z.string().max(2000).optional(),
  }),
});

export const recruiterAddNoteSchema = z.object({
  params: z.object({
    applicationId: z.string().cuid(),
  }),
  body: z.object({
    recruiterNotes: z.string().min(1).max(3000),
  }),
});

export const recruiterAddRatingSchema = z.object({
  params: z.object({
    applicationId: z.string().cuid(),
  }),
  body: z.object({
    recruiterRating: z.number().int().min(1).max(5),
  }),
});

export const listApplicationsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    status: z.string().optional(),
    keyword: z.string().optional(),
  }),
});

export const recruiterJobApplicationsQuerySchema = z.object({
  params: z.object({
    jobId: z.string().cuid(),
  }),
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    status: z.string().optional(),
    keyword: z.string().optional(),
  }),
});
