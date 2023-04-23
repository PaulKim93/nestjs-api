import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not, DataSource, EntityManager, QueryRunner, In } from 'typeorm';
import {
  BbsCttClick,
  Bbsctt,
  BbsctAnswer,
  BbsRecomend,
  BbsSttemnt,
  Bbs,
  PrhibtWord,
  BbscttAnswerImage,
} from '@app/share/models/community';
import { PageDto } from '@app/share/dto/default.dto';
import { EXPSR_AT_ENUM } from '@app/share/types/user.type';
import { PRHIBT_WORD_APPLC_SE, PRHIBT_WORD_APPLC_SE_ENUM } from '@app/share/types/common.type';
import {
  BbscttListDto,
  BbscttSttemnt,
  BbscttSavetDto,
  BbscttAnswerInsertDto,
  BbscttAnswerUpdateDto,
} from './dto/req.dto';
import {
  BbsResDto,
  BbscttItemRes,
  BbscttListBbsField,
  GetBbscttDetailResDtoDataField,
  GetBbscttDetailResDtoDataFieldBbscttField,
  GetBbscttAnswerListResDtoDataChildAnswersField,
  GetBbscttAnswerListResDtoDataField,
} from './dto/res.dto';
import { PaginationDto } from '@app/share/dto/default.dto';
import { BbscttRepositroy, BbsRepositroy, BbscttAnswerRepositroy } from './repository';
import { DefaultUserDto } from '@api/auth/dto/res.dto';
import {
  BBSCTT_RECOMEND,
  BBSCTT_RECOMEND_ENUM,
  BBSCTT_STTEMNT_ENUM,
  BBSCTT_DEL_AT_ENUM,
} from '@app/share/types/community.type';

@Injectable()
export class CommunityService {
  private queryRunner: QueryRunner;
  private manager: EntityManager;

  constructor(
    private readonly dataSource: DataSource,
    private readonly BbsRepositroy: BbsRepositroy,
    private readonly BbscttRepositroy: BbscttRepositroy,
    private readonly BbsctAnswerRepository: BbscttAnswerRepositroy,
    @InjectRepository(BbsRecomend)
    private readonly BbsRecomendRepository: Repository<BbsRecomend>,
    @InjectRepository(BbsSttemnt)
    private readonly BbsSttemntRepository: Repository<BbsSttemnt>,
    @InjectRepository(PrhibtWord)
    private readonly PrhibtWordRepository: Repository<PrhibtWord>,
  ) {}
  /**
   * 게시판 리스트 조회
   * @param dto PageDto
   * @returns
   */
  async bbsList(dto: PageDto): Promise<{ data: BbsResDto[]; pagination: PaginationDto }> {
    try {
      const { data, pagination } = await this.BbsRepositroy.bbsList(dto);
      return {
        data,
        pagination,
      };
    } catch (e) {
      throw e;
    }
  }

  /**
   * 게시글 리스트 조회
   * @param bbs_id 게시판 고유키
   * @param req BbscttListDto
   * @returns
   */
  async bbscttList(bbs_id: string, req: BbscttListDto) {
    try {
      //정상적인 게시글인지 확인
      const { page, per_page } = req;
      const bbs: BbscttListBbsField = await this.BbsRepositroy.detailBbs(bbs_id);
      if (bbs === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않은 게시판입니다.',
        });
      const { banner_image_use_at, ctgry_use_at } = bbs;

      //카테고리 사용여부 N 이면 category = []
      if (ctgry_use_at === EXPSR_AT_ENUM.N) bbs.categorys = [];

      //배너이미지 사용여부 N 이면 category = []
      if (banner_image_use_at === EXPSR_AT_ENUM.N) bbs.bannerImages = [];

      const { list, total }: { list: BbscttItemRes[]; total: number } =
        await this.BbscttRepositroy.bbscttList(bbs_id, req);

      //페이징 정보
      const pagination: PaginationDto = {
        total,
        count: list.length,
        per_page: Number(per_page),
        current_page: Number(page),
        total_pages: Math.ceil(total / Number(per_page)),
      };

      return {
        data: list,
        bbs,
        pagination,
      };
    } catch (e) {
      throw e;
    }
  }
  /**
   *
   * @param bbsctt_id 게시글 고유값
   * @param user 토큰 user 정보
   * @returns
   */
  async bbscttClick(bbsctt_id: string, user: DefaultUserDto): Promise<boolean> {
    try {
      this.queryRunner = this.dataSource.createQueryRunner();
      this.manager = this.queryRunner.manager;
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();

      const bbsctt = await this.BbscttRepositroy.bbscttDetil(bbsctt_id);
      //정상적인 게시물 인지 확인
      if (bbsctt === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 게시글입니다.',
        });
      const { mber_id } = user;

      // click history insert
      const { raw } = await this.manager.insert(BbsCttClick, {
        bbsctt_id: Number(bbsctt_id),
        rgstr_id: mber_id,
      });
      const { insertId } = raw;
      if (insertId < 1)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: ' bbsctt click history insert fail',
        });

      //click count +1 update
      const where = { bbsctt_id: Number(bbsctt_id) };
      const { affected } = await this.manager.update(Bbsctt, where, {
        click_co: () => 'ifnull(click_co,0) + 1',
      });
      if (affected < 1)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: ' bbsctt click count update fail',
        });
      await this.queryRunner.commitTransaction();
      return true;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }
  /**
   * 게시글 상세조회
   * @param bbsctt_id
   * @param user
   * @returns
   */
  async getBbscttDetail(
    param_bbsctt_id: string,
    user: DefaultUserDto,
  ): Promise<GetBbscttDetailResDtoDataField> {
    try {
      //게시글 상세 정보를 DB에서 select
      const { mber_id, profl_image } = user;

      const deleteBbsctt = await this.BbscttRepositroy.getDeleteBbsctt(Number(param_bbsctt_id));
      if (deleteBbsctt.length > 0) {
        return {
          isDelete: true,
        };
      }

      const bbsctt = await this.BbscttRepositroy.bbscttDetil(param_bbsctt_id);
      if (bbsctt === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 게시글입니다.',
        });
      const {
        bbs_id,
        bbsctt_id,
        bbs_ctgry_id,
        imprtnc_at,
        mngr_indict_at,
        wrter_nm,
        expsr_at,
        bbsctt_sj,
        bbsctt_cn,
        recomend_co,
        non_recomend_co,
        click_co,
        answer_co,
        sttemnt_co,
        created_at,
        category,
        user: rgst_user,
        recomends,
      } = bbsctt;
      const { login_id, mber_se, mber_id: rgstr_id } = rgst_user;
      delete bbsctt.user;

      const resBbsctt: GetBbscttDetailResDtoDataFieldBbscttField = {
        bbs_id,
        bbsctt_id,
        bbs_ctgry_id,
        imprtnc_at,
        mngr_indict_at,
        wrter_nm,
        expsr_at,
        bbsctt_sj,
        bbsctt_cn,
        recomend_co,
        non_recomend_co,
        click_co,
        answer_co,
        sttemnt_co,
        created_at,
        my_bbsctt: rgstr_id === mber_id,
        rgstr_id,
        profl_image: null,
        mber_se,
        category,
        my_recomend: null,
      };

      resBbsctt.profl_image = profl_image;

      //해당 게시글에 내가 좋아요, 싫어요 했는지
      const myRecomendIdx = recomends.findIndex((item) => item.rgstr_id === mber_id);
      if (myRecomendIdx > -1) resBbsctt.my_recomend = recomends[myRecomendIdx];
      delete bbsctt.recomends;

      //이전글, 다음글
      const prev_bbsctt = await this.BbscttRepositroy.prevOrNextBbsctt(bbs_id, bbsctt_id, 'prev');
      const next_bbsctt = await this.BbscttRepositroy.prevOrNextBbsctt(bbs_id, bbsctt_id, 'next');

      //게시글 click count + 1
      await this.bbscttClick(param_bbsctt_id, user);

      return {
        bbsctt: resBbsctt,
        prev_bbsctt,
        next_bbsctt,
      };
    } catch (e) {
      throw e;
    }
  }
  /**
   * 게시글 상세조회 -> 댓글 리스트 조회
   * @param user
   * @param bbsctt_id
   * @param pageDto
   * @returns
   */
  async getAnswerList(user: DefaultUserDto, bbsctt_id: string | number, pageDto: PageDto) {
    try {
      const { mber_id } = user;
      const { page, per_page } = pageDto;
      const { list, total } = await this.BbsctAnswerRepository.answerList(
        Number(bbsctt_id),
        pageDto,
      );

      const myAnswerCheckList: GetBbscttAnswerListResDtoDataField[] = list.map((item) => {
        const { rgstr_id, child_answers, recomends, images, deleted_at } = item;
        //유저가 좋아요 싫어요 여부 찾기
        const recomendIdx = recomends.findIndex((item) => item.rgstr_id === mber_id);
        const recomend_se: string | null =
          recomendIdx === -1 ? null : recomends[recomendIdx].recomend_se;
        delete item.recomends;

        const mySubAnswerCheckList: GetBbscttAnswerListResDtoDataChildAnswersField[] =
          child_answers.map((answerChild) => {
            const {
              rgstr_id: child_id,
              recomends: child_recomends,
              images,
              deleted_at,
            } = answerChild;
            const childRecomendIdx = child_recomends.findIndex((item) => item.rgstr_id === mber_id);
            const childRecomend_se =
              childRecomendIdx === -1 ? null : child_recomends[childRecomendIdx].recomend_se;

            return {
              my_answer: mber_id === child_id, //내가 내가 쓴 댓글 여부
              my_recomend_se: childRecomend_se, //내가 좋아요 싫어요 여부
              ...answerChild,
              images: images.filter((image) => image.deleted_at === null), // 댓글 이미지 삭제 안된 데이터만
              isDelete: deleted_at != null,
            };
          });

        return {
          ...item,
          my_recomend_se: recomend_se, //내가 좋아요 싫어요 여부
          my_answer: mber_id === rgstr_id, //내가 내가 쓴 댓글 여부
          isDelete: deleted_at != null,
          images: images.filter((image) => image.deleted_at === null), // 댓글 이미지 삭제 안된 데이터만
          answers: mySubAnswerCheckList,
        };
      });

      // 페이징 정보
      const pagination: PaginationDto = {
        total,
        count: list.length,
        per_page: Number(per_page),
        current_page: Number(page),
        total_pages: Math.ceil(total / Number(per_page)),
      };

      return {
        data: myAnswerCheckList,
        pagination,
      };
    } catch (e) {
      throw e;
    }
  }
  /**
   * 게시글 좋아요
   * @param user 로그인 user 정보
   * @param bbsctt_id 게시글ID
   * @param recomend_se 좋아요, 싫어요 여부
   * @returns
   */
  async setBbscttRecomend(
    user: DefaultUserDto,
    bbsctt_id: string,
    recomend_se: BBSCTT_RECOMEND | string,
  ): Promise<string> {
    try {
      this.queryRunner = this.dataSource.createQueryRunner();
      this.manager = this.queryRunner.manager;
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();

      const { mber_id } = user;
      const bbscttWhere = { bbsctt_id: Number(bbsctt_id) };
      const bbsctt = await this.BbscttRepositroy.bbscttDetil(bbsctt_id);
      //정상적인 게시글인지 확인
      if (bbsctt === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 게시글입니다.',
        });

      const recomendWHere = {
        ...bbscttWhere,
        rgstr_id: Number(mber_id),
      };

      //기존에 게시판 추천 내역 있는지 확인
      const data = await this.BbsRecomendRepository.findOne({ where: recomendWHere });
      const { bbs_recomend_id = 0, recomend_se: findRecomend = '' } = data || {};
      if (findRecomend === recomend_se) {
        throw new BadRequestException({
          status_code: '0101001',
          message: `이미 ${
            recomend_se === BBSCTT_RECOMEND_ENUM.LIKE ? '좋아요' : '싫어요'
          }를 하였습니다.`,
        });
      } else if (bbs_recomend_id > 0 && findRecomend !== recomend_se) {
        //있으면 삭제
        //const { affected: deleteResult } = await this.BbsRecomendRepository.delete({ bbs_recomend_id });
        const { affected: deleteResult } = await this.manager.delete(BbsRecomend, {
          bbs_recomend_id,
        });
        if (deleteResult === null)
          throw new InternalServerErrorException({
            status_code: '9999999',
            message: 'recomend history remove fail',
          });
      }

      //좋아요 싫어요 history insert
      const { identifiers } = await this.manager.insert(BbsRecomend, {
        bbsctt_id: Number(bbsctt_id),
        recomend_se,
        rgstr_id: Number(mber_id),
      });
      if (identifiers.length < 1)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: 'recomend history update fail',
        });

      await this.queryRunner.commitTransaction();
      // 게시글 좋아요 싫어요 개수 구해서 업데이트
      await this.bbscttRecomendCountUpdate(Number(bbsctt_id));
      return recomend_se;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }

  /**
   * 게시글 좋아요 싫어요 개수 구해서 업데이트
   * @param bbsctt_id
   * @returns
   */
  async bbscttRecomendCountUpdate(bbsctt_id: number): Promise<void> {
    try {
      const recomend_co = await this.BbsRecomendRepository.count({
        where: {
          bbsctt_id,
          recomend_se: '1',
        },
      });
      const non_recomend_co = await this.BbsRecomendRepository.count({
        where: {
          bbsctt_id,
          recomend_se: '2',
        },
      });

      await this.BbscttRepositroy.update(
        { bbsctt_id },
        {
          recomend_co,
          non_recomend_co,
        },
      );
    } catch (e) {
      throw e;
    }
  }

  /**
   * 댓글 좋아요 싫어요 개수 구하기
   * @param bbsctt_id
   * @returns
   */
  async bbscttAnswerRecomendCountUpdate(bbsctt_answer_id: number): Promise<void> {
    try {
      const recomend_co = await this.BbsRecomendRepository.count({
        where: {
          bbsctt_answer_id,
          recomend_se: '1',
        },
      });
      const non_recomend_co = await this.BbsRecomendRepository.count({
        where: {
          bbsctt_answer_id,
          recomend_se: '2',
        },
      });
      await this.BbsctAnswerRepository.update(
        { bbsctt_answer_id },
        { recomend_co, non_recomend_co },
      );
    } catch (e) {
      throw e;
    }
  }

  /**
   * 게시글 좋아요 취소
   * @param user 로그인 user 정보
   * @param bbsctt_id 게시글ID
   * @param recomend_se 좋아요, 싫어요 여부
   * @returns
   */
  async setBbscttRecomendCancel(
    user: DefaultUserDto,
    bbsctt_id: string,
    recomend_se: BBSCTT_RECOMEND | string,
  ): Promise<string> {
    try {
      this.queryRunner = this.dataSource.createQueryRunner();
      this.manager = this.queryRunner.manager;
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();

      const { mber_id } = user;
      const bbscttWhere = { bbsctt_id: Number(bbsctt_id) };
      const bbsctt = await this.BbscttRepositroy.bbscttDetil(bbsctt_id);
      //정상적인 게시글인지 확인
      if (bbsctt === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 게시글입니다.',
        });

      const recomendWHere = {
        ...bbscttWhere,
        rgstr_id: Number(mber_id),
        recomend_se,
      };

      //기존에 게시판 추천 내역 있는지 확인
      const data = await this.BbsRecomendRepository.findOne({ where: recomendWHere });
      if (data === null) {
        throw new BadRequestException({
          status_code: '0101001',
          message: `${
            recomend_se === BBSCTT_RECOMEND_ENUM.LIKE ? '좋아요' : '싫어요'
          } 내역이 없습니다.`,
        });
      }

      //좋아요 싫어요 내역 삭제
      const { bbs_recomend_id, recomend_se: findRecomend } = data;
      const { affected: deleteResult } = await this.manager.delete(BbsRecomend, {
        bbs_recomend_id,
      });
      if (deleteResult === null)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: 'recomend history remove fail',
        });

      await this.queryRunner.commitTransaction();
      //좋아요 싫어요 개수 업데이트
      await this.bbscttRecomendCountUpdate(Number(bbsctt_id));
      return recomend_se;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }

  /**
   * 게시글 신고
   * @param user 로그인 user 정보
   * @param bbsctt_id 게시글 ID
   * @param body
   * @returns
   */
  async bbscttSttemnt(
    user: DefaultUserDto,
    bbsctt_id: string,
    body: BbscttSttemnt,
  ): Promise<boolean> {
    try {
      this.queryRunner = this.dataSource.createQueryRunner();
      this.manager = this.queryRunner.manager;
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();

      const { mber_id } = user;
      const { etc_resn = '', sttemnt_knd } = body;
      //정상적인 게시글인지 확인
      const bbsctt = await this.BbscttRepositroy.bbscttDetil(bbsctt_id);
      if (bbsctt === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 게시글입니다.',
        });

      //신고 유형이 6: 기타이면 오픈값 있는지 확인
      if (sttemnt_knd === BBSCTT_STTEMNT_ENUM.TYPE_6 && etc_resn.length < 1) {
        throw new BadRequestException({
          status_code: '0101001',
          message: '기타내역을 입력해주세요.',
        });
      }

      const sttAndWhere = {
        bbsctt_id: Number(bbsctt_id),
        rgstr_id: Number(mber_id),
        del_process_at: BBSCTT_DEL_AT_ENUM.REPORT,
      };
      const sttemnt = await this.BbsSttemntRepository.find({ where: sttAndWhere });

      //이미 신고한 게시글인지 확인
      if (sttemnt.length > 0)
        throw new BadRequestException({
          status_code: '0101001',
          message: '해당 게시글을 이미 신고하였습니다.',
        });

      //신고내역 history insert
      const { identifiers } = await this.manager.insert(BbsSttemnt, {
        bbsctt_id: Number(bbsctt_id),
        sttemnt_knd,
        etc_resn,
        del_process_at: BBSCTT_DEL_AT_ENUM.REPORT,
        rgstr_id: Number(mber_id),
      });
      if (identifiers.length < 1)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: 'sttemnt history insert fail',
        });

      //게시글 신고 count + 1 update
      const { affected } = await this.manager.update(
        Bbsctt,
        { bbsctt_id: Number(bbsctt_id) },
        {
          del_process_at: BBSCTT_DEL_AT_ENUM.REPORT,
          sttemnt_co: () => 'ifnull(sttemnt_co,0) + 1',
        },
      );
      if (affected < 1)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: ' bbsctt update fail',
        });
      await this.queryRunner.commitTransaction();
      return true;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }

  /**
   * 게시판 카테고리 리스트 조회
   * @param bbs_id
   */
  async getBbsCategory(bbs_id: string): Promise<Bbs> {
    try {
      const bbs = await this.BbsRepositroy.bbsCategoryList(bbs_id);
      if (bbs === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 게시판입니다.',
        });
      return bbs;
    } catch (e) {
      throw e;
    }
  }
  /**
   * 게시글 추가
   * @param user
   * @param data
   * @returns
   */
  async insertBbsctt(user: DefaultUserDto, data: BbscttSavetDto): Promise<number> {
    try {
      const { mber_id, login_id, nm } = user;
      const { bbs_id, bbs_ctgry_id, bbsctt_cn, bbsctt_sj } = data;
      const bbs = await this.BbsRepositroy.detailBbs(bbs_id);
      //정상적인 게시글인지 확인
      if (bbs === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 게시판입니다.',
        });

      let wrter_nm = '';
      const { wrter_se, ctgry_use_at, categorys } = bbs;

      //카테고리 사용 게시판이면 카테고리 확인
      if (ctgry_use_at === EXPSR_AT_ENUM.Y) {
        if (bbs_ctgry_id < 1)
          throw new BadRequestException({
            status_code: '0101001',
            message: '카테고리를 선택해주세요.',
          });
        const ctgryIdx = categorys.findIndex((item) => item.bbs_ctgry_id === bbs_ctgry_id);
        if (ctgryIdx === -1)
          throw new BadRequestException({
            status_code: '0101001',
            message: '존재하지 않는 카테고리입니다.',
          });
      }

      //게시판 작성자 구분에 따라 wrter_nm를 자동으로 넣어줌
      if (wrter_se === '1') wrter_nm = '익명';
      else if (wrter_se === '2') wrter_nm = login_id;
      else if (wrter_se === '3') wrter_nm = nm;

      //우선적으로 등록 클릭 시 [금칙용어/fab_prhibt_word] 테이블에서 작성된 제목과 내용을 LIKE 검색하여 등록이 가능한지 유무를 판단한다.
      await this.wordCheck(bbsctt_sj, PRHIBT_WORD_APPLC_SE_ENUM.CON, '제목');
      await this.wordCheck(bbsctt_cn, PRHIBT_WORD_APPLC_SE_ENUM.CON, '내용');

      // 게시글 정보 insert
      const { identifiers } = await this.BbscttRepositroy.insert({
        bbs_id,
        bbs_ctgry_id: bbs_ctgry_id < 1 ? null : bbs_ctgry_id,
        bbsctt_cn,
        bbsctt_sj,
        wrter_nm,
        rgstr_id: mber_id,
        expsr_at: EXPSR_AT_ENUM.Y,
        imprtnc_at: EXPSR_AT_ENUM.N,
        mngr_indict_at: EXPSR_AT_ENUM.N,
      });
      if (identifiers.length < 1)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: ' bbsctt insert fail',
        });
      const { bbsctt_id } = identifiers[0];
      return bbsctt_id;
    } catch (e) {
      throw e;
    }
  }
  /**
   * 금칙용어 확인
   * @param str 확인 대상 글
   * @param applc_se
   * @returns
   */
  async wordCheck(str: string, applc_se: PRHIBT_WORD_APPLC_SE, err_text = '본문'): Promise<void> {
    try {
      const list = await this.PrhibtWordRepository.find({ where: { applc_se } });
      const strList = list.map((item) => item.prhibt_word);
      let findIndex = -1;
      let strIndex = -1;
      for (let i = 0; i < strList.length; i++) {
        const index = str.indexOf(strList[i]);
        if (index > -1) {
          strIndex = index;
          findIndex = i;
          break;
        }
      }
      const reesult = findIndex === -1;
      const findText = strList[findIndex];

      if (reesult === false) {
        throw new BadRequestException({
          status_code: '0101001',
          message: `${err_text}에 금칙용어(${findText})가 포함되어 있습니다. 본문을 다시한번 확인바랍니다.`,
        });
      }
    } catch (e) {
      throw e;
    }
  }
  /**
   * 게시글 수정
   * @param user
   * @param bbsctt_id
   * @param data
   * @returns
   */
  async updateBbsctt(user: DefaultUserDto, bbsctt_id: string | number, data: BbscttSavetDto) {
    try {
      const { mber_id } = user;
      const { bbs_id, bbs_ctgry_id = null, bbsctt_cn, bbsctt_sj } = data;
      const bbsctt = await this.BbscttRepositroy.bbscttDetil(bbsctt_id);
      //정상적인 게시글 인지 확인
      if (bbsctt === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 게시글입니다.',
        });

      //본인이 등록한 게시글만 수정가능하도록
      const { rgstr_id } = bbsctt;
      if (mber_id !== rgstr_id)
        throw new BadRequestException({
          status_code: '0101001',
          message: '본인이 등록한 게시글만 수정가능합니다.',
        });

      //우선적으로 등록 클릭 시 [금칙용어/fab_prhibt_word] 테이블에서 작성된 제목과 내용을 LIKE 검색하여 등록이 가능한지 유무를 판단한다.
      await this.wordCheck(bbsctt_sj, PRHIBT_WORD_APPLC_SE_ENUM.CON, '제목');
      await this.wordCheck(bbsctt_cn, PRHIBT_WORD_APPLC_SE_ENUM.CON, '내용');

      //게시글 정보 update
      const { affected } = await this.BbscttRepositroy.update(
        { bbsctt_id: Number(bbsctt_id) },
        {
          bbs_ctgry_id,
          bbsctt_cn,
          bbsctt_sj,
          updated_at: new Date(),
          upd_usr_id: mber_id,
        },
      );
      if (affected < 1)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: ' bbsctt update fail',
        });
      return true;
    } catch (e) {
      throw e;
    }
  }
  /**
   * 게시글 삭제
   * @param user 로그인 정보
   * @param bbsctt_id
   * @returns
   */
  async deleteBbsctt(user: DefaultUserDto, id: string | number): Promise<boolean> {
    try {
      this.queryRunner = this.dataSource.createQueryRunner();
      this.manager = this.queryRunner.manager;
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();

      const { mber_id } = user;
      const bbsctt = await this.BbscttRepositroy.bbscttDetil(id);
      //정상적인 게시글인지 확인
      if (bbsctt === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 게시글입니다.',
        });

      const { rgstr_id, del_process_at, bbsctt_id } = bbsctt;
      const deleteColumn: { deleted_at: Date; del_process_at?: string; answer_co?: any } = {
        deleted_at: new Date(),
      };

      //내가 등록한 게시글만 삭제 할 수 있도록
      if (mber_id !== rgstr_id)
        throw new BadRequestException({
          status_code: '0101001',
          message: '본인이 등록한 게시글만 삭제 가능합니다.',
        });

      //삭제할 게시글이 신고가 된 상태이면 신고처리 상태로 변경
      if (del_process_at === BBSCTT_DEL_AT_ENUM.REPORT) {
        deleteColumn.del_process_at = BBSCTT_DEL_AT_ENUM.DEL;
        //게시글 신고 내역들도 상태를 신고처리로 변경
        const { affected: sttResult } = await this.manager.update(
          BbsSttemnt,
          { bbsctt_id, del_process_at: BBSCTT_DEL_AT_ENUM.REPORT },
          { del_process_at: BBSCTT_DEL_AT_ENUM.DEL },
        );
        if (sttResult < 1)
          throw new InternalServerErrorException({
            status_code: '9999999',
            message: ' bbsc-sttemnt update fail',
          });

        //삭제할 게시글이 신고가 된 상태이고 해당 게시글의 댓글들 중 신고가 된 댓글들을 찾아서 모두 삭제 처리
        const sttemntAnswers = await this.BbsctAnswerRepository.find({
          where: {
            bbsctt_id,
            deleted_at: IsNull(),
            del_process_at: BBSCTT_DEL_AT_ENUM.REPORT,
          },
        });

        if (sttemntAnswers.length > 0) {
          //댓글 신고상태 del_process_at = 1 찾아서 del_process_at = 2 변경
          const sttAnswersId = sttemntAnswers.map((answer) => answer.bbsctt_answer_id);
          const { affected: answersUpdateLen } = await this.manager.update(
            BbsctAnswer,
            { bbsctt_answer_id: In(sttAnswersId) },
            deleteColumn,
          );
          if (answersUpdateLen < 1)
            throw new InternalServerErrorException({
              status_code: '9999999',
              message: ' bbsctt-answer update fail',
            });

          //해당 댓글들 이미지 삭제 처리
          await this.manager.update(
            BbscttAnswerImage,
            { bbsctt_answer_id: In(sttAnswersId), deleted_at: null },
            { deleted_at: new Date() },
          );

          //해당 댓글들 신고내역 상태도 del_process_at = 1 찾아서 del_process_at = 2 변경
          const { affected: answerSttResult } = await this.manager.update(
            BbsSttemnt,
            { bbsctt_answer_id: In(sttAnswersId), del_process_at: BBSCTT_DEL_AT_ENUM.REPORT },
            { del_process_at: BBSCTT_DEL_AT_ENUM.DEL },
          );
          if (answerSttResult < 1)
            throw new InternalServerErrorException({
              status_code: '9999999',
              message: ' answer-sttemnt update fail',
            });

          // 삭제한 댓글 수들이 있으면 그만큼 answer_co - 빼주기
          //deleteColumn.answer_co = ()=> `ifnull(answer_co,0) - ${sttemntAnswers.length}`;
        }
      }

      //soft delete (deleted_at = now(), del_process_at = '2' update)
      const { affected } = await this.manager.update(Bbsctt, { bbsctt_id }, deleteColumn);
      if (affected < 1)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: ' bbsctt remove fail',
        });

      await this.queryRunner.commitTransaction();
      await this.bbscttAnswerCountUpdate(bbsctt_id);

      return true;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }
  /**
   * 댓글 및 댓글의 답글 추가
   * @param user 로그인 정보
   * @param data 추가할 댓글 정보
   * @returns
   */
  async insertBbscttAnswer(user: DefaultUserDto, data: BbscttAnswerInsertDto) {
    try {
      this.queryRunner = this.dataSource.createQueryRunner();
      this.manager = this.queryRunner.manager;
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();
      let wrter_nm = '';
      const { mber_id, login_id, nm } = user;
      const { bbsctt_id, answer_cn, parnts_bbsctt_answer_id, image_path = '' } = data;

      //정상적인 게시글인지 확인
      const bbsctt = await this.BbscttRepositroy.bbscttJoinBbs(bbsctt_id);
      if (bbsctt === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 게시글입니다.',
        });
      const { bbs } = bbsctt;
      const { answer_writng_at, wrter_se } = bbs;

      //게시판 작성자 구분에 따라 wrter_nm를 자동으로 넣어줌
      if (wrter_se === '1') wrter_nm = '익명';
      else if (wrter_se === '2') wrter_nm = login_id;
      else if (wrter_se === '3') wrter_nm = nm;

      //댓글 기능을 사용할 수 있는 게시판인지 확인
      if (answer_writng_at !== EXPSR_AT_ENUM.Y)
        throw new BadRequestException({
          status_code: '0101001',
          message: '댓글기능을 사용할 수 없습니다.',
        });
      await this.wordCheck(answer_cn, PRHIBT_WORD_APPLC_SE_ENUM.CON, '댓글');

      //부모 댓글이 있는지 확인
      if (Number(parnts_bbsctt_answer_id) > 0) {
        const parentAnswer = await this.BbsctAnswerRepository.answerDetail(parnts_bbsctt_answer_id);
        if (parentAnswer === null)
          throw new BadRequestException({
            status_code: '0101001',
            message: '답글 대상이 존재하지 않습니다.',
          });
        const { parnts_bbsctt_answer_id: parentId } = parentAnswer;
        if (parentId !== null)
          throw new BadRequestException({
            status_code: '0101001',
            message: '답글에 답글은 추가는 할 수 없습니다.',
          });
      }

      const { identifiers } = await this.manager.insert(BbsctAnswer, {
        bbsctt_id,
        wrter_nm,
        parnts_bbsctt_answer_id:
          Number(parnts_bbsctt_answer_id) > 0 ? parnts_bbsctt_answer_id : null,
        answer_cn,
        expsr_at: EXPSR_AT_ENUM.Y,
        rgstr_id: mber_id,
      });

      if (identifiers.length < 1)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: ' bbsctt-answer insert fail',
        });
      const { bbsctt_answer_id } = identifiers[0];

      /*
            //게시글 count + 1
            const { affected } = await this.manager.update(Bbsctt, { bbsctt_id },{
                answer_co: ()=> 'ifnull(answer_co,0) + 1'
            });
            if(affected < 1) throw new InternalServerErrorException({ status_code: '9999999', message: 'answer_co update fail'});
            */

      //업로드 경로 있으면 이미지 경로 추가
      if (image_path.length > 0) {
        const { identifiers: imageResults } = await this.manager.insert(BbscttAnswerImage, {
          bbsctt_answer_id,
          orginl_image: image_path,
          cnvr_image: image_path,
          rgstr_id: mber_id,
        });
        if (imageResults.length < 1)
          throw new InternalServerErrorException({
            status_code: '9999999',
            message: 'bbsctt-answer-image insert 실패',
          });
      }

      await this.queryRunner.commitTransaction();
      await this.bbscttAnswerCountUpdate(bbsctt_id);
      return {
        bbsctt_answer_id: Number(bbsctt_answer_id),
      };
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }
  /**
   * 댓글 수정
   * @param bbsctt_answer_id 댓글 id
   * @param user 로그인 user 정보
   * @param data 수정 data
   */
  async updateBbscttAnswer(
    bbsctt_answer_id: number,
    user: DefaultUserDto,
    data: BbscttAnswerUpdateDto,
  ): Promise<void> {
    try {
      this.queryRunner = this.dataSource.createQueryRunner();
      this.manager = this.queryRunner.manager;
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();

      const { mber_id } = user;
      const answer = await this.BbsctAnswerRepository.answerDetail(bbsctt_answer_id);

      //정상적인 댓글인지 확인
      if (answer === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 댓글입니다.',
        });

      const { bbsctt_id, rgstr_id, images = [] } = answer;
      if (mber_id !== rgstr_id)
        throw new BadRequestException({
          status_code: '0101001',
          message: '본인이 등록한 댓글만 수정가능합니다.',
        });

      const { answer_cn, image_path = null } = data;
      const bbsctt = await this.BbscttRepositroy.bbscttJoinBbs(bbsctt_id);

      //정상적인 게시글 인지 확인
      if (bbsctt === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 게시글입니다.',
        });
      const { bbs } = bbsctt;
      const { answer_writng_at } = bbs;

      //해당 게시판에 댓글 기능이 활성화 되어있는지 확인
      if (answer_writng_at !== EXPSR_AT_ENUM.Y)
        throw new BadRequestException({
          status_code: '0101001',
          message: '댓글기능을 사용할 수 없습니다.',
        });

      //금칙용어 확인
      await this.wordCheck(answer_cn, PRHIBT_WORD_APPLC_SE_ENUM.CON, '댓글');

      //댓글 정보 update
      const { affected } = await this.manager.update(
        BbsctAnswer,
        { bbsctt_answer_id },
        {
          answer_cn,
          upd_usr_id: mber_id,
          updated_at: new Date(),
        },
      );
      if (affected < 1)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: 'bbsctt-answer update fail',
        });

      //업로드 경로 null 이면 삭제
      if (image_path === null) {
        const image_id_arr = images
          .filter((item) => item.deleted_at === null)
          .map((item) => Number(item.bbsctt_answer_image_id));

        if (image_id_arr.length > 0) {
          await this.manager.update(
            BbscttAnswerImage,
            { bbsctt_answer_image_id: In(image_id_arr) },
            {
              deleted_at: new Date(),
            },
          );
        }
      } else if (image_path.length > 0) {
        //업로드 경로 있으면 이미지 경로 추가
        const { affected: delAffected } = await this.manager.update(
          BbscttAnswerImage,
          { bbsctt_answer_id },
          {
            deleted_at: new Date(),
          },
        );

        const { identifiers: imageResults } = await this.manager.insert(BbscttAnswerImage, {
          bbsctt_answer_id,
          orginl_image: image_path,
          cnvr_image: image_path,
          rgstr_id: mber_id,
        });
        if (imageResults.length < 1)
          throw new InternalServerErrorException({
            status_code: '9999999',
            message: 'bbsctt-answer-image insert fail',
          });
      }

      await this.queryRunner.commitTransaction();
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }
  /**
   * 댓글 삭제
   * @param bbsctt_answer_id 댓글ID
   * @param user 로그인 user 정보
   */
  async deleteBbscttAnswer(bbsctt_answer_id: number, user: DefaultUserDto) {
    try {
      this.queryRunner = this.dataSource.createQueryRunner();
      this.manager = this.queryRunner.manager;
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();
      const deleteColumn: { deleted_at: Date; del_process_at?: string } = {
        deleted_at: new Date(),
      };
      const { mber_id } = user;
      const answer = await this.BbsctAnswerRepository.answerDetail(bbsctt_answer_id);
      //정상적인 댓글 인지 확인
      if (answer === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 댓글입니다.',
        });

      //본인이 등록한 댓글만 삭제할 수 있도록
      const { rgstr_id, del_process_at, images, bbsctt_id } = answer;
      const notDeleteImages = images.filter((item) => item.deleted_at === null);
      if (mber_id !== rgstr_id)
        throw new BadRequestException({
          status_code: '0101001',
          message: '본인이 등록한 댓글만 삭제가능합니다.',
        });

      //삭제할 댓글이 신고가 된 상태이면 신고처리 상태로 변경
      if (del_process_at === BBSCTT_DEL_AT_ENUM.REPORT) {
        deleteColumn.del_process_at = BBSCTT_DEL_AT_ENUM.DEL;
        //신고 내역들도 상태를 신고처리로 변경
        const { affected: sttResult } = await this.manager.update(
          BbsSttemnt,
          { bbsctt_answer_id, del_process_at: BBSCTT_DEL_AT_ENUM.REPORT },
          { del_process_at: BBSCTT_DEL_AT_ENUM.DEL },
        );
        if (sttResult < 1)
          throw new InternalServerErrorException({
            status_code: '9999999',
            message: 'bbscct-sttemnt update fail',
          });
      }

      //댓글 삭제 delete at update
      const { affected: answerResult } = await this.manager.update(
        BbsctAnswer,
        { bbsctt_answer_id },
        deleteColumn,
      );
      if (answerResult < 1)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: 'bbscct-answer remove fail',
        });

      //삭제할 댓글에 등록된 이미지들이 있으면 댓글 이미지도 삭제
      if (notDeleteImages.length > 0) {
        const deleteImageIds = notDeleteImages.map((item) => Number(item.bbsctt_answer_image_id));
        const { affected: answerImageResult } = await this.manager.update(
          BbscttAnswerImage,
          { bbsctt_answer_image_id: In(deleteImageIds) },
          {
            deleted_at: new Date(),
          },
        );
        if (answerImageResult < 1)
          throw new InternalServerErrorException({
            status_code: '9999999',
            message: 'bbscct-answer-image remove fail',
          });
      }
      /*
            //게시글 댓글 count - 1
            const { affected: bbscctResult } = await this.manager.update(Bbsctt,{ bbsctt_id },{
                answer_co: ()=> 'ifnull(answer_co,0) - 1'
            });

            if(bbscctResult < 1) throw new InternalServerErrorException({ status_code: '9999999', message: 'bbscct update fail'});
            */
      await this.queryRunner.commitTransaction();

      await this.bbscttAnswerCountUpdate(bbsctt_id);
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }

  /**
   * 해당 게시글 댓글 count 하여 answer_co update
   * @param bbsctt_id
   */
  async bbscttAnswerCountUpdate(bbsctt_id: number) {
    try {
      const answer_co = await this.BbsctAnswerRepository.count({
        where: {
          bbsctt_id,
          deleted_at: null,
        },
      });
      await this.BbscttRepositroy.update({ bbsctt_id }, { answer_co });
    } catch (e) {
      throw e;
    }
  }

  /**
   * 댓글 신고
   * @param user 로그인 user 정보
   * @param bbsctt_answer_id 댓글 아이디
   * @param body data
   * @returns
   */
  async bbscttAnswerSttemnt(user: DefaultUserDto, bbsctt_answer_id: number, body: BbscttSttemnt) {
    try {
      this.queryRunner = this.dataSource.createQueryRunner();
      this.manager = this.queryRunner.manager;
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();

      const { mber_id } = user;
      const { etc_resn = '', sttemnt_knd } = body;
      const answer = await this.BbsctAnswerRepository.answerDetail(bbsctt_answer_id);
      //정상적인 댓글인지 확인
      if (answer === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 댓글입니다.',
        });
      const { bbsctt_id } = answer;

      //신고유형이 기타이면 기타사유 입력되었는지 확인
      if (sttemnt_knd === BBSCTT_STTEMNT_ENUM.TYPE_6 && etc_resn.length < 1) {
        throw new BadRequestException({
          status_code: '0101001',
          message: '기타내역을 입력해주세요.',
        });
      }

      const sttAndWhere = {
        bbsctt_answer_id,
        rgstr_id: mber_id,
        del_process_at: BBSCTT_DEL_AT_ENUM.REPORT,
      };
      const sttemnt = await this.BbsSttemntRepository.find({ where: sttAndWhere });
      //이미 신고한 게시글인지 확인
      if (sttemnt.length > 0)
        throw new BadRequestException({
          status_code: '0101001',
          message: '해당 게시글을 이미 신고하였습니다.',
        });

      //신고 내역 추가 history insert
      const { identifiers } = await this.manager.insert(BbsSttemnt, {
        bbsctt_id,
        bbsctt_answer_id,
        sttemnt_knd,
        etc_resn,
        del_process_at: BBSCTT_DEL_AT_ENUM.REPORT,
        rgstr_id: Number(mber_id),
      });
      if (identifiers.length < 1)
        throw new InternalServerErrorException({
          status_code: '0101001',
          message: 'sttemnt insert fail',
        });

      //해당 댓글의 신고 count +1
      const { affected } = await this.manager.update(
        BbsctAnswer,
        { bbsctt_answer_id },
        {
          del_process_at: BBSCTT_DEL_AT_ENUM.REPORT,
          sttemnt_co: () => 'ifnull(sttemnt_co,0) + 1',
        },
      );
      if (affected < 1)
        throw new InternalServerErrorException({
          status_code: '0101001',
          message: 'bbsctt update fail',
        });
      await this.queryRunner.commitTransaction();
      return true;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }
  /**
   * 댓글 좋아요 싫어요
   * @param user 로그인 정보
   * @param bbsctt_answer_id  댓글 ID
   * @param recomend_se 1:좋아요 2:싫어요 여부
   * @returns
   */
  async setBbscttAnswerRecomend(
    user: DefaultUserDto,
    bbsctt_answer_id: number,
    recomend_se: BBSCTT_RECOMEND | string,
  ): Promise<string> {
    try {
      this.queryRunner = this.dataSource.createQueryRunner();
      this.manager = this.queryRunner.manager;
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();

      const { mber_id } = user;
      const answer = await this.BbsctAnswerRepository.answerDetail(bbsctt_answer_id);
      //정상적인 댓글인지 확인
      if (answer === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 댓글입니다.',
        });
      const { bbsctt_id } = answer;
      const answerWhere = { bbsctt_answer_id, bbsctt_id };
      const recomendWHere = {
        ...answerWhere,
        rgstr_id: mber_id,
      };

      // 업데이트 컬럼 변수
      const updateColumn = {
        recomend_co: () =>
          `ifnull(recomend_co,0) ${recomend_se === BBSCTT_RECOMEND_ENUM.LIKE ? '+ 1' : '-1'}`,
        non_recomend_co: () =>
          `ifnull(non_recomend_co,0) ${
            recomend_se === BBSCTT_RECOMEND_ENUM.DIS_LIKE ? '+ 1' : '-1'
          }`,
      };

      //기존에 댓글 추천 내역 있는지 확인
      const data = await this.BbsRecomendRepository.findOne({ where: recomendWHere });
      const { bbs_recomend_id = 0, recomend_se: findRecomend = '' } = data || {};
      //이미 좋아요 싫어요 하였는지
      if (findRecomend === recomend_se) {
        throw new BadRequestException({
          status_code: '0101001',
          message: `이미 ${
            recomend_se === BBSCTT_RECOMEND_ENUM.LIKE ? '좋아요' : '싫어요'
          }를 하였습니다.`,
        });
      } else if (bbs_recomend_id > 0 && findRecomend !== recomend_se) {
        //좋아요를 눌렀는데 이미 싫어요를 했으면 싫어요 내역 삭제
        const { affected: deleteResult } = await this.manager.delete(BbsRecomend, {
          bbs_recomend_id,
        });
        if (deleteResult === null)
          throw new InternalServerErrorException({
            status_code: '9999999',
            message: 'recomend history remove fail',
          });
      }

      //좋아요 싫어요 내역 추가 history insert
      const { identifiers } = await this.manager.insert(BbsRecomend, {
        bbsctt_answer_id,
        bbsctt_id,
        recomend_se,
        rgstr_id: mber_id,
      });
      if (identifiers.length < 1)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: 'recomend history insert fail',
        });

      await this.queryRunner.commitTransaction();
      //해당 댓글 좋아요 싫어요 내역 count 구해서 update
      await this.bbscttAnswerRecomendCountUpdate(bbsctt_answer_id);
      return recomend_se;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }

  /**
   * 댓글 좋아요 싫어요 취소
   * @param user 로그인 정보
   * @param bbsctt_answer_id  댓글 ID
   * @param recomend_se 1:좋아요 2:싫어요 여부
   * @returns
   */
  async setBbscttAnswerRecomendCancel(
    user: DefaultUserDto,
    bbsctt_answer_id: number,
    recomend_se: BBSCTT_RECOMEND | string,
  ): Promise<string> {
    try {
      this.queryRunner = this.dataSource.createQueryRunner();
      this.manager = this.queryRunner.manager;
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();

      const { mber_id } = user;
      const answer = await this.BbsctAnswerRepository.answerDetail(bbsctt_answer_id);
      //정상적인 댓글인지 확인
      if (answer === null)
        throw new BadRequestException({
          status_code: '0101001',
          message: '존재하지 않는 댓글입니다.',
        });
      const { bbsctt_id } = answer;
      const answerWhere = { bbsctt_answer_id, bbsctt_id };
      const recomendWHere = {
        ...answerWhere,
        rgstr_id: mber_id,
        recomend_se,
      };

      //기존에 댓글 추천 내역 있는지 확인
      const data = await this.BbsRecomendRepository.findOne({ where: recomendWHere });
      if (data === null) {
        throw new BadRequestException({
          status_code: '0101001',
          message: `${
            recomend_se === BBSCTT_RECOMEND_ENUM.LIKE ? '좋아요' : '싫어요'
          } 내역이 없습니다.`,
        });
      }
      const { bbs_recomend_id, recomend_se: findRecomend } = data;

      //좋아요 싫어요 내역 삭제
      const { affected: deleteResult } = await this.manager.delete(BbsRecomend, {
        bbs_recomend_id,
      });
      if (deleteResult === null)
        throw new InternalServerErrorException({
          status_code: '9999999',
          message: 'recomend history remove fail',
        });

      await this.queryRunner.commitTransaction();
      await this.bbscttAnswerRecomendCountUpdate(bbsctt_answer_id);
      return recomend_se;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }
}
