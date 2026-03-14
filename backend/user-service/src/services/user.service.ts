import { UserRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/AppError.js";
import { calculateProfileCompleteness } from "../utils/profile.js";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createProfile(
    authUserId: string,
    payload: {
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
    },
  ) {
    try {
      const existingProfile =
        await this.userRepository.findProfileByAuthUserId(authUserId);

      if (existingProfile) {
        throw new AppError("Profile already exists for this user", 409);
      }

      const profile = await this.userRepository.createProfile({
        authUserId,
        ...payload,
      });

      return {
        ...profile,
        profileCompleteness: calculateProfileCompleteness(profile),
      };
    } catch (error) {
      throw error;
    }
  }

  async getMyProfile(authUserId: string) {
    try {
      const profile =
        await this.userRepository.findProfileByAuthUserId(authUserId);

      if (!profile) {
        throw new AppError("Profile not found", 404);
      }

      return {
        ...profile,
        profileCompleteness: calculateProfileCompleteness(profile),
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfileByAuthUserId(authUserId: string) {
    try {
      const profile =
        await this.userRepository.findProfileByAuthUserId(authUserId);

      if (!profile) {
        throw new AppError("Profile not found", 404);
      }

      return {
        ...profile,
        profileCompleteness: calculateProfileCompleteness(profile),
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(
    authUserId: string,
    payload: Partial<{
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
    try {
      const existingProfile =
        await this.userRepository.findProfileByAuthUserId(authUserId);

      if (!existingProfile) {
        throw new AppError("Profile not found", 404);
      }

      const updatedProfile =
        await this.userRepository.updateProfileByAuthUserId(
          authUserId,
          payload,
        );

      return {
        ...updatedProfile,
        profileCompleteness: calculateProfileCompleteness(updatedProfile),
      };
    } catch (error) {
      throw error;
    }
  }

  async addSkill(
    authUserId: string,
    payload: { name: string; level?: string },
  ) {
    try {
      const profile =
        await this.userRepository.findProfileByAuthUserId(authUserId);

      if (!profile) {
        throw new AppError("Profile not found", 404);
      }

      return this.userRepository.addSkill(profile.id, payload);
    } catch (error) {
      throw error;
    }
  }

  async addEducation(
    authUserId: string,
    payload: {
      institution: string;
      degree: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
      grade?: string;
      description?: string;
    },
  ) {
    try {
      const profile =
        await this.userRepository.findProfileByAuthUserId(authUserId);

      if (!profile) {
        throw new AppError("Profile not found", 404);
      }

      return this.userRepository.addEducation(profile.id, payload);
    } catch (error) {
      throw error;
    }
  }

  async addExperience(
    authUserId: string,
    payload: {
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
    try {
      const profile =
        await this.userRepository.findProfileByAuthUserId(authUserId);

      if (!profile) {
        throw new AppError("Profile not found", 404);
      }

      return this.userRepository.addExperience(profile.id, payload);
    } catch (error) {
      throw error;
    }
  }

  async addProject(
    authUserId: string,
    payload: {
      title: string;
      description?: string;
      projectUrl?: string;
      githubUrl?: string;
      techStack?: string;
    },
  ) {
    try {
      const profile =
        await this.userRepository.findProfileByAuthUserId(authUserId);

      if (!profile) {
        throw new AppError("Profile not found", 404);
      }

      return this.userRepository.addProject(profile.id, payload);
    } catch (error) {
      throw error;
    }
  }

  async updateSkill(id: string, payload: { name?: string; level?: string }) {
    try {
      return await this.userRepository.updateSkill(id, payload);
    } catch (error) {
      throw error;
    }
  }

  async updateEducation(
    id: string,
    payload: {
      institution?: string;
      degree?: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
      grade?: string;
      description?: string;
    },
  ) {
    try {
      return await this.userRepository.updateEducation(id, payload);
    } catch (error) {
      throw error;
    }
  }

  async updateExperience(
    id: string,
    payload: {
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
    try {
      return await this.userRepository.updateExperience(id, payload);
    } catch (error) {
      throw error;
    }
  }

  async updateProject(
    id: string,
    payload: {
      title?: string;
      description?: string;
      projectUrl?: string;
      githubUrl?: string;
      techStack?: string;
    },
  ) {
    try {
      return await this.userRepository.updateProject(id, payload);
    } catch (error) {
      throw error;
    }
  }

  async deleteSkill(id: string) {
    try {
      return await this.userRepository.deleteSkill(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteEducation(id: string) {
    try {
      return await this.userRepository.deleteEducation(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteExperience(id: string) {
    try {
      return await this.userRepository.deleteExperience(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteProject(id: string) {
    try {
      return await this.userRepository.deleteProject(id);
    } catch (error) {
      throw error;
    }
  }
}
