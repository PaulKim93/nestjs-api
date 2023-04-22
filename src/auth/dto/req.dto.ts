import {
  IsNotEmpty,
  IsString,
  IsDefined,
  Matches,
  MinLength,
  MaxLength,
  IsNumber,
  IsEnum,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Mber } from '@app/share/models/user/mber.entity';
import { EXPSR_AT_ENUM } from '@app/share/types/user.type';

/**
 * 회원 로그인 POST
 * /user/login
 */
export class UserLoginReqDtoPost extends PickType(Mber, ['login_id', 'password'] as const) {
  @IsString()
  @IsDefined({ message: '0101003:이메일을 입력해 주세요.' })
  @IsNotEmpty()
  @Matches(/^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i, {
    message: '0101004:이메일 형식이 올바르지 않습니다.',
  })
  login_id: string;
  @IsString()
  @MinLength(8, { message: '0101005:비밀번호는 8자리 이상 입력하세요' })
  @MaxLength(15, { message: '0101006:비밀번호는 15자리 이하 입력하세요' })
  password: string;
}

/**
 * 회원 로그인 POST
 * /user/join
 */
export class UserJoinReqDtoPost extends PickType(Mber, [
  'login_id',
  'password',
  'nm',
  'brthdy',
  'sexdstn',
  'mp_no',
  'profl_image',
] as const) {
  @IsString()
  @IsDefined({ message: '0101003:이메일을 입력해 주세요.' })
  @Matches(/^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i, {
    message: '0101004:이메일 형식이 올바르지 않습니다.',
  })
  login_id: string;

  @IsString()
  @IsDefined({ message: '0101003:이메일을 입력해 주세요.' })
  @MinLength(8, { message: '0101005:비밀번호는 8자리 이상 입력하세요' })
  @MaxLength(15, { message: '0101006:비밀번호는 15자리 이하 입력하세요' })
  password: string;

  @IsDefined({ message: '0101007:이름을 입력해 주세요.' })
  @MaxLength(15, { message: '0101006:이름을 50자리 이하 입력하세요' })
  @IsString()
  nm: string;

  @IsDefined({ message: '0101007:생년월일을 입력해 주세요.' })
  @IsNumberString()
  @MinLength(8, { message: '0101008:생년월일은 8자리로 입력하세요' })
  @MaxLength(8, { message: '0101008:생년월일은 8자리로 입력하세요' })
  brthdy: string;

  @IsDefined({ message: '0101009:성별을 입력해 주세요.' })
  @IsNumberString()
  @IsEnum(EXPSR_AT_ENUM, { message: '0101010:허용하지 성별코드입니다.' })
  sexdstn: string;

  @IsDefined({ message: '0101011:휴대폰번호를 입력해 주세요.' })
  @IsNumberString()
  @MaxLength(50, { message: '0101012:휴대폰번호는 50자리 이하로 입력하세요' })
  mp_no: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: '0101013:프로필 이미지 URL은 255자리 이하로 입력하세요' })
  profl_image: string;
}
