import {
  IsString,
  IsDefined,
  IsNumberString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { PageDto } from '@app/share/dto/default.dto';
import { EXPSR_AT_ENUM } from '@app/share/types/user.type';
import {
  BBSCTT_RECOMEND_ENUM,
  BBSCTT_STTEMNT_ENUM,
  BBSCTT_ORDER_FILTER_ENUM,
} from '@app/share/types/community.type';
import { BbsRecomend, BbsSttemnt, Bbsctt, BbsctAnswer } from '@app/share/models/community';

export class BbscttListDto extends PageDto {
  @IsDefined({ message: '0101001:공지 표시 여부는 필수 입력 항목입니다.' })
  @IsNumberString()
  @IsEnum(EXPSR_AT_ENUM, { message: '0101001:표시 여부에 없는 코드값입니다.' })
  @ApiProperty({
    example: '1',
    description: '공지 표시 여부 1:Y, 2:N',
    required: true,
    default: '',
  })
  imprtnc_at: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '', description: '게시판카테고리 ID ', required: false, default: '' })
  bbs_ctgry_id: number;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '', description: '검색내용', required: false, default: '' })
  search: string;
  /*
  @IsNumberString()
  @IsEnum(BBSCTT_FILTER_ENUM,{message: '0101001:검색필터에 없는 코드값입니다.'})
  @ApiProperty({ example: '1', description: '검색필터 1:제목, 2:내용, 3:제목+내용', required: true, default: '1'})
  search_filter: string;
  */
  @IsNumberString()
  @IsEnum(BBSCTT_ORDER_FILTER_ENUM, { message: '0101001:정렬필터에 없는 코드값입니다.' })
  @ApiProperty({
    example: '1',
    description: '정렬 1:최신순, 2:추천순, 3:조회순, 4:댓글순',
    required: true,
    default: '1',
  })
  order_type: string;
}
/**
 * 게시판->게시글 리스트 좋아요, 싫어요 req dto
 */
export class BbscttRecomendSetDto extends PickType(BbsRecomend, ['recomend_se'] as const) {
  @IsDefined({ message: '0101001:추천구분은 필수 값 입니다.' })
  @IsEnum(BBSCTT_RECOMEND_ENUM, { message: '0101001:추천구분에 없는 코드값입니다.' })
  @ApiProperty({ example: 'string', description: '추천구분 1:좋아요, 2:싫어요 ', required: true })
  recomend_se: string;
}

/**
 * 게시판->게시글 리스트 좋아요, 싫어요 취소 req dto
 */
export class BbscttRecomendCancelDto extends PickType(BbsRecomend, ['recomend_se'] as const) {
  @IsDefined({ message: '0101001:추천구분은 필수 값 입니다.' })
  @IsEnum(BBSCTT_RECOMEND_ENUM, { message: '0101001:추천구분에 없는 코드값입니다.' })
  @ApiProperty({ example: 'string', description: '추천구분 1:좋아요, 2:싫어요 ', required: true })
  recomend_se: string;
}

export class PathBbscttIdDto {
  @IsDefined({ message: '0101001:게시글ID는 필수값 입니다.' })
  @IsNumberString()
  @MinLength(1, { message: '0101001:게시글ID는 필수값 입니다.' })
  @ApiProperty({ type: Number, description: '게시글ID', required: true })
  bbsctt_id!: string;
}

export class BbscttSttemnt extends PickType(BbsSttemnt, ['sttemnt_knd', 'etc_resn'] as const) {
  @IsDefined({ message: '0101001:신고종류는 필수 값입니다.' })
  @IsEnum(BBSCTT_STTEMNT_ENUM, { message: '0101001:검색필터에 없는 코드값입니다.' })
  sttemnt_knd: string;
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: '0101001:255길이까지 입력가능합니다.' })
  etc_resn: string;
}

export class BbscttSavetDto extends PickType(Bbsctt, [
  'bbs_id',
  'bbs_ctgry_id',
  'bbsctt_sj',
  'bbsctt_cn',
] as const) {
  @IsNumber()
  @IsDefined({ message: '0101001:게시판ID는 필수 값입니다.' })
  bbs_id: number;
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1,
    type: Number,
    description: '카테고리 사용안하는 게시판은 "-1" 값을 넘겨주세요.',
    required: true,
  })
  bbs_ctgry_id: number;
  /*
  @IsOptional()
  @IsString()
  @MaxLength(50,{message: '0101001:50길이까지 입력가능합니다.'})
  wrter_nm: string;
  */
  @IsString()
  @MaxLength(255, { message: '0101001:255길이까지 입력가능합니다.' })
  bbsctt_sj: string;
  @IsString()
  bbsctt_cn: string;
}

export class BbscttAnswerInsertDto extends PickType(BbsctAnswer, [
  'bbsctt_id',
  'parnts_bbsctt_answer_id',
  'answer_cn',
] as const) {
  @IsNumber()
  @IsDefined({ message: '0101001:게시글ID는 필수 값입니다.' })
  bbsctt_id: number;
  @IsNumber()
  @IsOptional()
  parnts_bbsctt_answer_id: number;
  @IsString()
  @MaxLength(255, { message: '0101001:255길이까지 입력가능합니다.' })
  answer_cn: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'string', description: '이미지경로 length: 255', required: false })
  @MaxLength(255, { message: '0101001:255길이까지 입력가능합니다.' })
  image_path: string;
}

export class BbscttAnswerUpdateDto extends PickType(BbsctAnswer, ['answer_cn'] as const) {
  @IsString()
  @MaxLength(255, { message: '0101001:255길이까지 입력가능합니다.' })
  answer_cn: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'string', description: '이미지경로 length: 255', required: false })
  @MaxLength(255, { message: '0101001:255길이까지 입력가능합니다.' })
  image_path: string | null;
}
