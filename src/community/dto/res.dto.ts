import { ApiProperty, PickType } from '@nestjs/swagger';
import { PaginationDto } from '@app/share/dto/default.dto';
import {
  Bbsctt,
  Bbs,
  BbsCtgry,
  BbsRecomend,
  BbsctAnswer,
  BbscttAnswerImage,
} from '@app/share/models/community';
import { Mber } from '@app/share/models/user/mber.entity';
import { BaseResDto } from '@app/share/dto/default.dto';

/**
 * 게시판 리스트 response -> data field dto
 */
export class BbsResDto {
  @ApiProperty({ example: '1', type: 'string', description: '게시판ID', required: true })
  bbs_id: number;
  @ApiProperty({
    example: '1',
    description: '게시판구분 1: 일반, 2: 구인구직 (FAB137)',
    required: true,
  })
  bbs_se: string;
  @ApiProperty({ example: '1', type: 'string', description: '정렬순서', required: true })
  sort_ordr: number;
  @ApiProperty({ example: '패션의류', description: '게시판명', required: true })
  bbs_nm: string;
  @ApiProperty({
    example: '1',
    description: '작성자구분 1: 익명, 2: 아이디, 3: 닉네임 (FAB133)',
    required: true,
  })
  wrter_se: string;
}

/**
 * 게시판 리스트 response dto
 */
export class GetBbsListResDto extends BaseResDto {
  @ApiProperty({ type: PaginationDto, description: 'pagination' })
  pagination: PaginationDto;
  @ApiProperty({ type: BbsResDto, isArray: true, description: 'data' })
  data: BbsResDto[];
}

/**
 * 게시판->게시글 리스트 response dto -> data field ->list field
 */
export class BbscttItemRes extends PickType(Bbsctt, [
  'bbsctt_id',
  'bbs_id',
  'bbs_ctgry_id',
  'imprtnc_at',
  'mngr_indict_at',
  'expsr_at',
  'wrter_nm',
  'bbsctt_sj',
  'bbsctt_cn',
  'recomend_co',
  'non_recomend_co',
  'click_co',
  'answer_co',
  'sttemnt_co',
  'rgstr_id',
  'created_at',
  'category',
] as const) {}
/**
 * 게시판->게시글 리스트 response dto -> data field ->bbs field
 */
export class BbscttListBbsField extends PickType(Bbs, [
  'bbs_id',
  'bbs_nm',
  'ctgry_use_at',
  'banner_image_use_at',
  'bannerImages',
  'categorys',
  'wrter_se',
] as const) {
  @ApiProperty({ type: BbsCtgry, isArray: true, description: '게시판에 카테고리 []' })
  categorys: BbsCtgry[];
}

/**
 * 게시판->게시글 리스트 response dto
 */
export class GetBbscttListResDto extends BaseResDto {
  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
  @ApiProperty({ type: BbscttItemRes, isArray: true, description: '게시글 리스트 []' })
  data: BbscttItemRes[];
  @ApiProperty({
    type: BbscttListBbsField,
    description: '게시글 상위 게시판 정보(카테고리, 배너이미지)',
  })
  bbs: BbscttListBbsField;
}

/**
 * 게시판->게시글 조회 response dto path -> /community/bbsctt/:bbsctt_id data field -> bbsctt field
 */
export class GetBbscttDetailResDtoDataFieldBbscttField extends BbscttItemRes {
  @ApiProperty({
    example: 'string',
    description:
      '1: 일반, 2: 판매처 마스터, 3: 구매처 마스터, 4: 디자이너, 5: 배달기사, 6: 보드 SuperAdmin, 7: 판매처 직원, 8: 배달업체 마스터, 9: 믹스디 superadmin 회원 구분 (FAB009)',
    required: true,
  })
  mber_se?: string;
  @ApiProperty({ type: BbsCtgry, description: '카테고리 정보' })
  category: BbsCtgry;
  @ApiProperty({ type: BbscttListBbsField, description: '프로필 이미지 경로' })
  profl_image?: string | null;
  @ApiProperty({ type: BbsRecomend, description: '해당 게시물 좋아요 싫어요 정보' })
  my_recomend?: BbsRecomend | null;
  @ApiProperty({
    example: false,
    type: 'boolean',
    description: 'true이면 내가 쓴 게시물 false내가 쓴 게시물 아님',
  })
  my_bbsctt: boolean;
}

export class GetBbscttDetailResDtoPrevNextField extends PickType(BbscttItemRes, [
  'bbsctt_id',
  'bbsctt_sj',
  'bbsctt_cn',
  'answer_co',
  'recomend_co',
] as const) {}

/**
 * 게시판->게시글 조회 response dto path -> /community/bbsctt/:bbsctt_id data field
 */
export class GetBbscttDetailResDtoDataField {
  @ApiProperty({ type: GetBbscttDetailResDtoDataFieldBbscttField, description: '게시글 상세정보' })
  bbsctt?: GetBbscttDetailResDtoDataFieldBbscttField;
  @ApiProperty({ type: GetBbscttDetailResDtoPrevNextField, description: '이전 게시글 정보' })
  prev_bbsctt?: GetBbscttDetailResDtoPrevNextField;
  @ApiProperty({ type: GetBbscttDetailResDtoPrevNextField, description: '다음 게시글 정보' })
  next_bbsctt?: GetBbscttDetailResDtoPrevNextField;
  @ApiProperty({
    example: true,
    type: 'boolean',
    description: '게시글 삭제 여부 true: 이미 삭제 [deleted_at is not null]',
  })
  isDelete?: boolean;
}

/**
 * 게시판->게시글 조회 response dto path -> /community/bbsctt/:bbsctt_id
 */
export class GetBbscttDetailResDto extends BaseResDto {
  @ApiProperty({ type: GetBbscttDetailResDtoDataField, description: 'data' })
  data: GetBbscttDetailResDtoDataField;
}

/**
 * 게시판->게시글 조회-> 댓글추가 조회 response dto dataField
 */
export class PostBbscttAnswerResDtoDataField {
  @ApiProperty({ example: 99, type: Number, description: '등록된 게시물 댓글 ID', required: true })
  bbsctt_answer_id: number;
}
/**
 * 게시판->게시글 조회-> 댓글추가 조회 response dto path -> /community/bbsctt-answer
 */
export class PostBbscttAnswerResDto extends BaseResDto {
  @ApiProperty({ type: PostBbscttAnswerResDtoDataField, description: 'data' })
  data: PostBbscttAnswerResDtoDataField;
}

/**
 * 게시판->게시글 댓글 리스트 조회  response dto path -> /bbsctt-answers/:bbsctt_id data field
 */
export class GetBbscttAnswerListResDtoDataChildAnswersField extends PickType(BbsctAnswer, [
  'bbsctt_answer_id',
  'bbsctt_id',
  'answer_cn',
  'recomend_co',
  'non_recomend_co',
  'rgstr_id',
  'created_at',
  'deleted_at',
  'del_process_at',
  'images',
] as const) {
  @ApiProperty({
    type: BbscttAnswerImage,
    isArray: true,
    description: '댓글의 댓글 이미지 정보',
  })
  images: BbscttAnswerImage[];
  @ApiProperty({
    example: false,
    type: 'boolean',
    isArray: true,
    description: 'true이면 내가 등록한 댓글 false 내가 등록한 댓글 아님',
  })
  my_answer: boolean;
  @ApiProperty({
    example: true,
    type: 'boolean',
    description: '게시글 삭제 여부 true: 이미 삭제 [deleted_at is not null]',
  })
  isDelete?: boolean;
}

/**
 * 게시판->게시글 댓글 리스트 조회  response dto path -> /bbsctt-answers/:bbsctt_id data field
 */
export class GetBbscttAnswerListResDtoDataField extends PickType(BbsctAnswer, [
  'bbsctt_answer_id',
  'bbsctt_id',
  'answer_cn',
  'recomend_co',
  'non_recomend_co',
  'rgstr_id',
  'created_at',
  'deleted_at',
  'del_process_at',
  'wrter_nm',
] as const) {
  @ApiProperty({ type: BbscttAnswerImage, isArray: true, description: '댓글 이미지 정보' })
  images: BbscttAnswerImage[];
  @ApiProperty({
    type: GetBbscttAnswerListResDtoDataChildAnswersField,
    isArray: true,
    description: '댓글의 댓글 리스트 정보',
  })
  answers: GetBbscttAnswerListResDtoDataChildAnswersField[];
  @ApiProperty({
    example: false,
    type: 'boolean',
    isArray: true,
    description: 'true이면 내가 등록한 댓글 false 내가 등록한 댓글 아님',
  })
  my_answer: boolean;
  @ApiProperty({
    example: '1',
    description: '추천구분 1: 좋아요, 2: 싫어요, null: 좋아요 싫어요 안함 (FAB136)',
    required: true,
  })
  my_recomend_se: string | null;
  @ApiProperty({
    example: true,
    type: 'boolean',
    description: '게시글 삭제 여부 true: 이미 삭제 [deleted_at is not null]',
  })
  isDelete?: boolean;
}

/**
 * 게시판->게시글 댓글 리스트 조회  response dto path -> /bbsctt-answers/:bbsctt_id
 */
export class GetBbscttAnswerListResDto extends BaseResDto {
  @ApiProperty({ type: GetBbscttAnswerListResDtoDataField, isArray: true, description: 'data' })
  data: GetBbscttAnswerListResDtoDataField[];
  @ApiProperty({ type: PaginationDto, description: 'pagination' })
  pagination: PaginationDto;
}
/**
 * 게시판 카테고리 리스트 조회
 */
export class GetBbsCategoryResDto extends BaseResDto {
  @ApiProperty({ type: BbscttListBbsField, description: 'data' })
  data: BbscttListBbsField;
}

/**
 * 게시판->게시글 조회-> 댓글추가 조회 response dto dataField
 */
export class PostBbscttResDtoDataField {
  @ApiProperty({ example: 99, type: Number, description: '새로 등록된 게시물 ID', required: true })
  bbsctt_id: number;
}
/**
 * 게시판->게시글 조회-> 댓글추가 조회 response dto path -> /community/bbsctt-answer
 */
export class PostBbscttResDto extends BaseResDto {
  @ApiProperty({ type: PostBbscttResDtoDataField, description: 'data' })
  data: PostBbscttResDtoDataField;
}

export class RecomendResDto extends BaseResDto {
  @ApiProperty({
    example: 'string',
    description: '추천구분 1: 좋아요, 2: 싫어요 (FAB136)',
    required: true,
  })
  recomend_se: string;
  @ApiProperty({ example: 'string', description: 'message', required: true })
  message: string;
}
