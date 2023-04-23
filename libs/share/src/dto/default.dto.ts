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
import { Type } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';

/**
 * Page Requst Dto
 */
export class PageDto {
  @IsDefined({ message: '페이지 번호는 필수값입니다.' })
  @IsNumberString()
  @ApiProperty({ example: 1, type: Number, description: '페이지 번호', required: true })
  page: number;

  @IsDefined({ message: '페이지당 노출 개수는 필수값입니다.' })
  @IsNumberString()
  @ApiProperty({ example: 20, type: Number, description: '페이지당 노출 개수', required: true })
  per_page: number;
}
/**
 * Pagination Response Dto
 */
export class PaginationDto {
  @ApiProperty({ example: 80, type: Number, description: '전체 리스트 개수', required: true })
  total: number;
  @ApiProperty({
    example: 20,
    type: Number,
    description: '현재 페이지 리스트 개수',
    required: true,
  })
  count: number;
  @ApiProperty({
    example: 1,
    type: Number,
    description: '현재 페이지',
    required: true,
  })
  current_page: number;
  @ApiProperty({ example: 2, description: '전체 페이지 개수', required: true })
  total_pages: number;
  @ApiProperty({
    example: 1,
    type: Number,
    description: '1페이지에 보여질 리스트 개수',
    required: true,
  })
  per_page: number;
}

/**
 *기본 response dto
 */
export class BaseResDto {
  @ApiProperty({ example: true, description: 'response', required: true })
  status: boolean;
  @ApiProperty({
    example: '0000000',
    description: '상태 상태코드(API 상태 코드표 참조)',
    required: true,
  })
  status_code: string;
}

/**
 *기본 response dto Error
 */
export class BaseErrorResDto {
  @ApiProperty({ example: false, description: 'response', required: true })
  status: boolean;
  @ApiProperty({
    example: '0101001',
    description: '상태 상태코드(API 상태 코드표 참조)',
    required: true,
  })
  status_code: string;
  @ApiProperty({ example: 'string', description: '에러메세지', required: true })
  message: string;
}
