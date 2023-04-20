import { Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BbscttAnswerImage, BbsctAnswer } from '@app/share/models/community';
import { ApiProperty } from '@nestjs/swagger';

//게시판->게시글->게시글댓글->답글
@Entity('fab_bbsctt_answer')
export class BbsctAnswerTree extends BbsctAnswer {
  @ManyToOne(() => BbsctAnswer, (item) => item.answers)
  @JoinColumn({ name: 'parnts_bbsctt_answer_id', referencedColumnName: 'bbsctt_answer_id' })
  answer: BbsctAnswer;

  @ApiProperty({ type: BbscttAnswerImage, isArray: true, description: '댓글의 등록된 이미지' })
  @OneToMany(() => BbscttAnswerImage, (item) => item.answer)
  images: BbscttAnswerImage[];
}
