import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Bbsctt } from '@app/share/models/community';
import * as bcrypt from 'bcrypt';

//회원
@Entity('mber')
export class Mber extends BaseEntity {
  @ApiProperty({ example: 1, description: '회원ID', required: true, nullable: true })
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '회원ID' })
  mber_id!: number;
  @ApiProperty({
    example: '1',
    description: '회원구분 1: 일반, 6: SuperAdmin',
    required: true,
    nullable: true,
  })
  @Column({
    type: 'varchar',
    comment: '회원구분 1: 일반, 6: SuperAdmin',
    length: 4,
    nullable: true,
  })
  mber_se!: string;
  @ApiProperty({
    example: '1',
    description: '회원상태 1:정상, 2:휴면, 3: 탈퇴',
    required: true,
    nullable: true,
  })
  @Column({
    type: 'varchar',
    comment: '회원상태 1:정상, 2:휴면, 3: 탈퇴',
    length: 4,
    nullable: true,
  })
  mber_sttus!: string;
  @ApiProperty({ example: 'string', description: '사용자 아이디', required: true, nullable: true })
  @Column({ type: 'varchar', comment: '로그인 아이디', length: 255, nullable: true })
  login_id!: string;
  @ApiProperty({
    example: 'string',
    description: '사용자 비밀번호',
    required: true,
    nullable: true,
  })
  @Column({ type: 'varchar', comment: '비밀번호', length: 255, nullable: true })
  password!: string;
  @ApiProperty({ example: 'string', description: '이름', required: true, nullable: false })
  @Column({ type: 'varchar', comment: '이름', length: 50, nullable: false })
  nm: string;
  @ApiProperty({
    example: 'string',
    description: '닉네임 (null 이면 등록되지 않은 상태)',
    required: true,
    nullable: false,
  })
  @ApiProperty({ example: 'string', description: '생년월일', required: true, nullable: false })
  @Column({ type: 'char', comment: '생년월일', length: 10, nullable: false })
  brthdy: string;
  @ApiProperty({
    example: '1',
    description: '성별 1:남, 2:여',
    required: true,
    nullable: false,
  })
  @Column({ type: 'varchar', comment: '성별 1:남, 2:여', length: 4, nullable: false })
  sexdstn: string;
  @ApiProperty({ example: 'string', description: '휴대폰번호', required: true, nullable: false })
  @Column({ type: 'varchar', comment: '휴대폰번호', length: 30, nullable: false })
  mp_no: string;
  @ApiProperty({ example: 'string', description: '프로필 이미지', required: true, nullable: false })
  @Column({ type: 'varchar', comment: '프로필 이미지', length: 255, nullable: false })
  profl_image: string;
  @ApiProperty({
    example: 'datetime',
    description: '마지막접속일시',
    required: true,
    nullable: false,
  })
  @ApiProperty({ example: 'datetime', description: '가입 일시', required: true, nullable: true })
  @Column({ type: 'datetime', default: new Date(), comment: '가입 일시', nullable: true })
  sbscrb_dt!: Date;
  @ApiProperty({ example: 'string', description: '가입iP', required: true, nullable: false })
  @Column({ type: 'varchar', comment: '가입iP', length: 50, nullable: false })
  sbscrb_ip: string;
  @ApiProperty({
    example: '1',
    description:
      '승인상태 1: 승인, 2: 승인대기, 3: 거절, 4: 승인요청, 5: 승인보류, 6: 제외대상, 7: 재승인, 8: 탈퇴',
    required: true,
    nullable: false,
  })
  @Column({
    type: 'varchar',
    comment:
      '승인상태 1: 승인, 2: 승인대기, 3: 거절, 4: 승인요청, 5: 승인보류, 6: 제외대상, 7: 재승인, 8: 탈퇴',
    length: 4,
    nullable: false,
  })
  confm_sttus: string;
  @ApiProperty({ example: 'datetime', description: '승인일시', required: true, nullable: false })
  @Column({ type: 'datetime', comment: '승인일시', nullable: false })
  confm_dt: Date;
  @ApiProperty({
    example: 'string',
    description: '탈퇴유형 1: 강퇴, 2: 자퇴, 3: 계약해지',
    required: true,
    nullable: false,
  })
  @Column({
    type: 'varchar',
    comment: '탈퇴유형 1: 강퇴, 2: 자퇴, 3: 계약해지',
    length: 4,
    nullable: false,
  })
  secsn_ty: string;
  @ApiProperty({ example: 'datetime', description: '탈퇴일시', required: true, nullable: false })
  @Column({ type: 'datetime', comment: '탈퇴일시', nullable: false })
  secsn_dt: Date;
  @ApiProperty({ example: 'string', description: '탈퇴사유', required: true, nullable: false })
  @Column({ type: 'varchar', comment: '탈퇴사유', length: 255, nullable: false })
  secsn_resn: string;

  //게시물들
  @OneToMany(() => Bbsctt, (item) => item.user)
  bbsctts: Bbsctt[];

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
