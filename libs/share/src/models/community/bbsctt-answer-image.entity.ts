import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BbsctAnswer } from '@app/share/models/community';
import { ApiProperty } from '@nestjs/swagger';

//게시판->게시글->게시글댓글->댓글 첨부이미지
@Entity('bbsctt_answer_image')
export class BbscttAnswerImage extends BaseEntity {
  @ApiProperty({ example: 1, type: Number, description: '게시글댓글이미지ID', required: true })
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '게시글댓글이미지ID' })
  bbsctt_answer_image_id!: number;
  @ApiProperty({ example: 1, type: Number, description: '게시글댓글ID' })
  @Column({ type: 'bigint', comment: '게시글댓글ID' })
  bbsctt_answer_id: number;
  @ApiProperty({ example: 'string', description: '원본배너이미지 length: 255' })
  @Column({ type: 'varchar', comment: '원본배너이미지 length: 255', length: 255 })
  orginl_image: string;
  @ApiProperty({ example: 'string', description: '변환배너이미지 length: 255' })
  @Column({ type: 'varchar', comment: '변환배너이미지', length: 255 })
  cnvr_image: string;
  @ApiProperty({ example: 1, type: Number, description: '등록자ID' })
  @Column({ type: 'bigint', comment: '등록자ID' })
  rgstr_id: number;
  @ApiProperty({ example: 'datetime', description: '등록일시' })
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

  @ManyToOne(() => BbsctAnswer, (item) => item.images)
  @JoinColumn({ name: 'bbsctt_answer_id', referencedColumnName: 'bbsctt_answer_id' })
  answer: BbsctAnswer;
}
