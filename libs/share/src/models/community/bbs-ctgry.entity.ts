import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bbs } from '@app/share/models/community';
import { ApiProperty } from '@nestjs/swagger';

//게시판->카테고리
@Entity('bbs_ctgry')
export class BbsCtgry extends BaseEntity {
  @ApiProperty({ example: 1, type: Number, description: '게시판카테고리ID', required: true })
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '게시판카테고리ID' })
  bbs_ctgry_id!: number;
  @ApiProperty({ example: 1, type: Number, description: '게시판ID', required: true })
  @Column({ type: 'bigint', comment: '게시판ID' })
  bbs_id: number;
  @ApiProperty({ example: 'string', description: '카테고리명', required: true })
  @Column({ type: 'varchar', comment: '카테고리명', length: 50 })
  ctgry_nm: string;
  @ApiProperty({ example: 1, type: Number, description: '등록자ID', required: true })
  @Column({ type: 'bigint', comment: '등록자ID' })
  rgstr_id: number;
  @ApiProperty({ example: 'datetime', description: '등록일시', nullable: true, required: true })
  @Column({ type: 'datetime', comment: '등록일시' })
  created_at: Date;
  @ApiProperty({ example: 1, type: Number, description: '수정자ID', required: true })
  @Column({ type: 'bigint', comment: '수정자ID' })
  upd_usr_id: number;
  @ApiProperty({ example: 'datetime', description: '수정일시', required: true })
  @Column({ type: 'datetime', comment: '수정일시' })
  updated_at: Date;
  @ApiProperty({ example: 'datetime', description: '삭제일시', required: true })
  @Column({ type: 'datetime', comment: '삭제일시' })
  deleted_at: Date;

  @ManyToOne(() => Bbs, (item) => item.bannerImages)
  @JoinColumn({ name: 'bbs_id', referencedColumnName: 'bbs_id' })
  bbs: Bbs;
}
