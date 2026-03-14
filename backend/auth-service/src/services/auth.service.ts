import { AppError } from "../utils/AppError";
import { hashPassword, comparePassword } from "../utils/password";
import { sanitizeUser } from "../utils/sanitizeUser";
import {
  AuthRepository,
  AuthProvider,
  CreateSocialUserData,
} from "../repositories/auth.repository";

export interface SocialProfile {
  provider: "google" | "github";
  providerId: string;
  email: string;
  name: string;
  avatar?: string | null;
}

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.authRepository.findByEmail(email);
    if (existing) {
      throw new AppError("An account with this email already exists", 409);
    }

    const hashedPassword = await hashPassword(password);
    const user = await this.authRepository.createLocalUser({
      name,
      email,
      password: hashedPassword,
    });

    return sanitizeUser(user);
  }

  /**
   * Called by the Passport LocalStrategy verify callback.
   * Returns a sanitized user or throws AppError on bad credentials.
   */
  async validateLocalUser(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new AppError("Invalid email or password", 401);
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new AppError("Invalid email or password", 401);
    }

    return sanitizeUser(user);
  }

  /**
   * Called by the Passport Google / GitHub strategy verify callbacks.
   * Upserts the user (creates on first login, updates name/avatar on repeat logins).
   */
  async findOrCreateSocialUser(profile: SocialProfile) {
    const providerEnum =
      profile.provider === "google" ? AuthProvider.GOOGLE : AuthProvider.GITHUB;

    const socialData: CreateSocialUserData = {
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      provider: providerEnum,
      providerId: profile.providerId,
    };

    const user = await this.authRepository.upsertSocialUser(socialData);
    return sanitizeUser(user);
  }

  async getProfile(userId: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return sanitizeUser(user);
  }
}
