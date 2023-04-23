type ReadonlyRecord<K extends string, V> = Readonly<Record<K, V>>;
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
