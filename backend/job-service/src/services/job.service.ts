import { JobStatus, Prisma } from "../generated/prisma/client.js";
import { JobRepository } from "../repositories/job.repositores.js";
import { CompanyClientService } from "./company-client.service.js";
import { JobEventService } from "./job-event.service.js";
import { CacheService } from "./cache.service.js";
import { AppError } from "../utils/AppError.js";
import { generateSlug } from "../utils/slug.js";
import { getPagination } from "../utils/pagination.js";

export class JobService {
  private jobRepository: JobRepository;
  private companyClientService: CompanyClientService;
  private jobEventService: JobEventService;

  constructor() {
    this.jobRepository = new JobRepository();
    this.companyClientService = new CompanyClientService();
    this.jobEventService = new JobEventService();
  }

  private async generateUniqueSlug(title: string) {
    const baseSlug = generateSlug(title) || `job-${Date.now()}`;
    let finalSlug = baseSlug;
    let counter = 1;

    while (await this.jobRepository.findJobBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return finalSlug;
  }

  private getSortOrder(
    sortBy: "newest" | "oldest" | "salaryHigh" | "salaryLow",
  ): Prisma.JobOrderByWithRelationInput {
    switch (sortBy) {
      case "oldest":
        return { createdAt: "asc" };
      case "salaryHigh":
        return { maxSalary: "desc" };
      case "salaryLow":
        return { minSalary: "asc" };
      case "newest":
      default:
        return { createdAt: "desc" };
    }
  }

  async createJob(
    authUserId: string,
    companyId: string,
    cookieHeader: string | undefined,
    payload: {
      title: string;
      summary?: string;
      description: string;
      responsibilities: string[];
      requirements: string[];
      benefits: string[];
      preferredQualifications: string[];
      tags: string[];
      employmentType: any;
      workplaceType: any;
      experienceLevel: any;
      minExperienceYears?: number;
      maxExperienceYears?: number;
      minSalary?: number;
      maxSalary?: number;
      currency?: any;
      isSalaryVisible: boolean;
      openingsCount: number;
      applicationDeadline?: string;
      isUrgent: boolean;
      visibility: any;
      country?: string;
      state?: string;
      city?: string;
      locationText?: string;
      skills: { name: string; isRequired: boolean }[];
    },
  ) {
    const company = await this.companyClientService.verifyMembership(
      companyId,
      cookieHeader,
    );

    const slug = await this.generateUniqueSlug(payload.title);

    const job = await this.jobRepository.createJob({
      title: payload.title,
      slug,
      summary: payload.summary,
      description: payload.description,
      responsibilities: payload.responsibilities,
      requirements: payload.requirements,
      benefits: payload.benefits,
      preferredQualifications: payload.preferredQualifications,
      tags: payload.tags,
      employmentType: payload.employmentType,
      workplaceType: payload.workplaceType,
      experienceLevel: payload.experienceLevel,
      minExperienceYears: payload.minExperienceYears,
      maxExperienceYears: payload.maxExperienceYears,
      minSalary: payload.minSalary,
      maxSalary: payload.maxSalary,
      currency: payload.currency,
      isSalaryVisible: payload.isSalaryVisible,
      openingsCount: payload.openingsCount,
      applicationDeadline: payload.applicationDeadline
        ? new Date(payload.applicationDeadline)
        : undefined,
      isUrgent: payload.isUrgent,
      visibility: payload.visibility,
      country: payload.country,
      state: payload.state,
      city: payload.city,
      locationText: payload.locationText,
      companyId: company.companyId,
      companyNameSnapshot: company.company?.name || "Company",
      companySlugSnapshot: company.company?.slug || "company",
      companyLogoSnapshot: company.company?.logoUrl || null,
      createdByAuthUserId: authUserId,
      skills: {
        create: payload.skills.map(
          (skill: { name: string; isRequired: boolean }) => ({
            name: skill.name,
            isRequired: skill.isRequired,
          }),
        ),
      },
    });

    await this.jobEventService.publishJobCreated({
      jobId: job.id,
      companyId: company.companyId,
      createdByAuthUserId: authUserId,
    });

    await this.invalidatePublicCache();

    return job;
  }

  async getRecruiterJob(
    authUserId: string,
    companyId: string,
    cookieHeader: string | undefined,
    jobId: string,
  ) {
    const company = await this.companyClientService.verifyMembership(
      companyId,
      cookieHeader,
    );

    const job = await this.jobRepository.findRecruiterJobById(
      jobId,
      company.companyId,
    );

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    return job;
  }

  async getPublicJobBySlug(slug: string) {
    const cacheKey = `job:public:slug:${slug}`;
    const cachedJob = await CacheService.get<any>(cacheKey);

    if (cachedJob) return cachedJob;

    const job = await this.jobRepository.findJobBySlug(slug);

    if (
      !job ||
      job.status !== JobStatus.PUBLISHED ||
      job.visibility !== "PUBLIC"
    ) {
      throw new AppError("Job not found", 404);
    }

    await CacheService.set(cacheKey, job);
    return job;
  }

  async updateJob(
    authUserId: string,
    companyId: string,
    cookieHeader: string | undefined,
    jobId: string,
    payload: Record<string, any>,
  ) {
    const company = await this.companyClientService.verifyMembership(
      companyId,
      cookieHeader,
    );

    const existingJob = await this.jobRepository.findRecruiterJobById(
      jobId,
      company.companyId,
    );

    if (!existingJob) {
      throw new AppError("Job not found", 404);
    }

    const updateData: Prisma.JobUpdateInput = {
      updatedByAuthUserId: authUserId,
    };

    if (payload.title && payload.title !== existingJob.title) {
      updateData.title = payload.title;
      updateData.slug = await this.generateUniqueSlug(payload.title);
    }

    if (payload.summary !== undefined) updateData.summary = payload.summary;
    if (payload.description !== undefined)
      updateData.description = payload.description;
    if (payload.responsibilities !== undefined)
      updateData.responsibilities = payload.responsibilities;
    if (payload.requirements !== undefined)
      updateData.requirements = payload.requirements;
    if (payload.benefits !== undefined) updateData.benefits = payload.benefits;
    if (payload.preferredQualifications !== undefined)
      updateData.preferredQualifications = payload.preferredQualifications;
    if (payload.tags !== undefined) updateData.tags = payload.tags;
    if (payload.employmentType !== undefined)
      updateData.employmentType = payload.employmentType;
    if (payload.workplaceType !== undefined)
      updateData.workplaceType = payload.workplaceType;
    if (payload.experienceLevel !== undefined)
      updateData.experienceLevel = payload.experienceLevel;
    if (payload.minExperienceYears !== undefined)
      updateData.minExperienceYears = payload.minExperienceYears;
    if (payload.maxExperienceYears !== undefined)
      updateData.maxExperienceYears = payload.maxExperienceYears;
    if (payload.minSalary !== undefined)
      updateData.minSalary = payload.minSalary;
    if (payload.maxSalary !== undefined)
      updateData.maxSalary = payload.maxSalary;
    if (payload.currency !== undefined) updateData.currency = payload.currency;
    if (payload.isSalaryVisible !== undefined)
      updateData.isSalaryVisible = payload.isSalaryVisible;
    if (payload.openingsCount !== undefined)
      updateData.openingsCount = payload.openingsCount;
    if (payload.applicationDeadline !== undefined) {
      updateData.applicationDeadline = payload.applicationDeadline
        ? new Date(payload.applicationDeadline)
        : null;
    }
    if (payload.isUrgent !== undefined) updateData.isUrgent = payload.isUrgent;
    if (payload.visibility !== undefined)
      updateData.visibility = payload.visibility;
    if (payload.country !== undefined) updateData.country = payload.country;
    if (payload.state !== undefined) updateData.state = payload.state;
    if (payload.city !== undefined) updateData.city = payload.city;
    if (payload.locationText !== undefined)
      updateData.locationText = payload.locationText;

    const updatedJob = await this.jobRepository.updateJob(jobId, updateData);

    if (payload.skills) {
      await this.jobRepository.replaceSkills(jobId, payload.skills);
    }

    const finalJob = await this.jobRepository.findJobById(jobId);

    await this.jobEventService.publishJobUpdated({
      jobId,
      companyId: company.companyId,
      updatedByAuthUserId: authUserId,
    });

    await this.invalidatePublicCache(jobId, existingJob.slug);

    return finalJob || updatedJob;
  }

  async publishJob(
    authUserId: string,
    companyId: string,
    cookieHeader: string | undefined,
    jobId: string,
  ) {
    const company = await this.companyClientService.verifyMembership(
      companyId,
      cookieHeader,
    );

    const job = await this.jobRepository.findRecruiterJobById(
      jobId,
      company.companyId,
    );

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    if (job.status === JobStatus.PUBLISHED) {
      throw new AppError("Job is already published", 400);
    }

    if (
      !job.title ||
      !job.description ||
      !job.employmentType ||
      !job.workplaceType ||
      !job.experienceLevel
    ) {
      throw new AppError("Job is missing required fields to publish", 400);
    }

    const updated = await this.jobRepository.updateJob(jobId, {
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      updatedByAuthUserId: authUserId,
    });

    await this.jobEventService.publishJobPublished({
      jobId,
      companyId: company.companyId,
      updatedByAuthUserId: authUserId,
    });

    await this.invalidatePublicCache(jobId, job.slug);

    return updated;
  }

  async unpublishJob(
    authUserId: string,
    companyId: string,
    cookieHeader: string | undefined,
    jobId: string,
  ) {
    const company = await this.companyClientService.verifyMembership(
      companyId,
      cookieHeader,
    );

    const job = await this.jobRepository.findRecruiterJobById(
      jobId,
      company.companyId,
    );

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    const updated = await this.jobRepository.updateJob(jobId, {
      status: JobStatus.UNPUBLISHED,
      updatedByAuthUserId: authUserId,
    });

    await this.jobEventService.publishJobUnpublished({
      jobId,
      companyId: company.companyId,
      updatedByAuthUserId: authUserId,
    });

    await this.invalidatePublicCache(jobId, job.slug);

    return updated;
  }

  async closeJob(
    authUserId: string,
    companyId: string,
    cookieHeader: string | undefined,
    jobId: string,
  ) {
    const company = await this.companyClientService.verifyMembership(
      companyId,
      cookieHeader,
    );

    const job = await this.jobRepository.findRecruiterJobById(
      jobId,
      company.companyId,
    );

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    const updated = await this.jobRepository.updateJob(jobId, {
      status: JobStatus.CLOSED,
      closedAt: new Date(),
      updatedByAuthUserId: authUserId,
    });

    await this.jobEventService.publishJobClosed({
      jobId,
      companyId: company.companyId,
      updatedByAuthUserId: authUserId,
    });

    await this.invalidatePublicCache(jobId, job.slug);

    return updated;
  }

  async deleteDraftJob(
    authUserId: string,
    companyId: string,
    cookieHeader: string | undefined,
    jobId: string,
  ) {
    const company = await this.companyClientService.verifyMembership(
      companyId,
      cookieHeader,
    );

    const job = await this.jobRepository.findRecruiterJobById(
      jobId,
      company.companyId,
    );

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    if (job.status !== JobStatus.DRAFT) {
      throw new AppError("Only draft jobs can be deleted", 400);
    }

    await this.jobRepository.deleteJob(jobId);

    await this.jobEventService.publishJobDeleted({
      jobId,
      companyId: company.companyId,
      deletedByAuthUserId: authUserId,
    });

    await this.invalidatePublicCache(jobId, job.slug);
  }

  async duplicateJob(
    authUserId: string,
    companyId: string,
    cookieHeader: string | undefined,
    jobId: string,
  ) {
    const company = await this.companyClientService.verifyMembership(
      companyId,
      cookieHeader,
    );

    const existingJob = await this.jobRepository.findRecruiterJobById(
      jobId,
      company.companyId,
    );

    if (!existingJob) {
      throw new AppError("Job not found", 404);
    }

    const slug = await this.generateUniqueSlug(`${existingJob.title} copy`);

    return this.jobRepository.createJob({
      title: `${existingJob.title} Copy`,
      slug,
      summary: existingJob.summary,
      description: existingJob.description,
      responsibilities: existingJob.responsibilities,
      requirements: existingJob.requirements,
      benefits: existingJob.benefits,
      preferredQualifications: existingJob.preferredQualifications,
      tags: existingJob.tags,
      status: JobStatus.DRAFT,
      visibility: existingJob.visibility,
      employmentType: existingJob.employmentType,
      workplaceType: existingJob.workplaceType,
      experienceLevel: existingJob.experienceLevel,
      minExperienceYears: existingJob.minExperienceYears,
      maxExperienceYears: existingJob.maxExperienceYears,
      minSalary: existingJob.minSalary,
      maxSalary: existingJob.maxSalary,
      currency: existingJob.currency,
      isSalaryVisible: existingJob.isSalaryVisible,
      openingsCount: existingJob.openingsCount,
      applicationDeadline: existingJob.applicationDeadline,
      isUrgent: existingJob.isUrgent,
      country: existingJob.country,
      state: existingJob.state,
      city: existingJob.city,
      locationText: existingJob.locationText,
      companyId: existingJob.companyId,
      companyNameSnapshot: existingJob.companyNameSnapshot,
      companySlugSnapshot: existingJob.companySlugSnapshot,
      companyLogoSnapshot: existingJob.companyLogoSnapshot,
      createdByAuthUserId: authUserId,
      skills: {
        create: existingJob.skills.map((skill: { name: string; isRequired: boolean }) => ({
          name: skill.name,
          isRequired: skill.isRequired,
        })),
      },
    });
  }

  async listRecruiterJobs(
    authUserId: string,
    companyId: string,
    cookieHeader: string | undefined,
    query: any,
  ) {
    const company = await this.companyClientService.verifyMembership(
      companyId,
      cookieHeader,
    );

    const { page, limit, skip } = getPagination({
      page: query.page,
      limit: query.limit,
    });

    return this.jobRepository.listRecruiterJobs({
      companyId: company.companyId,
      page,
      limit,
      skip,
      filters: {
        status: query.status,
        keyword: query.keyword,
        employmentType: query.employmentType,
        workplaceType: query.workplaceType,
        experienceLevel: query.experienceLevel,
        city: query.city,
        country: query.country,
      },
      orderBy: this.getSortOrder(query.sortBy),
    });
  }

  async listPublicJobs(query: any) {
    const cacheKey = `job:public:list:${JSON.stringify(query)}`;
    const cachedJobs = await CacheService.get<any>(cacheKey);

    if (cachedJobs) return cachedJobs;

    const { page, limit, skip } = getPagination({
      page: query.page,
      limit: query.limit,
    });

    const jobs = await this.jobRepository.listPublicJobs({
      page,
      limit,
      skip,
      filters: {
        keyword: query.keyword,
        employmentType: query.employmentType,
        workplaceType: query.workplaceType,
        experienceLevel: query.experienceLevel,
        city: query.city,
        country: query.country,
        companyId: query.companyId,
        minSalary: query.minSalary,
        maxSalary: query.maxSalary,
        skill: query.skill,
      },
      orderBy: this.getSortOrder(query.sortBy),
    });

    await CacheService.set(cacheKey, jobs);
    return jobs;
  }

  private async invalidatePublicCache(jobId?: string, slug?: string) {
    await CacheService.delByPattern("job:public:list:*");
    if (slug) {
      await CacheService.del(`job:public:slug:${slug}`);
    }
  }
}
