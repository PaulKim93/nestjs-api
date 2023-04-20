import { Column, Entity, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

//게시판 금칙용어
@Entity('prhibt_word')
export class PrhibtWord extends BaseEntity {
  @ApiProperty({ example: 1, type: Number, description: '금칙용어ID', required: true })
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '금칙용어ID' })
  prhibt_word_id!: number;
  @ApiProperty({ example: 'string', description: '적용구분 (FAB138)' })
  @Column({ type: 'varchar', comment: '적용구분 (FAB138)', length: 4 })
  applc_se: string;
  @ApiProperty({ example: 'string', description: '금칙용어' })
  @Column({ type: 'varchar', comment: '금칙용어', length: 255 })
  prhibt_word: string;
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
}
