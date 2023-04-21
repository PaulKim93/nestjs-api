import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bbsctt, BbscttAnswerImage, BbsRecomend } from '@app/share/models/community';
import { ApiProperty } from '@nestjs/swagger';

//게시판->게시글->게시글댓글
@Entity('bbsctt_answer')
export class BbsctAnswer extends BaseEntity {
  @ApiProperty({ example: 1, type: Number, description: '게시글댓글ID', required: true })
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '게시글댓글ID' })
  bbsctt_answer_id!: number;
  @ApiProperty({ example: 1, type: Number, description: '게시글ID' })
  @Column({ type: 'bigint', comment: '게시글ID' })
  bbsctt_id: number;
  @ApiProperty({ example: 1, type: Number, description: '부모게시글댓글ID', required: false })
  @Column({ type: 'bigint', comment: '부모게시글댓글ID' })
  parnts_bbsctt_answer_id: number;
  @ApiProperty({ example: 'string', description: '작성자명 length: 100', required: false })
  @Column({ type: 'varchar', comment: '작성자명', length: 100 })
  wrter_nm: string;
  @ApiProperty({ example: 'string', description: '댓글내용 length: 255' })
  @Column({ type: 'varchar', comment: '댓글내용', length: 255 })
  answer_cn: string;
  @ApiProperty({ example: 'string', description: '노출여부 1:Y, 2:N' })
  @Column({ type: 'varchar', comment: '노출여부 1:Y, 2:N', length: 4 })
  expsr_at: string;
  @ApiProperty({ example: 1, type: Number, description: '추천수' })
  @Column({ type: 'integer', comment: '추천수' })
  recomend_co: number;
  @ApiProperty({ example: 1, type: Number, description: '비추천수' })
  @Column({ type: 'integer', comment: '비추천수' })
  non_recomend_co: number;
  @ApiProperty({ example: 1, type: Number, description: '신고횟수' })
  @Column({ type: 'integer', comment: '신고횟수' })
  sttemnt_co: number;
  @ApiProperty({ example: 'string', description: '삭제처리여부 1: 신고, 2: 삭제, 3: 반려' })
  @Column({ type: 'varchar', comment: '삭제처리여부 1: 신고, 2: 삭제, 3: 반려', length: 4 })
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

  @ManyToOne(() => Bbsctt, (item) => item.answers)
  @JoinColumn({ name: 'bbsctt_id', referencedColumnName: 'bbsctt_id' })
  bbsctt: Bbsctt;

  //댓글의 등록된 이미지
  @OneToMany(() => BbscttAnswerImage, (item) => item.answer)
  images: BbscttAnswerImage[];

  //댓글의 좋아요, 싫어요 정보
  @OneToMany(() => BbsRecomend, (item) => item.answer)
  recomends: BbsRecomend[];

  //자식 답글
  @OneToMany(() => BbsctAnswer, (item) => item.parent_answer)
  child_answers?: BbsctAnswer[];

  //부모 답글
  @ManyToOne(() => BbsctAnswer, (item) => item.child_answers)
  @JoinColumn({ name: 'parnts_bbsctt_answer_id', referencedColumnName: 'bbsctt_answer_id' })
  parent_answer?: BbsctAnswer;
}
