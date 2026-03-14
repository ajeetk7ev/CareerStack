import { ApplicationStatus, Prisma } from "../generated/prisma/client.js";
import { prisma } from "../config/prisma.js";

export class ApplicationRepository {
  async findById(applicationId: string) {
    return prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async findByUserAndJob(authUserId: string, jobId: string) {
    return prisma.application.findUnique({
      where: {
        authUserId_jobId: {
          authUserId,
          jobId,
        },
      },
    });
  }

  async create(data: Prisma.ApplicationCreateInput) {
    return prisma.application.create({
      data,
      include: {
        statusHistory: true,
      },
    });
  }

  async update(applicationId: string, data: Prisma.ApplicationUpdateInput) {
    return prisma.application.update({
      where: { id: applicationId },
      data,
      include: {
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async createStatusHistory(
    data: Prisma.ApplicationStatusHistoryUncheckedCreateInput,
  ) {
    return prisma.applicationStatusHistory.create({ data });
  }

  async listMyApplications({
    authUserId,
    skip,
    limit,
    filters,
  }: {
    authUserId: string;
    skip: number;
    limit: number;
    filters: { status?: string; keyword?: string };
  }) {
    const where: Prisma.ApplicationWhereInput = {
      authUserId,
    };

    if (filters.status) {
      where.status = filters.status as ApplicationStatus;
    }

    if (filters.keyword) {
      where.OR = [
        {
          jobTitleSnapshot: {
            contains: filters.keyword,
            mode: "insensitive",
          },
        },
        {
          companyNameSnapshot: {
            contains: filters.keyword,
            mode: "insensitive",
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedAt: "desc" },
      }),
      prisma.application.count({ where }),
    ]);

    return {
      items,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async listApplicationsForJob({
    jobId,
    skip,
    limit,
    filters,
  }: {
    jobId: string;
    skip: number;
    limit: number;
    filters: { status?: string; keyword?: string };
  }) {
    const where: Prisma.ApplicationWhereInput = { jobId };

    if (filters.status) {
      where.status = filters.status as ApplicationStatus;
    }

    if (filters.keyword) {
      where.OR = [
        {
          candidateNameSnapshot: {
            contains: filters.keyword,
            mode: "insensitive",
          },
        },
        {
          candidateEmailSnapshot: {
            contains: filters.keyword,
            mode: "insensitive",
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedAt: "desc" },
      }),
      prisma.application.count({ where }),
    ]);

    return {
      items,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getJobAnalytics(jobId: string) {
    const grouped = await prisma.application.groupBy({
      by: ["status"],
      where: { jobId },
      _count: {
        status: true,
      },
    });

    const total = await prisma.application.count({ where: { jobId } });

    return {
      total,
      byStatus: grouped,
    };
  }
}
