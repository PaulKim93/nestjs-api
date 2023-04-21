import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@api/auth/auth.service';

@Injectable()
export class UserLocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'login_id',
      passwordField: 'password',
    });
  }

  async validate(login_id: string, password: string): Promise<any> {
    console.log(`LocalStrategy validate start ....`, login_id, password);
    /*
    const payload = { userId: userId, userPwd: userpassword };
    const user = await this.authService.login(userId, userpassword);
    if (!user) {
      throw new UnauthorizedException();
    }
    */
    return true;
  }
}
