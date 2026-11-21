import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;

    return this.authService.generateToken(user);
  }

  @UseGuards(AuthGuard('refresh-jwt'))
  @Post('refresh')
  refresh(@Req() req: Request) {
    const user = req.user as { sub: string };

    return this.authService.refreshToken(user);
  }
}
