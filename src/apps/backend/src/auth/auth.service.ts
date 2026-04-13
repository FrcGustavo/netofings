import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { PayloadToken } from './models/token.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    console.log({ user });

    if (!user) {
      return null;
    }

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      return null;
    }

    return user;
  }

  generateToken(user: User) {
    const payload: PayloadToken = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user,
    };
  }

  refreshToken(user: { sub: string }) {
    const payload: PayloadToken = { sub: user.sub };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
