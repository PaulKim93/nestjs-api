//회원 구분
const mber_se = {
  NORMAL: '1',
  BOARD_SUBER_ADMIN: '6',
} as const;
export type MBER_SE = (typeof mber_se)[keyof typeof mber_se];
export const MBER_SE_ENUM: ReadonlyRecord<any, MBER_SE> = {
  NORMAL: '1',
  BOARD_SUBER_ADMIN: '6',
};

//회원 상태
const mber_sttus = {
  NORMAL: '1',
  HUMAN: '2',
  WITHDRAW: '3',
} as const;
export type MBER_STTUS = (typeof mber_sttus)[keyof typeof mber_sttus];
export const MBER_STTUS_ENUM: ReadonlyRecord<any, MBER_STTUS> = {
  NORMAL: '1',
  HUMAN: '2',
  WITHDRAW: '3',
};

//모든 여부
const expsr_at = {
  Y: '1',
  N: '2',
} as const;
export type EXPSR_AT = (typeof expsr_at)[keyof typeof expsr_at];
export const EXPSR_AT_ENUM: ReadonlyRecord<any, EXPSR_AT> = {
  Y: '1',
  N: '2',
};
