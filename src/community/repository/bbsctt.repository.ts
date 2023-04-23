import { Injectable } from '@nestjs/common';
import { Repository, DataSource, Like, Brackets, IsNull, Not } from 'typeorm';
import { Bbsctt } from '@app/share/models/community';
import { BbscttListDto } from '@api/community/dto/req.dto';
import { EXPSR_AT_ENUM } from '@app/share/types/user.type';
import {
  BBSCTT_FILTER_ENUM,
  BBSCTT_ORDER_FILTER_ENUM,
  BBSCTT_DEL_AT_ENUM,
} from '@app/share/types/community.type';
import { BbscttItemRes } from '../dto/res.dto';

@Injectable()
export class BbscttRepositroy extends Repository<Bbsctt> {
  constructor(private dataSource: DataSource) {
    super(Bbsctt, dataSource.createEntityManager());
  }

  /**
   * 게시글 리스트 조회
   * @param bbs_id 게시판 고유키
   * @param req BbscttListDto
   * @returns
   */
  async bbscttList(
    bbs_id: string,
    req: BbscttListDto,
  ): Promise<{ list: BbscttItemRes[]; total: number }> {
    try {
      const {
        bbs_ctgry_id = '',
        imprtnc_at = EXPSR_AT_ENUM.Y,
        order_type = BBSCTT_ORDER_FILTER_ENUM.CREATED,
        page,
        per_page,
        search = '',
        //search_filter= BBSCTT_FILTER_ENUM.SUBJECT,
      } = req;

      // BBSCTT_FILTER_ENUM api 검색필터 삭제 제목+내용 검색으로 고정
      const search_filter = BBSCTT_FILTER_ENUM.SUBANDCON;

      const take = Number(per_page);
      const skip = (Number(page) - 1) * Number(per_page);
      const order = {};
      //공지 상단표시
      if (imprtnc_at === EXPSR_AT_ENUM.Y) order['bbsctt.imprtnc_at'] = 'ASC';
      //정렬 필터
      if (order_type === BBSCTT_ORDER_FILTER_ENUM.CREATED) order['bbsctt.created_at'] = 'DESC';
      else if (order_type === BBSCTT_ORDER_FILTER_ENUM.RECOMEND)
        order['bbsctt.recomend_co'] = 'DESC';
      else if (order_type === BBSCTT_ORDER_FILTER_ENUM.CLICK) order['bbsctt.click_co'] = 'DESC';
      else if (order_type === BBSCTT_ORDER_FILTER_ENUM.ANSWER) order['bbsctt.answer_co'] = 'DESC';

      const query = this.dataSource
        .createQueryBuilder(Bbsctt, 'bbsctt')
        .leftJoinAndSelect('bbsctt.category', 'category')
        .where('bbsctt.bbs_id =:bbs_id', { bbs_id: Number(bbs_id) })
        .andWhere('bbsctt.expsr_at =:expsr_at', { expsr_at: EXPSR_AT_ENUM.Y })
        .andWhere('(bbsctt.del_process_at !=:del_process_at or bbsctt.del_process_at is null)', {
          del_process_at: BBSCTT_DEL_AT_ENUM.DEL,
        })
        .andWhere('bbsctt.deleted_at is null')
        .orderBy(order);

      //해당카테고리 조건
      if (bbs_ctgry_id !== '')
        query.andWhere('bbsctt.bbs_ctgry_id =:bbs_ctgry_id', { bbs_ctgry_id: bbs_ctgry_id });

      //공지 표시가 N 이면 리스트 안나오도록 조건 추가
      if (imprtnc_at === EXPSR_AT_ENUM.N)
        query.andWhere('bbsctt.imprtnc_at !=:imprtnc_at', { imprtnc_at: EXPSR_AT_ENUM.Y });

      // 검색 조건
      if (search.length > 0) {
        if (search_filter === BBSCTT_FILTER_ENUM.SUBJECT) {
          // 제목검색
          query.andWhere('bbsctt.bbsctt_sj like "%:search%" ', { search: `%${search}%` });
        } else if (search_filter === BBSCTT_FILTER_ENUM.CONTENTS) {
          // 내용검색
          query.andWhere('bbsctt.bbsctt_cn like "%:search%" ', { search: `%${search}%` });
        } else if (search_filter === BBSCTT_FILTER_ENUM.SUBANDCON) {
          // 제목 + 내용검색
          query.andWhere(
            new Brackets((q) => {
              q.where(`bbsctt.bbsctt_sj like :search `, { search: `%${search}%` }).orWhere(
                `bbsctt.bbsctt_cn like :search `,
                { search: `%${search}%` },
              );
            }),
          );
        }
      }

      const total = await query.getCount();
      query.take(take);
      query.skip(skip);

      const list: BbscttItemRes[] = await query.getMany();

      return {
        list,
        total,
      };
    } catch (e) {
      throw e;
    }
  }

  async getDeleteBbsctt(bbsctt_id: number) {
    try {
      return this.find({
        where: {
          bbsctt_id,
          deleted_at: Not(IsNull()),
          //del_process_at: BBSCTT_DEL_AT_ENUM.DEL,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  /**
   * 게시글 상세조회
   * @param bbsctt_id
   * @returns
   */
  async bbscttDetil(bbsctt_id: string | number) {
    try {
      const select = {
        bbsctt_id: true,
        bbs_id: true,
        bbs_ctgry_id: true,
        imprtnc_at: true,
        bbsctt_sj: true,
        created_at: true,
        click_co: true,
        bbsctt_cn: true,
        wrter_nm: true,
        mngr_indict_at: true,
        answer_co: true,
        recomend_co: true,
        non_recomend_co: true,
        del_process_at: true,
        rgstr_id: true,
        category: {
          bbs_ctgry_id: true,
          bbs_id: true,
          ctgry_nm: true,
        },
        recomends: {
          bbs_recomend_id: true,
          bbsctt_id: true,
          rgstr_id: true,
          recomend_se: true,
        },
      };
      const andWhere = {
        bbsctt_id: Number(bbsctt_id),
        expsr_at: EXPSR_AT_ENUM.Y,
        deleted_at: IsNull(),
      };
      const where = [
        { ...andWhere, del_process_at: IsNull() },
        { ...andWhere, del_process_at: Not(BBSCTT_DEL_AT_ENUM.DEL) },
      ];
      return await this.findOne({
        select,
        where,
        relations: {
          category: true,
          user: true,
          recomends: true,
        },
      });
    } catch (e) {
      throw e;
    }
  }
  /**
   * 게시글 상세조회 에서 이전글, 다음글 안내
   * @param bbsctt_id
   * @returns
   */
  async prevOrNextBbsctt(
    bbs_id: string | number,
    bbsctt_id: string | number,
    type: 'prev' | 'next',
  ) {
    try {
      return await this.dataSource
        .createQueryBuilder(Bbsctt, 'ctt')
        .select(['bbsctt_id', 'bbsctt_sj', 'bbsctt_cn', 'answer_co', 'recomend_co', 'bbs_id'])
        .where(`ctt.bbsctt_id ${type === 'prev' ? '<' : '>'} :bbsctt_id`, {
          bbsctt_id: Number(bbsctt_id),
        })
        .andWhere('ctt.bbs_id =:bbs_id', { bbs_id: bbs_id })
        .andWhere('ctt.expsr_at =:expsr_at', { expsr_at: EXPSR_AT_ENUM.Y })
        .andWhere(' (ctt.del_process_at !=:del_process_at or ctt.del_process_at is null) ', {
          del_process_at: BBSCTT_DEL_AT_ENUM.DEL,
        })
        .andWhere('ctt.deleted_at is null')
        .orderBy('ctt.bbsctt_id', type === 'prev' ? 'DESC' : 'ASC')
        .getRawOne();
    } catch (e) {
      throw e;
    }
  }

  async bbscttJoinBbs(bbsctt_id: number | string) {
    try {
      const select = {
        bbs: {
          answer_writng_at: true,
          wrter_se: true,
        },
      };
      const andWhere = {
        bbsctt_id: Number(bbsctt_id),
        expsr_at: EXPSR_AT_ENUM.Y,
        deleted_at: IsNull(),
        bbs: {
          expsr_at: EXPSR_AT_ENUM.Y,
          pge_at: EXPSR_AT_ENUM.Y,
          deleted_at: IsNull(),
        },
      };
      const where = [
        { ...andWhere, del_process_at: IsNull() },
        { ...andWhere, del_process_at: Not(BBSCTT_DEL_AT_ENUM.DEL) },
      ];
      return this.findOne({
        select,
        where,
        relations: ['bbs'],
      });
    } catch (e) {
      throw e;
    }
  }
}
