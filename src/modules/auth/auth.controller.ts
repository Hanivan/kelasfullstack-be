import { UsersEntity } from '@entities/users.entity';
import { PublicEndpoint } from '@libs/commons/decorators/public.decorator';
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @PublicEndpoint()
  async signIn(@Body() body: AuthDto) {
    const user = await this.usersService.findEmail(body.email);
    if (isEmpty(user)) this.genUnauthException();

    // verif pass
    const isPassValid = await this.authService.verifyPassword(
      user as UsersEntity,
      body.password,
    );

    if (!isPassValid) this.genUnauthException();

    return this.authService.createToken(user as UsersEntity);
  }

  private genUnauthException() {
    throw new UnauthorizedException(`Invalid login credentials`);
  }
}
