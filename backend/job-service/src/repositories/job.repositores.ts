import { Prisma, JobStatus } from "../generated/prisma/client.js";
import { prisma } from "../config/prisma.js";

export class JobRepository {
  async createJob(data: Prisma.JobCreateInput) {
    return prisma.job.create({
      data,
      include: {
        skills: true,
      },
    });
  }

  async findJobById(jobId: string) {
    return prisma.job.findUnique({
      where: { id: jobId },
      include: { skills: true },
    });
  }

  async findJobBySlug(slug: string) {
    return prisma.job.findUnique({
      where: { slug },
      include: { skills: true },
    });
  }

  async findRecruiterJobById(jobId: string, companyId: string) {
    return prisma.job.findFirst({
      where: {
        id: jobId,
        companyId,
      },
      include: {
        skills: true,
      },
    });
  }

  async updateJob(jobId: string, data: Prisma.JobUpdateInput) {
    return prisma.job.update({
      where: { id: jobId },
      data,
      include: {
        skills: true,
      },
    });
  }

  async replaceSkills(
    jobId: string,
    skills: { name: string; isRequired: boolean }[],
  ) {
    await prisma.jobSkill.deleteMany({
      where: { jobId },
    });

    if (skills.length) {
      await prisma.jobSkill.createMany({
        data: skills.map((skill) => ({
          jobId,
          name: skill.name,
          isRequired: skill.isRequired,
        })),
      });
    }

    return prisma.jobSkill.findMany({
      where: { jobId },
    });
  }

  async deleteJob(jobId: string) {
    return prisma.job.delete({
      where: { id: jobId },
    });
  }

  async listRecruiterJobs(args: {
    companyId: string;
    page: number;
    limit: number;
    skip: number;
    filters: {
      status?: JobStatus;
      keyword?: string;
      employmentType?: string;
      workplaceType?: string;
      experienceLevel?: string;
      city?: string;
      country?: string;
    };
    orderBy: Prisma.JobOrderByWithRelationInput;
  }) {
    const where: Prisma.JobWhereInput = {
      companyId: args.companyId,
      ...(args.filters.status ? { status: args.filters.status } : {}),
      ...(args.filters.employmentType
        ? { employmentType: args.filters.employmentType as any }
        : {}),
      ...(args.filters.workplaceType
        ? { workplaceType: args.filters.workplaceType as any }
        : {}),
      ...(args.filters.experienceLevel
        ? { experienceLevel: args.filters.experienceLevel as any }
        : {}),
      ...(args.filters.city
        ? { city: { contains: args.filters.city, mode: "insensitive" } }
        : {}),
      ...(args.filters.country
        ? { country: { contains: args.filters.country, mode: "insensitive" } }
        : {}),
      ...(args.filters.keyword
        ? {
            OR: [
              {
                title: { contains: args.filters.keyword, mode: "insensitive" },
              },
              {
                description: {
                  contains: args.filters.keyword,
                  mode: "insensitive",
                },
              },
              { tags: { has: args.filters.keyword } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { skills: true },
        skip: args.skip,
        take: args.limit,
        orderBy: args.orderBy,
      }),
      prisma.job.count({ where }),
    ]);

    return {
      items,
      total,
      page: args.page,
      limit: args.limit,
      totalPages: Math.ceil(total / args.limit),
    };
  }

  async listPublicJobs(args: {
    page: number;
    limit: number;
    skip: number;
    filters: {
      keyword?: string;
      employmentType?: string;
      workplaceType?: string;
      experienceLevel?: string;
      city?: string;
      country?: string;
      companyId?: string;
      minSalary?: number;
      maxSalary?: number;
      skill?: string;
    };
    orderBy: Prisma.JobOrderByWithRelationInput;
  }) {
    const where: Prisma.JobWhereInput = {
      status: JobStatus.PUBLISHED,
      visibility: "PUBLIC",
      ...(args.filters.employmentType
        ? { employmentType: args.filters.employmentType as any }
        : {}),
      ...(args.filters.workplaceType
        ? { workplaceType: args.filters.workplaceType as any }
        : {}),
      ...(args.filters.experienceLevel
        ? { experienceLevel: args.filters.experienceLevel as any }
        : {}),
      ...(args.filters.city
        ? { city: { contains: args.filters.city, mode: "insensitive" } }
        : {}),
      ...(args.filters.country
        ? { country: { contains: args.filters.country, mode: "insensitive" } }
        : {}),
      ...(args.filters.companyId ? { companyId: args.filters.companyId } : {}),
      ...(typeof args.filters.minSalary === "number"
        ? { maxSalary: { gte: args.filters.minSalary } }
        : {}),
      ...(typeof args.filters.maxSalary === "number"
        ? { minSalary: { lte: args.filters.maxSalary } }
        : {}),
      ...(args.filters.keyword
        ? {
            OR: [
              {
                title: { contains: args.filters.keyword, mode: "insensitive" },
              },
              {
                description: {
                  contains: args.filters.keyword,
                  mode: "insensitive",
                },
              },
              { tags: { has: args.filters.keyword } },
            ],
          }
        : {}),
      ...(args.filters.skill
        ? {
            skills: {
              some: {
                name: { equals: args.filters.skill, mode: "insensitive" },
              },
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { skills: true },
        skip: args.skip,
        take: args.limit,
        orderBy: args.orderBy,
      }),
      prisma.job.count({ where }),
    ]);

    return {
      items,
      total,
      page: args.page,
      limit: args.limit,
      totalPages: Math.ceil(total / args.limit),
    };
  }
}
