import {
  IsNotEmpty,
  IsString,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
  IsNumber,
  IsNumberString,
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsEnum,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseResDto } from '@app/share/dto/default.dto';
import { Mber } from '@app/share/models/user/mber.entity';

export class DefaultUserDto extends PickType(Mber, [
  'mber_id',
  'mber_se',
  'mber_sttus',
  'login_id',
  'nm',
  'brthdy',
  'sexdstn',
  'mp_no',
  'profl_image',
  'sbscrb_dt',
  'confm_sttus',
] as const) {}
