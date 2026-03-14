type ProfileShape = {
  id: string;
  authUserId: string;
  fullName: string;
  headline: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  currentCompany: string | null;
  currentRole: string | null;
  totalExperience: number | null;
  expectedSalary: number | null;
  noticePeriodDays: number | null;
  profilePicture: string | null;
  resumeUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  skills?: unknown[];
  educations?: unknown[];
  experiences?: unknown[];
  projects?: unknown[];
};

export const calculateProfileCompleteness = (profile: ProfileShape): number => {
  const fields = [
    profile.fullName,
    profile.headline,
    profile.bio,
    profile.phone,
    profile.location,
    profile.currentCompany,
    profile.currentRole,
    profile.totalExperience,
    profile.resumeUrl,
    profile.githubUrl,
    profile.linkedinUrl,
    profile.portfolioUrl,
  ];

  const filledFields = fields.filter(
    (value) => value !== null && value !== undefined && value !== "",
  ).length;
  const baseScore = Math.round((filledFields / fields.length) * 70);

  const skillScore = profile.skills && profile.skills.length > 0 ? 10 : 0;
  const educationScore =
    profile.educations && profile.educations.length > 0 ? 10 : 0;
  const experienceScore =
    profile.experiences && profile.experiences.length > 0 ? 5 : 0;
  const projectScore = profile.projects && profile.projects.length > 0 ? 5 : 0;

  return Math.min(
    100,
    baseScore + skillScore + educationScore + experienceScore + projectScore,
  );
};
