type ReadonlyRecord<K extends string, V> = Readonly<Record<K, V>>;
//게시글 리스트 검색필터
const bbsctt_filter = {
  SUBJECT: '1',
  CONTENTS: '2',
  SUBANDCON: '3',
} as const;
export type BBSCTT_FILTER = (typeof bbsctt_filter)[keyof typeof bbsctt_filter];
export const BBSCTT_FILTER_ENUM: ReadonlyRecord<any, BBSCTT_FILTER> = {
  SUBJECT: '1',
  CONTENTS: '2',
  SUBANDCON: '3',
};
//게시글 리스트 정렬필터
const bbtctt_order_filter = {
  CREATED: '1',
  RECOMEND: '2',
  CLICK: '3',
  ANSWER: '4',
} as const;

export type BBSCTT_ORDER_FILTER = (typeof bbtctt_order_filter)[keyof typeof bbtctt_order_filter];
export const BBSCTT_ORDER_FILTER_ENUM: ReadonlyRecord<any, BBSCTT_ORDER_FILTER> = {
  CREATED: '1',
  RECOMEND: '2',
  CLICK: '3',
  ANSWER: '4',
};

//게시글 리스트 정렬필터
const bbtctt_recomend = {
  LIKE: '1',
  DIS_LIKE: '2',
} as const;
export type BBSCTT_RECOMEND = (typeof bbtctt_recomend)[keyof typeof bbtctt_recomend];
export const BBSCTT_RECOMEND_ENUM: ReadonlyRecord<any, BBSCTT_RECOMEND> = {
  LIKE: '1',
  DIS_LIKE: '2',
};

//게시글 리스트 정렬필터
const bbtctt_sttemnt = {
  TYPE_1: '1',
  TYPE_2: '2',
  TYPE_3: '3',
  TYPE_4: '4',
  TYPE_5: '5',
  TYPE_6: '6',
} as const;
export type BBSCTT_STTEMNT = (typeof bbtctt_sttemnt)[keyof typeof bbtctt_sttemnt];
export const BBSCTT_STTEMNT_ENUM: ReadonlyRecord<any, BBSCTT_STTEMNT> = {
  TYPE_1: '1',
  TYPE_2: '2',
  TYPE_3: '3',
  TYPE_4: '4',
  TYPE_5: '5',
  TYPE_6: '6',
};

//게시글 삭제 여부
const bbtctt_del_at = {
  REPORT: '1',
  DEL: '2',
  REJECT: '3',
} as const;

export type BBSCTT_DEL_AT = (typeof bbtctt_del_at)[keyof typeof bbtctt_del_at];
export const BBSCTT_DEL_AT_ENUM: ReadonlyRecord<any, BBSCTT_DEL_AT> = {
  REPORT: '1',
  DEL: '2',
  REJECT: '3',
};
