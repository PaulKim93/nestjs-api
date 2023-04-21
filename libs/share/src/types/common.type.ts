type ReadonlyRecord<K extends string, V> = Readonly<Record<K, V>>;

// 회원접속 기기정보
const mhrls_se = {
  WEB: '1',
  APP: '2',
} as const;
export type MHRLS_SE = (typeof mhrls_se)[keyof typeof mhrls_se];
export const MHRLS_SE_ENUM: ReadonlyRecord<any, MHRLS_SE> = {
  WEB: '1',
  APP: '2',
};
//회원 구분
const mber_se = {
  NORMAL: '1',
  SELLER_MARSTER: '2',
  BUYER_MARSTER: '3',
  DESIGNER: '4',
  DELIVERY_MAN: '5',
  BOARD_SUBER_ADMIN: '6',
  SELLER_EMPL: '7',
  DELIVERY_MARSTER: '8',
  MIXED_SUPER_ADMIN: '9',
} as const;
export type MBER_SE = (typeof mber_se)[keyof typeof mber_se];
export const MBER_SE_ENUM: ReadonlyRecord<any, MBER_SE> = {
  NORMAL: '1',
  SELLER_MARSTER: '2',
  BUYER_MARSTER: '3',
  DESIGNER: '4',
  DELIVERY_MAN: '5',
  BOARD_SUBER_ADMIN: '6',
  SELLER_EMPL: '7',
  DELIVERY_MARSTER: '8',
  MIXED_SUPER_ADMIN: '9',
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

//모든 여부
const prhibt_word_applc_se = {
  CON: '1',
  NICK_NAME: '2',
} as const;
export type PRHIBT_WORD_APPLC_SE = (typeof prhibt_word_applc_se)[keyof typeof prhibt_word_applc_se];
export const PRHIBT_WORD_APPLC_SE_ENUM: ReadonlyRecord<any, PRHIBT_WORD_APPLC_SE> = {
  CON: '1',
  NICK_NAME: '2',
};
