interface UserShape {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  provider: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const sanitizeUser = (user: UserShape) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  provider: user.provider,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
