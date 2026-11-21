import { Injectable, Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config from '../../config';

@Injectable()
export class RefreshJWTStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret || 'default-secret',
    });
  }

  validate(payload: { sub: string }) {
    return payload;
  }
}
