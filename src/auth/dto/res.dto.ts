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
