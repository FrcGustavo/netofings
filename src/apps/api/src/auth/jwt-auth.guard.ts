import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { AuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string }; user?: AuthUser }>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Not authorized');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const authConfig = this.configService.get('auth') as { secret: string; algorithms: string[] };

    try {
      const payload = jwt.verify(token, authConfig.secret, {
        algorithms: authConfig.algorithms as jwt.Algorithm[],
      }) as AuthUser;
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Not authorized');
    }
  }
}
