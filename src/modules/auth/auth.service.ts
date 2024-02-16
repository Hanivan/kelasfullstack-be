import { UsersEntity } from '@entities/users.entity';
import { EnvKey } from '@libs/commons/constant';
import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { isEmpty } from 'class-validator';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly config: ConfigService) {}

  async verifyPassword(user: UsersEntity, password: string): Promise<boolean> {
    return compare(password, user.password);
  }

  async createToken(user: UsersEntity) {
    const payload = {
      sub: user.id,
      name: user?.name,
      username: user.username,
    };

    const jwtToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpires,
    });

    return {
      user: {
        sub: user?.id,
        name: user?.name,
        username: user?.username,
      },
      expiresIn: this.jwtExpires,
      accessToken: jwtToken,
    };
  }

  /**
   *
   */

  private get jwtExpires() {
    const expiration = this.config.get<string>(EnvKey.JWT_EXPIRES_IN, '');
    if (isEmpty(expiration)) {
      throw new PreconditionFailedException(`JWT_EXPIRES_IN are not set`);
    }

    return expiration;
  }

  private get jwtSecret() {
    const secKey = this.config.get<string>(EnvKey.JWT_SECRET, '');
    if (isEmpty(secKey)) {
      throw new PreconditionFailedException(`JWT_SECRET are not set`);
    }

    return secKey;
  }
}
