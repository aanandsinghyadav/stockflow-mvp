import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User, Organization } from '@prisma/client';

// Full user type including the eagerly loaded organization relation
export type UserWithOrg = User & { organization: Organization };

/**
 * Extracts the authenticated user from the request.
 * Populated by JwtStrategy.validate() after token verification.
 *
 * Usage in any controller:
 *   @Get()
 *   getProfile(@CurrentUser() user: UserWithOrg) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserWithOrg => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
