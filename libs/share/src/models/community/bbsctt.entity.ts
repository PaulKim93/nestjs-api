import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import {
  Bbs,
  BbsCttClick,
  BbsctAnswer,
  BbsCtgry,
  BbsRecomend,
  BbsSttemnt,
} from '@app/share/models/community';
import { Mber } from '@app/share/models/user/mber.entity';
import { ApiProperty } from '@nestjs/swagger';

//게시판->게시글
@Entity('bbsctt')
export class Bbsctt extends BaseEntity {
  @ApiProperty({ example: 1, type: Number, description: '게시글ID', required: true })
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '게시글ID' })
  bbsctt_id!: number;
  @ApiProperty({ example: 1, type: Number, description: '게시판ID' })
  @Column({ type: 'bigint', comment: '게시판ID' })
  bbs_id!: number;
  @ApiProperty({
    example: 1,
    type: Number,
    description: '게시판카테고리 ID ',
    required: false,
    default: null,
  })
  @Column({ type: 'bigint', comment: '게시판카테고리ID' })
  bbs_ctgry_id: number;
  @ApiProperty({
    example: 'string',
    description: '공지 표시 여부 1:Y, 2:N (001)',
    required: true,
    default: '2',
  })
  @Column({ type: 'varchar', comment: '중요여부', length: 4 })
  imprtnc_at: string;
  @ApiProperty({ example: 'string', description: '관리자표시여부' })
  @Column({ type: 'varchar', comment: '관리자표시여부', length: 4 })
  mngr_indict_at: string;
  @ApiProperty({ example: 'string', description: '작성자명 length: 100', required: false })
  @Column({ type: 'varchar', comment: '작성자명', length: 100 })
  wrter_nm: string;
  @ApiProperty({ example: 'string', description: '게시글제목 length: 255' })
  @Column({ type: 'varchar', comment: '게시글제목', length: 255 })
  bbsctt_sj: string;
  @ApiProperty({ example: 'string HTML', description: '게시글내용' })
  @Column({ type: 'text', comment: '게시글내용' })
  bbsctt_cn: string;
  @ApiProperty({ example: 'string', description: '노출여부' })
  @Column({ type: 'varchar', comment: '노출여부', length: 4 })
  expsr_at: string;
  @ApiProperty({ example: 1, type: Number, description: '추천수' })
  @Column({ type: 'integer', comment: '추천수' })
  recomend_co: number;
  @ApiProperty({ example: 1, type: Number, description: '비추천수' })
  @Column({ type: 'integer', comment: '비추천수' })
  non_recomend_co: number;
  @ApiProperty({ example: 1, type: Number, description: '클릭수' })
  @Column({ type: 'integer', comment: '클릭수' })
  click_co: number;
  @ApiProperty({ example: 1, type: Number, description: '댓글수' })
  @Column({ type: 'integer', comment: '댓글수' })
  answer_co: number;
  @ApiProperty({ example: 1, type: Number, description: '신고횟수' })
  @Column({ type: 'integer', comment: '신고횟수' })
  sttemnt_co: number;
  @ApiProperty({ example: 'string', description: '처리구분' })
  @Column({ type: 'varchar', comment: '처리구분 삭제처리여부 (140)', length: 4 })
  del_process_at: string;
  @ApiProperty({ example: 1, type: Number, description: '등록자ID', required: true })
  @Column({ type: 'bigint', comment: '등록자ID' })
  rgstr_id: number;
  @ApiProperty({ example: 'datetime', description: '등록일시', nullable: true })
  @Column({ type: 'datetime', comment: '등록일시' })
  created_at: Date;
  @ApiProperty({ example: 1, type: Number, description: '수정자ID' })
  @Column({ type: 'bigint', comment: '수정자ID' })
  upd_usr_id: number;
  @ApiProperty({ example: 'datetime', description: '수정일시' })
  @Column({ type: 'datetime', comment: '수정일시' })
  updated_at: Date;
  @ApiProperty({ example: 'datetime', description: '삭제일시' })
  @Column({ type: 'datetime', comment: '삭제일시' })
  deleted_at: Date;

  @ManyToOne(() => Bbs, (item) => item.bannerImages)
  @JoinColumn({ name: 'bbs_id', referencedColumnName: 'bbs_id' })
  bbs?: Bbs;

  @OneToMany(() => BbsCttClick, (item) => item.post)
  cliks?: BbsCttClick[];

  @OneToMany(() => BbsctAnswer, (item) => item.post)
  answers?: BbsctAnswer[];

  @OneToMany(() => BbsRecomend, (item) => item.post)
  recomends?: BbsRecomend[];

  @OneToMany(() => BbsSttemnt, (item) => item.post)
  sttemnts?: BbsSttemnt[];

  @OneToOne(() => BbsCtgry)
  @ApiProperty({ type: BbsCtgry, description: '수정자ID' })
  @JoinColumn({ name: 'bbs_ctgry_id', referencedColumnName: 'bbs_ctgry_id' })
  category?: BbsCtgry;

  @ManyToOne(() => Mber, (item) => item.bbsctts)
  @JoinColumn({ name: 'rgstr_id', referencedColumnName: 'mber_id' })
  user?: Mber;
}
