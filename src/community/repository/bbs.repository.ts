import { Injectable } from '@nestjs/common';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Bbs } from '@app/share/models/community';
import { PageDto } from '@app/share/dto/default.dto';
import { PaginationDto } from '@app/share/dto/default.dto';
import { EXPSR_AT_ENUM } from '@app/share/types/user.type';

@Injectable()
export class BbsRepositroy extends Repository<Bbs> {
  constructor(private dataSource: DataSource) {
    super(Bbs, dataSource.createEntityManager());
  }
  /**
   * 게시판 리스트 (페이징)
   * @param req
   * @returns
   */
  async bbsList(req: PageDto): Promise<{ data: Bbs[]; pagination: PaginationDto }> {
    try {
      const { page, per_page } = req;
      const take = Number(per_page);
      const skip = (Number(page) - 1) * Number(per_page);
      //노출여부/expsr_at = 1(Y), 삭제일시 = NULL

      const where = {
        pge_at: EXPSR_AT_ENUM.Y,
        expsr_at: EXPSR_AT_ENUM.Y,
        deleted_at: IsNull(),
      };
      const total = await this.count({ where });

      const select = {
        bbs_id: true,
        bbs_nm: true,
        wrter_se: true,
        sort_ordr: true,
      };

      const data = await this.find({
        select,
        where,
        take,
        skip,
        order: { sort_ordr: 'ASC' },
      });

      const pagination: PaginationDto = {
        total,
        count: data.length,
        per_page: Number(per_page),
        current_page: Number(page),
        total_pages: Math.ceil(total / Number(per_page)),
      };

      return {
        data,
        pagination,
      };
    } catch (e) {
      throw e;
    }
  }
  /**
   * 게시판 정보 상세조회
   * @param bbs_id
   * @returns
   */
  async detailBbs(bbs_id: string | number): Promise<Bbs> {
    try {
      const where = {
        bbs_id: Number(bbs_id),
        pge_at: EXPSR_AT_ENUM.Y,
        expsr_at: EXPSR_AT_ENUM.Y,
        deleted_at: IsNull(),
        categorys: {
          deleted_at: IsNull(),
        },
        bannerImages: {
          deleted_at: IsNull(),
        },
      };

      const select = {
        bbs_id: true,
        bbs_nm: true,
        wrter_se: true,
        ctgry_use_at: true,
        banner_image_use_at: true,
        bannerImages: true,
        categorys: true,
      };
      return await this.findOne({
        where,
        select,
        relations: ['bannerImages', 'categorys'],
      });
    } catch (e) {
      throw e;
    }
  }

  async bbsCategoryList(bbs_id: string | number): Promise<Bbs> {
    try {
      const select = {
        bbs_id: true,
        bbs_nm: true,
        ctgry_use_at: true,
        categorys: {
          bbs_ctgry_id: true,
          ctgry_nm: true,
        },
      };
      const where = {
        bbs_id: Number(bbs_id),
        pge_at: EXPSR_AT_ENUM.Y,
        expsr_at: EXPSR_AT_ENUM.Y,
        deleted_at: IsNull(),
        categorys: {
          deleted_at: IsNull(),
        },
      };
      return await this.findOne({
        select,
        where,
        relations: ['categorys'],
      });
    } catch (e) {
      throw e;
    }
  }
}
