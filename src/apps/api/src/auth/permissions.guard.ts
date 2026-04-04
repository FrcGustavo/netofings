import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class MetricsReadPermissionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    const user = request.user || {};
    const permissions: string[] = Array.isArray(user.permissions) ? user.permissions : [];

    if (!permissions.includes('metrics:read')) {
      throw new ForbiddenException('Not authorized');
    }

    return true;
  }
}
