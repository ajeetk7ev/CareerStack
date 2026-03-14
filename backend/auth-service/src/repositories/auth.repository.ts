import { PrismaClient } from "../generated/prisma/client";
import { AuthProvider } from "../generated/prisma/enums";

export { AuthProvider };

export interface CreateLocalUserData {
  name: string;
  email: string;
  password: string;
}

export interface CreateSocialUserData {
  name: string;
  email: string;
  avatar?: string | null;
  provider: AuthProvider;
  providerId: string;
}

export class AuthRepository {
  constructor(private readonly db: PrismaClient) {}

  findByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.db.user.findUnique({ where: { id } });
  }

  findByProviderId(provider: AuthProvider, providerId: string) {
    return this.db.user.findUnique({
      where: { provider_providerId: { provider, providerId } },
    });
  }

  createLocalUser(data: CreateLocalUserData) {
    return this.db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        provider: AuthProvider.LOCAL,
      },
    });
  }

  /**
   * Upserts an OAuth user. On re-login the name/avatar are refreshed.
   * The @@unique([provider, providerId]) constraint is used as the upsert key.
   */
  upsertSocialUser(data: CreateSocialUserData) {
    return this.db.user.upsert({
      where: {
        provider_providerId: {
          provider: data.provider,
          providerId: data.providerId,
        },
      },
      update: {
        name: data.name,
        avatar: data.avatar ?? null,
      },
      create: {
        name: data.name,
        email: data.email,
        avatar: data.avatar ?? null,
        provider: data.provider,
        providerId: data.providerId,
        isEmailVerified: true,
      },
    });
  }
}
