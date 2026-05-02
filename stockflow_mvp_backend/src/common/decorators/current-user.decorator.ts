import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// Full user type including the eagerly loaded organization relation
export type UserWithOrg = Prisma.UserGetPayload<{
  include: { organization: true };
}>;

/**
 * Extracts the authenticated user from the request.
 * Populated by JwtStrategy.validate() after token verification.
 *
 * Usage in any controller:
 *   someMethod(@CurrentUser() user: UserWithOrg) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserWithOrg => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
