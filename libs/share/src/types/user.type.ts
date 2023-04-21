type ReadonlyRecord<K extends string, V> = Readonly<Record<K, V>>;
//리스트 정렬 검색필터
const order_filter = {
  DESC: '-1',
  ASC: '1',
} as const;
export type ORDER_FILTER = (typeof order_filter)[keyof typeof order_filter];
export const ORDER_FILTER_ENUM: ReadonlyRecord<any, ORDER_FILTER> = {
  DESC: '-1',
  ASC: '1',
};
