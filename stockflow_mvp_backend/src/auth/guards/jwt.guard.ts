import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  /**
   * Override to throw a clean UnauthorizedException instead of
   * Passport's default 401 with no body.
   */
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException(
        'Authentication required. Please provide a valid Bearer token.',
      );
    }
    return user;
  }
}
