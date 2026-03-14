import { ApplicationStatus } from "../generated/prisma/enums.js";
import { ApplicationRepository } from "../repositories/application.repository.js";
import { JobClientService } from "./job-client.service.js";
import { UserClientService } from "./user-client.service.js";
import { CacheService } from "./cache.service.js";
import { ApplicationEventService } from "./application-event.service.js";
import { AppError } from "../utils/AppError.js";
import { getPagination } from "../utils/pagination.js";
import { CACHE_KEYS } from "../constants/cache.constant.js";

export class ApplicationService {
  private repository = new ApplicationRepository();
  private jobClient = new JobClientService();
  private userClient = new UserClientService();
  private cacheService = new CacheService();
  private eventService = new ApplicationEventService();

  private async invalidateApplicationCaches(
    authUserId: string,
    applicationId: string,
    jobId: string,
  ) {
    await this.cacheService.invalidateByPattern(
      `application:my:${authUserId}:*`,
    );
    await this.cacheService.invalidateByPattern(`application:job:${jobId}:*`);
    await this.cacheService.del(CACHE_KEYS.APPLICATION_DETAIL(applicationId));
    await this.cacheService.del(CACHE_KEYS.JOB_ANALYTICS(jobId));
  }

  async applyToJob(
    authUserId: string,
    cookieHeader: string | undefined,
    payload: any,
  ) {
    const existing = await this.repository.findByUserAndJob(
      authUserId,
      payload.jobId,
    );

    if (existing) {
      throw new AppError("You have already applied to this job", 409);
    }

    const [job, profile] = await Promise.all([
      this.jobClient.getPublicJobById(payload.jobId, cookieHeader),
      this.userClient.getMyProfile(cookieHeader),
    ]);

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    const application = await this.repository.create({
      authUserId,
      jobId: job.id,
      companyId: job.companyId,
      status: ApplicationStatus.SUBMITTED,
      jobTitleSnapshot: job.title,
      jobSlugSnapshot: job.slug,
      companyNameSnapshot: job.companyNameSnapshot,
      jobLocationSnapshot: job.locationText,
      employmentTypeSnapshot: job.employmentType,
      workplaceTypeSnapshot: job.workplaceType,
      candidateNameSnapshot: profile.fullName,
      candidateEmailSnapshot: profile.email,
      candidatePhoneSnapshot: profile.phone,
      candidateHeadlineSnapshot: profile.headline,
      candidateResumeUrlSnapshot: profile.resumeUrl,
      candidateExperienceSummary: profile.bio,
      coverLetter: payload.coverLetter,
      screeningAnswers: payload.screeningAnswers || [],
      statusHistory: {
        create: {
          fromStatus: null,
          toStatus: ApplicationStatus.SUBMITTED,
          changedByUserId: authUserId,
          note: "Application submitted",
        },
      },
    });

    await this.invalidateApplicationCaches(authUserId, application.id, job.id);

    await this.eventService.publishCreated({
      applicationId: application.id,
      authUserId,
      jobId: job.id,
      companyId: job.companyId,
    });

    return application;
  }

  async listMyApplications(authUserId: string, query: any) {
    const cacheKey = CACHE_KEYS.MY_APPLICATIONS(
      authUserId,
      JSON.stringify(
        Object.entries(query).sort(([a], [b]) => a.localeCompare(b)),
      ),
    );

    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const { page, limit, skip } = getPagination({
      page: query.page,
      limit: query.limit,
    });

    const result = await this.repository.listMyApplications({
      authUserId,
      skip,
      limit,
      filters: {
        status: query.status,
        keyword: query.keyword,
      },
    });

    await this.cacheService.set(cacheKey, result);
    return result;
  }

  async getMyApplication(authUserId: string, applicationId: string) {
    const cacheKey = CACHE_KEYS.APPLICATION_DETAIL(applicationId);
    const cached = await this.cacheService.get<any>(cacheKey);

    if (cached && cached.authUserId === authUserId) {
      return cached;
    }

    const application = await this.repository.findById(applicationId);

    if (!application || application.authUserId !== authUserId) {
      throw new AppError("Application not found", 404);
    }

    await this.cacheService.set(cacheKey, application);

    return application;
  }

  async withdrawApplication(authUserId: string, applicationId: string) {
    const application = await this.repository.findById(applicationId);

    if (!application || application.authUserId !== authUserId) {
      throw new AppError("Application not found", 404);
    }

    if (
      [
        ApplicationStatus.HIRED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.WITHDRAWN,
      ].includes(application.status)
    ) {
      throw new AppError("Application cannot be withdrawn", 400);
    }

    const updated = await this.repository.update(applicationId, {
      status: ApplicationStatus.WITHDRAWN,
      withdrawnAt: new Date(),
    });

    await this.repository.createStatusHistory({
      applicationId,
      fromStatus: application.status,
      toStatus: ApplicationStatus.WITHDRAWN,
      changedByUserId: authUserId,
      note: "Candidate withdrew application",
    });

    await this.invalidateApplicationCaches(
      authUserId,
      applicationId,
      application.jobId,
    );

    await this.eventService.publishWithdrawn({
      applicationId,
      authUserId,
      jobId: application.jobId,
      companyId: application.companyId,
    });

    return updated;
  }

  async listApplicationsForJob(
    authUserId: string,
    cookieHeader: string | undefined,
    jobId: string,
    query: any,
  ) {
    await this.jobClient.getRecruiterJobById(jobId, cookieHeader);

    const cacheKey = CACHE_KEYS.RECRUITER_JOB_APPLICATIONS(
      jobId,
      JSON.stringify(
        Object.entries(query).sort(([a], [b]) => a.localeCompare(b)),
      ),
    );

    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const { limit, skip } = getPagination({
      page: query.page,
      limit: query.limit,
    });

    const result = await this.repository.listApplicationsForJob({
      jobId,
      skip,
      limit,
      filters: {
        status: query.status,
        keyword: query.keyword,
      },
    });

    await this.cacheService.set(cacheKey, result);

    return result;
  }

  async getRecruiterApplicationDetail(
    _authUserId: string,
    cookieHeader: string | undefined,
    applicationId: string,
  ) {
    const application = await this.repository.findById(applicationId);

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    await this.jobClient.getRecruiterJobById(application.jobId, cookieHeader);

    return application;
  }

  async updateApplicationStatus(
    authUserId: string,
    cookieHeader: string | undefined,
    applicationId: string,
    payload: any,
  ) {
    const application = await this.repository.findById(applicationId);

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    await this.jobClient.getRecruiterJobById(application.jobId, cookieHeader);

    if (
      [
        ApplicationStatus.HIRED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.WITHDRAWN,
      ].includes(application.status)
    ) {
      throw new AppError("Finalized application cannot be updated", 400);
    }

    const data: Record<string, any> = {
      status: payload.status,
    };

    if (payload.status === ApplicationStatus.UNDER_REVIEW)
      data.reviewedAt = new Date();
    if (payload.status === ApplicationStatus.SHORTLISTED)
      data.shortlistedAt = new Date();
    if (payload.status === ApplicationStatus.INTERVIEW_SCHEDULED)
      data.interviewScheduledAt = new Date();
    if (payload.status === ApplicationStatus.INTERVIEWED)
      data.interviewedAt = new Date();
    if (payload.status === ApplicationStatus.OFFERED)
      data.offeredAt = new Date();
    if (payload.status === ApplicationStatus.HIRED) data.hiredAt = new Date();
    if (payload.status === ApplicationStatus.REJECTED)
      data.rejectedAt = new Date();

    const updated = await this.repository.update(applicationId, data);

    await this.repository.createStatusHistory({
      applicationId,
      fromStatus: application.status,
      toStatus: payload.status,
      changedByUserId: authUserId,
      note: payload.note,
    });

    await this.invalidateApplicationCaches(
      application.authUserId,
      applicationId,
      application.jobId,
    );

    await this.eventService.publishStatusChanged({
      applicationId,
      jobId: application.jobId,
      companyId: application.companyId,
      fromStatus: application.status,
      toStatus: payload.status,
      changedByUserId: authUserId,
    });

    return updated;
  }

  async addRecruiterNote(
    authUserId: string,
    cookieHeader: string | undefined,
    applicationId: string,
    payload: any,
  ) {
    const application = await this.repository.findById(applicationId);

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    await this.jobClient.getRecruiterJobById(application.jobId, cookieHeader);

    const updated = await this.repository.update(applicationId, {
      recruiterNotes: payload.recruiterNotes,
    });

    await this.invalidateApplicationCaches(
      application.authUserId,
      applicationId,
      application.jobId,
    );

    await this.eventService.publishNoteAdded({
      applicationId,
      jobId: application.jobId,
      companyId: application.companyId,
      addedByUserId: authUserId,
    });

    return updated;
  }

  async addRecruiterRating(
    authUserId: string,
    cookieHeader: string | undefined,
    applicationId: string,
    payload: any,
  ) {
    const application = await this.repository.findById(applicationId);

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    await this.jobClient.getRecruiterJobById(application.jobId, cookieHeader);

    const updated = await this.repository.update(applicationId, {
      recruiterRating: payload.recruiterRating,
    });

    await this.invalidateApplicationCaches(
      application.authUserId,
      applicationId,
      application.jobId,
    );

    await this.eventService.publishRated({
      applicationId,
      jobId: application.jobId,
      companyId: application.companyId,
      recruiterRating: payload.recruiterRating,
      ratedByUserId: authUserId,
    });

    return updated;
  }

  async getJobApplicationAnalytics(
    _authUserId: string,
    cookieHeader: string | undefined,
    jobId: string,
  ) {
    await this.jobClient.getRecruiterJobById(jobId, cookieHeader);

    const cacheKey = CACHE_KEYS.JOB_ANALYTICS(jobId);
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const analytics = await this.repository.getJobAnalytics(jobId);
    await this.cacheService.set(cacheKey, analytics);

    return analytics;
  }
}
