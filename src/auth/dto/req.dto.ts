import { IsNotEmpty, IsString, IsDefined, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Mber } from '@app/share/models/user/mber.entity';

/**
 * 회원 로그인 POST
 * /user/login
 */
export class UserLoginReqDtoPost extends PickType(Mber, ['login_id', 'password'] as const) {
  @IsString()
  @IsDefined({ message: '0101001:이메일을 입력해 주세요.' })
  @IsNotEmpty()
  @Matches(/^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i, {
    message: '0101002:이메일 형식이 올바르지 않습니다.',
  })
  login_id: string;
  @IsString()
  @MinLength(8, { message: '0101003:비밀번호는 8자리 이상 입력하세요' })
  @MaxLength(15, { message: '0101004:비밀번호는 15자리 이하 입력하세요' })
  password: string;
}
