import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BbsImage, BbsCtgry, Bbsctt } from '@app/share/models/community';
import { ApiProperty } from '@nestjs/swagger';

//게시판
@Entity('bbs')
export class Bbs extends BaseEntity {
  @ApiProperty({ example: 1, type: Number, description: '게시판ID', required: true })
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '게시판ID' })
  bbs_id!: number;
  @ApiProperty({
    example: 'string',
    description: '게시판게시판구분 1: 일반, 2: 구인구직 (FAB137)구분',
  })
  @Column({ type: 'varchar', comment: '게시판구분 1: 일반, 2: 구인구직 (FAB137)', length: 4 })
  bbs_se: string;
  @ApiProperty({ example: 'string', description: '게시판명' })
  @Column({ type: 'varchar', comment: '게시판명', length: 50 })
  bbs_nm!: string;
  @ApiProperty({ example: 'string', description: '노출여부 1: Y, 2: N (FAB001)' })
  @Column({ type: 'varchar', comment: '노출여부 1: Y, 2: N (FAB001)', length: 4 })
  expsr_at: string;
  @ApiProperty({
    example: 'string',
    description: '작성자구분 1: 익명, 2: 아이디, 3: 닉네임 (FAB133)',
  })
  @Column({
    type: 'varchar',
    comment: '작성자구분 1: 익명, 2: 아이디, 3: 닉네임 (FAB133)',
    length: 4,
  })
  wrter_se: string;
  @ApiProperty({ example: 'string', description: '페이지여부 1: Y, 2: N (FAB001)' })
  @Column({ type: 'varchar', comment: '페이지여부 1: Y, 2: N (FAB001)', length: 4 })
  pge_at: string;
  @ApiProperty({ example: 1, type: Number, description: '정렬순서' })
  @Column({ type: 'integer', comment: '정렬순서' })
  sort_ordr: number;
  @ApiProperty({ example: 1, type: Number, description: '부모게시판id' })
  @Column({ type: 'bigint', comment: '부모게시판id' })
  parnts_bbs_id: number;
  @ApiProperty({ example: 1, type: Number, description: '게시판깊이' })
  @Column({ type: 'integer', comment: '게시판깊이' })
  dlvy_bbc_dp: number;
  @ApiProperty({ example: 'string', description: '글작성여부 1: Y, 2: N (FAB001)' })
  @Column({ type: 'varchar', comment: '글작성여부 1: Y, 2: N (FAB001)', length: 4 })
  sntnc_writng_at: string;
  @ApiProperty({ example: 'string', description: '댓글작성여부  1: Y, 2: N (FAB001)' })
  @Column({ type: 'varchar', comment: '댓글작성여부  1: Y, 2: N (FAB001)', length: 4 })
  answer_writng_at: string;
  @ApiProperty({ example: 'string', description: '카테고리사용여부  1: Y, 2: N (FAB001)' })
  @Column({ type: 'varchar', comment: '카테고리사용여부  1: Y, 2: N (FAB001)', length: 4 })
  ctgry_use_at: string;
  @ApiProperty({ example: 'string', description: '배너이미지사용여부 1: Y, 2: N (FAB001)' })
  @Column({ type: 'varchar', comment: '배너이미지사용여부 1: Y, 2: N (FAB001)', length: 4 })
  banner_image_use_at: string;
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

  @ApiProperty({ type: BbsImage, isArray: true, description: '게시판에 등록된 배너 이미지 []' })
  @OneToMany(() => BbsImage, (item) => item.bbs)
  bannerImages: BbsImage[];
  @ApiProperty({ type: BbsCtgry, isArray: true, description: '게시판에 카테고리 []' })
  @OneToMany(() => BbsCtgry, (item) => item.bbs)
  categorys: BbsCtgry[];
  @OneToMany(() => Bbsctt, (item) => item.bbs)
  bbsctts: Bbsctt[];
}
