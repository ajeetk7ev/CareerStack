import { prisma } from "../config/prisma.js";
import {
  CompanyMemberRole,
  CompanyInviteStatus,
} from "../generated/prisma/enums.js";

export class CompanyRepository {
  async findCompanyById(companyId: string) {
    return prisma.company.findUnique({
      where: { id: companyId },
    });
  }

  async findCompanyBySlug(slug: string) {
    return prisma.company.findUnique({
      where: { slug },
      include: {
        members: true,
      },
    });
  }

  async findCompanyByCreatedByAuthUserId(authUserId: string) {
    return prisma.company.findFirst({
      where: { createdByAuthUserId: authUserId },
      include: {
        members: true,
      },
    });
  }

  async findMembership(companyId: string, authUserId: string) {
    return prisma.companyMember.findUnique({
      where: {
        companyId_authUserId: {
          companyId,
          authUserId,
        },
      },
    });
  }

  async createCompany(data: {
    name: string;
    slug: string;
    tagline?: string;
    description?: string;
    website?: string;
    logoUrl?: string;
    bannerUrl?: string;
    industry?: string;
    companySize?: string;
    foundedYear?: number;
    location?: string;
    email?: string;
    phone?: string;
    createdByAuthUserId: string;
  }) {
    return prisma.company.create({
      data: {
        ...data,
        members: {
          create: {
            authUserId: data.createdByAuthUserId,
            role: "OWNER",
          },
        },
      },
      include: {
        members: true,
      },
    });
  }

  async updateCompany(companyId: string, data: Record<string, unknown>) {
    return prisma.company.update({
      where: { id: companyId },
      data,
    });
  }

  async listCompanyMembers(companyId: string) {
    return prisma.companyMember.findMany({
      where: { companyId },
      orderBy: { createdAt: "asc" },
    });
  }

  async createInvite(data: {
    companyId: string;
    email: string;
    invitedByAuthUserId: string;
    role: CompanyMemberRole;
    token: string;
    expiresAt: Date;
  }) {
    return prisma.companyInvite.create({
      data,
    });
  }

  async findPendingInviteByEmail(companyId: string, email: string) {
    return prisma.companyInvite.findFirst({
      where: {
        companyId,
        email,
        status: CompanyInviteStatus.PENDING,
      },
    });
  }

  async findInviteByToken(token: string) {
    return prisma.companyInvite.findUnique({
      where: { token },
      include: {
        company: true,
      },
    });
  }

  async acceptInvite(inviteId: string) {
    return prisma.companyInvite.update({
      where: { id: inviteId },
      data: {
        status: CompanyInviteStatus.ACCEPTED,
      },
    });
  }

  async cancelInvite(inviteId: string) {
    return prisma.companyInvite.update({
      where: { id: inviteId },
      data: {
        status: CompanyInviteStatus.CANCELLED,
      },
    });
  }

  async findInviteById(inviteId: string) {
    return prisma.companyInvite.findUnique({
      where: { id: inviteId },
    });
  }

  async addMember(data: {
    companyId: string;
    authUserId: string;
    role: CompanyMemberRole;
  }) {
    return prisma.companyMember.create({
      data,
    });
  }

  async findMemberById(memberId: string) {
    return prisma.companyMember.findUnique({
      where: { id: memberId },
    });
  }

  async updateMemberRole(memberId: string, role: CompanyMemberRole) {
    return prisma.companyMember.update({
      where: { id: memberId },
      data: { role },
    });
  }

  async removeMember(memberId: string) {
    return prisma.companyMember.delete({
      where: { id: memberId },
    });
  }

  async findCompanyByNameSlug(slug: string) {
    return prisma.company.findUnique({
      where: { slug },
    });
  }
}
