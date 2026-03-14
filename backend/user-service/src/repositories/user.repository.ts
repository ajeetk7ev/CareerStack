import { prisma } from "../config/prisma.js";

export class UserRepository {
  async createProfile(data: {
    authUserId: string;
    fullName: string;
    headline?: string;
    bio?: string;
    phone?: string;
    location?: string;
    currentCompany?: string;
    currentRole?: string;
    totalExperience?: number;
    expectedSalary?: number;
    noticePeriodDays?: number;
    profilePicture?: string;
    resumeUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
  }) {
    return prisma.userProfile.create({
      data,
    });
  }

  async findProfileByAuthUserId(authUserId: string) {
    return prisma.userProfile.findUnique({
      where: { authUserId },
      include: {
        skills: true,
        educations: true,
        experiences: true,
        projects: true,
      },
    });
  }

  async updateProfileByAuthUserId(
    authUserId: string,
    data: Partial<{
      fullName: string;
      headline: string;
      bio: string;
      phone: string;
      location: string;
      currentCompany: string;
      currentRole: string;
      totalExperience: number;
      expectedSalary: number;
      noticePeriodDays: number;
      profilePicture: string;
      resumeUrl: string;
      githubUrl: string;
      linkedinUrl: string;
      portfolioUrl: string;
    }>,
  ) {
    return prisma.userProfile.update({
      where: { authUserId },
      data,
      include: {
        skills: true,
        educations: true,
        experiences: true,
        projects: true,
      },
    });
  }

  async addSkill(profileId: string, data: { name: string; level?: string }) {
    return prisma.skill.create({
      data: {
        profileId,
        ...data,
      },
    });
  }

  async addEducation(
    profileId: string,
    data: {
      institution: string;
      degree: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
      grade?: string;
      description?: string;
    },
  ) {
    return prisma.education.create({
      data: {
        profileId,
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        grade: data.grade,
        description: data.description,
      },
    });
  }

  async addExperience(
    profileId: string,
    data: {
      companyName: string;
      role: string;
      employmentType?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      isCurrent?: boolean;
      description?: string;
    },
  ) {
    return prisma.experience.create({
      data: {
        profileId,
        companyName: data.companyName,
        role: data.role,
        employmentType: data.employmentType,
        location: data.location,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        isCurrent: data.isCurrent ?? false,
        description: data.description,
      },
    });
  }

  async addProject(
    profileId: string,
    data: {
      title: string;
      description?: string;
      projectUrl?: string;
      githubUrl?: string;
      techStack?: string;
    },
  ) {
    return prisma.project.create({
      data: {
        profileId,
        ...data,
      },
    });
  }

  async updateSkill(id: string, data: { name?: string; level?: string }) {
    return prisma.skill.update({
      where: { id },
      data,
    });
  }

  async updateEducation(
    id: string,
    data: {
      institution?: string;
      degree?: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
      grade?: string;
      description?: string;
    },
  ) {
    return prisma.education.update({
      where: { id },
      data: {
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        grade: data.grade,
        description: data.description,
      },
    });
  }

  async updateExperience(
    id: string,
    data: {
      companyName?: string;
      role?: string;
      employmentType?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      isCurrent?: boolean;
      description?: string;
    },
  ) {
    return prisma.experience.update({
      where: { id },
      data: {
        companyName: data.companyName,
        role: data.role,
        employmentType: data.employmentType,
        location: data.location,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        isCurrent: data.isCurrent,
        description: data.description,
      },
    });
  }

  async updateProject(
    id: string,
    data: {
      title?: string;
      description?: string;
      projectUrl?: string;
      githubUrl?: string;
      techStack?: string;
    },
  ) {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async deleteSkill(id: string) {
    return prisma.skill.delete({
      where: { id },
    });
  }

  async deleteEducation(id: string) {
    return prisma.education.delete({
      where: { id },
    });
  }

  async deleteExperience(id: string) {
    return prisma.experience.delete({
      where: { id },
    });
  }

  async deleteProject(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }
}
