import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@api/auth/auth.service';
import { UserLoginReqDtoPost } from '@api/auth/dto/req.dto';
import { DefaultUserDto } from '@api/auth/dto/res.dto';
@Injectable()
export class UserLocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'login_id',
      passwordField: 'password',
    });
  }

  async validate(
    login_id: UserLoginReqDtoPost['login_id'],
    password: UserLoginReqDtoPost['password'],
  ): Promise<DefaultUserDto> {
    //console.log(`LocalStrategy validate start ....`, login_id, password);
    return await this.authService.login({ login_id, password });
  }
}
