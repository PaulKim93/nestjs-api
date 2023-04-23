import { Bbsctt, BbsRecomend } from '@app/share/models/community';
export interface IBbscttDetail extends Bbsctt {
  my_recomend?: BbsRecomend;
}
