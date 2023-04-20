import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bbsctt, BbsctAnswer } from '@app/share/models/community';
import { ApiProperty } from '@nestjs/swagger';

//게시판->게시글->게시판추천
@Entity('bbs_recomend')
export class BbsRecomend extends BaseEntity {
  @ApiProperty({ example: 1, type: Number, description: '게시판추천ID', required: true })
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '게시판추천ID' })
  bbs_recomend_id: number;
  @ApiProperty({ example: 1, type: Number, description: '게시글ID', required: true })
  @Column({ type: 'bigint', comment: '게시글ID' })
  bbsctt_id: number;
  @ApiProperty({ example: 1, type: Number, description: '게시글댓글ID' })
  @Column({ type: 'bigint', comment: '게시글댓글ID' })
  bbsctt_answer_id: number;
  @ApiProperty({
    example: 'string',
    description: '추천구분 1: 좋아요, 2: 싫어요 (136)',
    required: true,
  })
  @Column({ type: 'varchar', comment: ' 1: 좋아요, 2: 싫어요 (136)', length: 4 })
  recomend_se: string;
  @ApiProperty({ example: 1, type: Number, description: '등록자ID', required: true })
  @Column({ type: 'bigint', comment: '등록자ID' })
  rgstr_id: number;
  @ApiProperty({ example: 'datetime', description: '등록일시', nullable: true, required: true })
  @Column({ type: 'datetime', comment: '등록일시' })
  created_at: Date;

  @ManyToOne(() => Bbsctt, (item) => item.recomends)
  @JoinColumn({ name: 'bbsctt_id', referencedColumnName: 'bbsctt_id' })
  post: Bbsctt;

  @ManyToOne(() => BbsctAnswer, (item) => item.recomends)
  @JoinColumn({ name: 'bbsctt_answer_id', referencedColumnName: 'bbsctt_answer_id' })
  answer: BbsctAnswer;
}
