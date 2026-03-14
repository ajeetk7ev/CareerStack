import crypto from "crypto";
import {
  CompanyMemberRole,
  CompanyInviteStatus,
} from "../generated/prisma/enums.js";
import { CompanyRepository } from "../repositories/company.repository.js";
import { AppError } from "../utils/AppError.js";
import { generateSlug } from "../utils/slug.js";

export class CompanyService {
  private companyRepository: CompanyRepository;

  constructor() {
    this.companyRepository = new CompanyRepository();
  }

  private async ensureCompanyAccess(companyId: string, authUserId: string) {
    const membership = await this.companyRepository.findMembership(
      companyId,
      authUserId,
    );

    if (!membership) {
      throw new AppError(
        "Forbidden: you are not a member of this company",
        403,
      );
    }

    return membership;
  }

  private async ensureAdminAccess(companyId: string, authUserId: string) {
    const membership = await this.ensureCompanyAccess(companyId, authUserId);

    if (!["OWNER", "ADMIN"].includes(membership.role)) {
      throw new AppError("Forbidden: admin access required", 403);
    }

    return membership;
  }

  private async generateUniqueSlug(companyName: string): Promise<string> {
    const baseSlug = generateSlug(companyName);
    let finalSlug = baseSlug || `company-${Date.now()}`;
    let count = 1;

    while (await this.companyRepository.findCompanyByNameSlug(finalSlug)) {
      finalSlug = `${baseSlug}-${count}`;
      count++;
    }

    return finalSlug;
  }

  async createCompany(
    authUserId: string,
    payload: {
      name: string;
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
    },
  ) {
    try {
      const existing =
        await this.companyRepository.findCompanyByCreatedByAuthUserId(
          authUserId,
        );

      if (existing) {
        throw new AppError("User has already created a company", 409);
      }

      const slug = await this.generateUniqueSlug(payload.name);

      return await this.companyRepository.createCompany({
        ...payload,
        slug,
        createdByAuthUserId: authUserId,
      });
    } catch (error) {
      throw error;
    }
  }

  async getMyCompany(authUserId: string) {
    try {
      const company =
        await this.companyRepository.findCompanyByCreatedByAuthUserId(
          authUserId,
        );

      if (!company) {
        throw new AppError("Company not found", 404);
      }

      return company;
    } catch (error) {
      throw error;
    }
  }

  async checkMembership(companyId: string, authUserId: string) {
    try {
      const membership = await this.companyRepository.findMembership(
        companyId,
        authUserId,
      );

      if (!membership) {
        throw new AppError(
          "Forbidden: you are not a member of this company",
          403,
        );
      }

      return membership;
    } catch (error) {
      throw error;
    }
  }

  async updateMyCompany(
    authUserId: string,
    payload: {
      name?: string;
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
    },
  ) {
    try {
      const company =
        await this.companyRepository.findCompanyByCreatedByAuthUserId(
          authUserId,
        );

      if (!company) {
        throw new AppError("Company not found", 404);
      }

      const membership = await this.companyRepository.findMembership(
        company.id,
        authUserId,
      );

      if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
        throw new AppError("Forbidden: admin access required", 403);
      }

      const updateData: Record<string, unknown> = { ...payload };

      if (payload.name && payload.name !== company.name) {
        updateData.slug = await this.generateUniqueSlug(payload.name);
      }

      return await this.companyRepository.updateCompany(company.id, updateData);
    } catch (error) {
      throw error;
    }
  }

  async getCompanyBySlug(slug: string) {
    try {
      const company = await this.companyRepository.findCompanyBySlug(slug);

      if (!company) {
        throw new AppError("Company not found", 404);
      }

      return company;
    } catch (error) {
      throw error;
    }
  }

  async listMyCompanyMembers(authUserId: string) {
    try {
      const company =
        await this.companyRepository.findCompanyByCreatedByAuthUserId(
          authUserId,
        );

      if (!company) {
        throw new AppError("Company not found", 404);
      }

      await this.ensureCompanyAccess(company.id, authUserId);

      return this.companyRepository.listCompanyMembers(company.id);
    } catch (error) {
      throw error;
    }
  }

  async inviteRecruiter(
    authUserId: string,
    payload: {
      email: string;
      role: "ADMIN" | "RECRUITER";
    },
  ) {
    try {
      const company =
        await this.companyRepository.findCompanyByCreatedByAuthUserId(
          authUserId,
        );

      if (!company) {
        throw new AppError("Company not found", 404);
      }

      await this.ensureAdminAccess(company.id, authUserId);

      const pendingInvite =
        await this.companyRepository.findPendingInviteByEmail(
          company.id,
          payload.email,
        );

      if (pendingInvite) {
        throw new AppError("Pending invite already exists for this email", 409);
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      return await this.companyRepository.createInvite({
        companyId: company.id,
        email: payload.email,
        invitedByAuthUserId: authUserId,
        role: payload.role as CompanyMemberRole,
        token,
        expiresAt,
      });
    } catch (error) {
      throw error;
    }
  }

  async acceptInvite(authUserId: string, userEmail: string, token: string) {
    try {
      const invite = await this.companyRepository.findInviteByToken(token);

      if (!invite) {
        throw new AppError("Invite not found", 404);
      }

      if (invite.status !== CompanyInviteStatus.PENDING) {
        throw new AppError("Invite is no longer active", 400);
      }

      if (invite.expiresAt < new Date()) {
        throw new AppError("Invite has expired", 400);
      }

      if (invite.email.toLowerCase() !== userEmail.toLowerCase()) {
        throw new AppError("This invite does not belong to your account", 403);
      }

      const existingMembership = await this.companyRepository.findMembership(
        invite.companyId,
        authUserId,
      );

      if (existingMembership) {
        throw new AppError("You are already a member of this company", 409);
      }

      await this.companyRepository.addMember({
        companyId: invite.companyId,
        authUserId,
        role: invite.role,
      });

      await this.companyRepository.acceptInvite(invite.id);

      return {
        companyId: invite.companyId,
        role: invite.role,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateMemberRole(
    authUserId: string,
    memberId: string,
    role: "ADMIN" | "RECRUITER",
  ) {
    try {
      const actorCompany =
        await this.companyRepository.findCompanyByCreatedByAuthUserId(
          authUserId,
        );

      if (!actorCompany) {
        throw new AppError("Company not found", 404);
      }

      const actorMembership = await this.ensureAdminAccess(
        actorCompany.id,
        authUserId,
      );
      const targetMember =
        await this.companyRepository.findMemberById(memberId);

      if (!targetMember || targetMember.companyId !== actorCompany.id) {
        throw new AppError("Member not found", 404);
      }

      if (targetMember.role === "OWNER") {
        throw new AppError("Owner role cannot be changed", 400);
      }

      if (actorMembership.role !== "OWNER" && role === "ADMIN") {
        throw new AppError("Only owner can assign admin role", 403);
      }

      return await this.companyRepository.updateMemberRole(
        memberId,
        role as CompanyMemberRole,
      );
    } catch (error) {
      throw error;
    }
  }

  async removeMember(authUserId: string, memberId: string) {
    try {
      const actorCompany =
        await this.companyRepository.findCompanyByCreatedByAuthUserId(
          authUserId,
        );

      if (!actorCompany) {
        throw new AppError("Company not found", 404);
      }

      const actorMembership = await this.ensureAdminAccess(
        actorCompany.id,
        authUserId,
      );
      const targetMember =
        await this.companyRepository.findMemberById(memberId);

      if (!targetMember || targetMember.companyId !== actorCompany.id) {
        throw new AppError("Member not found", 404);
      }

      if (targetMember.role === "OWNER") {
        throw new AppError("Owner cannot be removed", 400);
      }

      if (actorMembership.role !== "OWNER" && targetMember.role === "ADMIN") {
        throw new AppError("Only owner can remove admin members", 403);
      }

      return await this.companyRepository.removeMember(memberId);
    } catch (error) {
      throw error;
    }
  }

  async cancelInvite(authUserId: string, inviteId: string) {
    try {
      const company =
        await this.companyRepository.findCompanyByCreatedByAuthUserId(
          authUserId,
        );

      if (!company) {
        throw new AppError("Company not found", 404);
      }

      await this.ensureAdminAccess(company.id, authUserId);

      const invite = await this.companyRepository.findInviteById(inviteId);

      if (!invite || invite.companyId !== company.id) {
        throw new AppError("Invite not found", 404);
      }

      if (invite.status !== CompanyInviteStatus.PENDING) {
        throw new AppError("Only pending invites can be cancelled", 400);
      }

      return await this.companyRepository.cancelInvite(inviteId);
    } catch (error) {
      throw error;
    }
  }
}
