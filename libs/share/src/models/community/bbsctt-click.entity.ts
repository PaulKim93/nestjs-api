import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bbsctt } from '@app/share/models/community';
import { ApiProperty } from '@nestjs/swagger';

//게시판->게시글->게시글클릭
@Entity('bbsctt_click')
export class BbsCttClick extends BaseEntity {
  @ApiProperty({ example: 1, type: Number, description: '게시글클릭ID', required: true })
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '게시글클릭ID' })
  bbsctt_click_id!: number;
  @ApiProperty({ example: 1, type: Number, description: '게시글ID' })
  @Column({ type: 'bigint', comment: '게시글ID' })
  bbsctt_id!: number;
  @ApiProperty({ example: 1, type: Number, description: '등록자ID', required: true })
  @Column({ type: 'bigint', comment: '등록자ID' })
  rgstr_id: number;
  @ApiProperty({ example: 'datetime', description: '등록일시', nullable: true })
  @Column({ type: 'datetime', comment: '등록일시' })
  created_at: Date;

  @ManyToOne(() => Bbsctt, (post) => post.cliks)
  @JoinColumn({ name: 'bbsctt_id', referencedColumnName: 'bbsctt_id' })
  post: Bbsctt;
}
