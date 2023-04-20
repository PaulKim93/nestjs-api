import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bbsctt } from '@app/share/models/community';
import { ApiProperty } from '@nestjs/swagger';

//게시판->게시글->게시판신고
@Entity('bbs_sttemnt')
export class BbsSttemnt extends BaseEntity {
  @ApiProperty({ example: 1, type: Number, description: '게시판신고ID', required: true })
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '게시판신고ID' })
  bbs_sttemnt_id!: number;
  @ApiProperty({ example: 1, type: Number, description: '게시글ID', required: true })
  @Column({ type: 'bigint', comment: '게시글ID' })
  bbsctt_id: number;
  @ApiProperty({ example: 1, type: Number, description: '게시글댓글ID', required: true })
  @Column({ type: 'bigint', comment: '게시글댓글ID' })
  bbsctt_answer_id: number;
  @ApiProperty({
    example: 'string',
    description:
      '신고종류 1:욕설,비방,차별,혐오, 2: 홍보,도배,스팸, 3:불법정보, 4:음란물, 5:개인 정보 노출,유포,거래, 6:기타',
    required: true,
  })
  @Column({ type: 'varchar', comment: '신고종류', length: 4 })
  sttemnt_knd: string;
  @ApiProperty({ example: 'string', description: '기타사유 max_length: 255', required: true })
  @Column({ type: 'varchar', comment: '기타사유', length: 255 })
  etc_resn: string;
  @ApiProperty({ example: 1, type: Number, description: '등록자ID', required: true })
  @Column({ type: 'bigint', comment: '등록자ID' })
  rgstr_id: number;
  @ApiProperty({
    example: 1,
    type: Number,
    description: '삭제처리여부 1: 신고 2: 삭제 3: 반려(140)',
  })
  @Column({ type: 'varchar', length: 4, comment: '삭제처리여부 1: 신고 2: 삭제 3: 반려(140)' })
  del_process_at: string;
  @ApiProperty({ example: 'datetime', description: '등록일시', nullable: true, required: true })
  @Column({ type: 'datetime', comment: '등록일시' })
  created_at: Date;

  @ManyToOne(() => Bbsctt, (item) => item.recomends)
  @JoinColumn({ name: 'bbsctt_id', referencedColumnName: 'bbsctt_id' })
  post: Bbsctt;
}
