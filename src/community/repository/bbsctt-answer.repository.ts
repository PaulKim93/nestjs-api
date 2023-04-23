import { Injectable } from '@nestjs/common';
import { Repository, DataSource, Like, Brackets, IsNull, Not } from 'typeorm';
import { BbsctAnswer } from '@app/share/models/community';
import { EXPSR_AT_ENUM } from '@app/share/types/user.type';
import { BBSCTT_DEL_AT_ENUM } from '@app/share/types/community.type';
import { PageDto } from '@app/share/dto/default.dto';

@Injectable()
export class BbscttAnswerRepositroy extends Repository<BbsctAnswer> {
  constructor(private dataSource: DataSource) {
    super(BbsctAnswer, dataSource.createEntityManager());
  }
  /**
   * 댓글 리스트 조회
   * @param bbsctt_id
   * @param data
   * @returns
   */
  async answerList(
    bbsctt_id: number,
    data: PageDto,
  ): Promise<{ list: BbsctAnswer[]; total: number }> {
    try {
      const { page, per_page } = data;
      const take = Number(per_page);
      const skip = (Number(page) - 1) * Number(per_page);

      const where = {
        expsr_at: EXPSR_AT_ENUM.Y,
        bbsctt_id: Number(bbsctt_id),
        parnts_bbsctt_answer_id: IsNull(),
      };

      const selectColumn = {
        bbsctt_answer_id: true,
        bbsctt_id: true,
        answer_cn: true,
        wrter_nm: true,
        recomend_co: true,
        non_recomend_co: true,
        rgstr_id: true,
        created_at: true,
        deleted_at: true,
        del_process_at: true,
        recomends: true,
      };
      const select = {
        ...selectColumn,
        answers: {
          parnts_bbsctt_answer_id: true,
          ...selectColumn,
        },
      };
      const total = await this.count({ where });
      const list = await this.find({
        select,
        relations: [
          'child_answers',
          'images',
          'answers.images',
          'recomends',
          'child_answers.recomends',
        ],
        take,
        skip,
        where,
        order: {
          created_at: 'ASC',
          child_answers: {
            created_at: 'ASC',
          },
        },
      });

      return {
        total,
        list,
      };
    } catch (e) {
      throw e;
    }
  }

  async answerDetail(bbsctt_answer_id: number): Promise<BbsctAnswer> {
    try {
      const andWhere = {
        bbsctt_answer_id,
        expsr_at: EXPSR_AT_ENUM.Y,
        deleted_at: IsNull(),
      };
      return this.findOne({
        where: [
          { ...andWhere, del_process_at: Not(BBSCTT_DEL_AT_ENUM.DEL) },
          { ...andWhere, del_process_at: IsNull() },
        ],
        relations: ['images'],
      });
    } catch (e) {
      throw e;
    }
  }
}
