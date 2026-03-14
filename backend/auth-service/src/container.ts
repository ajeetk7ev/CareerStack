import { prisma } from "./config/prisma";
import { AuthRepository } from "./repositories/auth.repository";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";

/**
 * Manual dependency-injection container.
 * Wires: PrismaClient → AuthRepository → AuthService → AuthController
 * All instances are singletons (module-level).
 */
const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

export { authRepository, authService, authController };
