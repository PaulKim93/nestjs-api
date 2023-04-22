import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UserLoginReqDtoPost, UserJoinReqDtoPost } from './dto/req.dto';
import { MberRepositroy } from './repository/mber.repository';
import { IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DefaultUserDto } from '@api/auth/dto/res.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MBER_STTUS_ENUM } from '@app/share/types/user.type';
@Injectable()
export class AuthService {
  constructor(
    private readonly mberRepositroy: MberRepositroy,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 유저 로그인
   * @param dto
   * @returns
   */
  async login(dto: UserLoginReqDtoPost): Promise<DefaultUserDto> {
    try {
      const { login_id, password } = dto;
      const user = await this.mberRepositroy.findOne({
        where: {
          login_id,
          secsn_dt: IsNull(), //탈퇴날짜
        },
      });

      if (user == null) {
        throw new UnauthorizedException({
          status_code: '0101001', // 로그인 아이디 없는 경우
          message: '로그인 정보가 올바르지 않습니다.',
        });
      }
      const {
        password: hasPassword,
        mber_id,
        mber_se,
        mber_sttus,
        nm,
        brthdy,
        sexdstn,
        mp_no,
        profl_image,
        sbscrb_dt,
        confm_sttus,
      } = user;
      // 비밀번호 비교
      const result = await bcrypt.compare(password, hasPassword);

      if (result === false) {
        throw new UnauthorizedException({
          status_code: '0101002',
          message: '로그인 정보가 올바르지 않습니다.',
        });
      }
      const payload: DefaultUserDto = {
        mber_id,
        mber_se,
        login_id,
        mber_sttus,
        nm,
        brthdy,
        sexdstn,
        mp_no,
        profl_image,
        sbscrb_dt,
        confm_sttus,
      };
      return payload;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 로그인 정상적으로 완료 하면 토큰발행
   * @param user
   */
  async ceateUserToken(
    user: DefaultUserDto,
  ): Promise<{ user: DefaultUserDto; access_token: string; refresh_token: string }> {
    try {
      const access_token = await this.jwtService.signAsync(user);
      console.log(
        `this.configService.get<string>('JWT_REFRESH_SECRET')`,
        this.configService.get<string>('JWT_REFRESH_SECRET'),
      );
      const refresh_token = await this.jwtService.signAsync(user, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TTL'),
      });
      return {
        user,
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw e;
    }
  }
  /**
   * 회원가입
   * @param dto
   * @param ip
   */
  async userJoinPost(dto: UserJoinReqDtoPost, ip: string): Promise<void> {
    try {
      const user = await this.mberRepositroy.create(dto);
      user.sbscrb_ip = ip;
      const result = await this.mberRepositroy.save(user);
      if (result == null) {
        throw new InternalServerErrorException({
          message: 'mber insert fail',
        });
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   *  정상적인 USER 인지 확인
   */

  async userValidate(mber_id: number): Promise<DefaultUserDto> {
    try {
      const user = await this.mberRepositroy.findOne({
        where: {
          mber_id,
          secsn_dt: IsNull(), //탈퇴날짜
        },
      });
      if (user === null) {
        throw new UnauthorizedException({
          status_code: '0102002',
          message: '존재하지 않는 사용사 입니다.',
        });
      }
      const {
        login_id,
        mber_se,
        mber_sttus,
        nm,
        brthdy,
        sexdstn,
        mp_no,
        profl_image,
        sbscrb_dt,
        confm_sttus,
      } = user;

      if (mber_sttus !== MBER_STTUS_ENUM.NORMAL) {
        throw new UnauthorizedException({
          status_code: '0102003',
          message: '정상적은 회원이 아닙니다.',
        });
      }
      const payload: DefaultUserDto = {
        mber_id,
        mber_se,
        login_id,
        mber_sttus,
        nm,
        brthdy,
        sexdstn,
        mp_no,
        profl_image,
        sbscrb_dt,
        confm_sttus,
      };
      return payload;
    } catch (e) {
      throw e;
    }
  }
}
