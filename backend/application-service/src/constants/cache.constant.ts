export const CACHE_KEYS = {
  MY_APPLICATIONS: (userId: string, queryKey: string) =>
    `application:my:${userId}:${queryKey}`,
  RECRUITER_JOB_APPLICATIONS: (jobId: string, queryKey: string) =>
    `application:job:${jobId}:${queryKey}`,
  APPLICATION_DETAIL: (applicationId: string) =>
    `application:detail:${applicationId}`,
  JOB_ANALYTICS: (jobId: string) => `application:analytics:${jobId}`,
};
