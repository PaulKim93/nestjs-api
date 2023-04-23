import { CommunityService } from './community.service';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserJwtAuthGuard } from '@api/auth/guards/user-jwt-auth.guard';
import { DefaultUserDto } from '@api/auth/dto/res.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { PageDto, BaseResDto, BaseErrorResDto } from '@app/share/dto/default.dto';
import {
  BbscttListDto,
  BbscttRecomendSetDto,
  PathBbscttIdDto,
  BbscttSttemnt,
  BbscttSavetDto,
  BbscttAnswerInsertDto,
  BbscttAnswerUpdateDto,
  BbscttRecomendCancelDto,
} from './dto/req.dto';
import {
  GetBbsListResDto,
  BbsResDto,
  GetBbscttListResDto,
  GetBbscttDetailResDto,
  PostBbscttAnswerResDto,
  GetBbscttAnswerListResDto,
  GetBbsCategoryResDto,
  PostBbscttResDto,
  RecomendResDto,
  GetBbscttDetailResDtoDataField,
} from './dto/res.dto';
import { RealIP } from 'nestjs-real-ip';

@ApiTags('community')
@Controller('community')
@ApiBearerAuth('access-token')
@UseGuards(UserJwtAuthGuard)
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('/bbs')
  @ApiOperation({ summary: '커뮤니티 게시판 리스트 조회' })
  //@ApiBody({ type: PageDto})
  @ApiResponse({ status: 200, description: '성공', type: GetBbsListResDto })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  async getBbs(@Query() query: PageDto): Promise<GetBbsListResDto> {
    try {
      const { data, pagination } = await this.communityService.bbsList(query);
      return {
        status: true,
        status_code: '0000000',
        data,
        pagination,
      };
    } catch (e) {
      throw e;
    }
  }

  @Get('/bbsctt/:bbsctt_id')
  @ApiParam({ name: 'bbsctt_id', description: '게시글ID' })
  @ApiOperation({ summary: '커뮤니티 게시글 조회' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({
    status: 200,
    description: '성공 (본인이 좋아요, 싫어요 누른게 없으면 my_recomend 속성이 없음)',
    type: GetBbscttDetailResDto,
  })
  async getBbsctt(@Param() param: PathBbscttIdDto, @Request() req): Promise<GetBbscttDetailResDto> {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const { bbsctt_id = '' } = param;
      const data = await this.communityService.getBbscttDetail(bbsctt_id as string, user);

      return {
        status: true,
        status_code: '0000000',
        data,
      };
    } catch (e) {
      throw e;
    }
  }

  @Get('/bbsctt-list/:bbs_id')
  @ApiParam({ name: 'bbs_id', description: '게시판ID' })
  @ApiOperation({ summary: '커뮤니티 게시글 리스트 조회' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 200, description: '성공', type: GetBbscttListResDto })
  async getBbscttList(
    @Param('bbs_id') bbs_id: string,
    @Request() req,
    @Query() query: BbscttListDto,
  ) {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const data = await this.communityService.bbscttList(bbs_id, query);
      return {
        status: true,
        status_code: '0000000',
        ...data,
      };
    } catch (e) {
      throw e;
    }
  }

  @Get('/bbsctt-answers/:bbsctt_id')
  @ApiParam({ name: 'bbsctt_id', description: '게시글ID' })
  @ApiOperation({ summary: '커뮤니티 게시글 댓글 리스트 조회 ' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 200, description: '성공', type: GetBbscttAnswerListResDto })
  async getAnswerList(
    @Param() param: PathBbscttIdDto,
    @Request() req,
    @Query() query: PageDto,
  ): Promise<GetBbscttAnswerListResDto> {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const { bbsctt_id = '' } = param;
      const { data, pagination } = await this.communityService.getAnswerList(
        user,
        bbsctt_id,
        query,
      );
      return {
        status: true,
        status_code: '0000000',
        data,
        pagination,
      };
    } catch (e) {
      throw e;
    }
  }

  @Post('/bbsctt-recomend/:bbsctt_id')
  @ApiParam({ name: 'bbsctt_id', description: '게시글ID' })
  @ApiBody({ type: BbscttRecomendSetDto })
  @ApiOperation({ summary: '커뮤니티 게시글 좋아요, 싫어요' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 201, description: '성공', type: RecomendResDto })
  async bbscttRecomend(
    @Param() param: PathBbscttIdDto,
    @Request() req,
    @Body() body: BbscttRecomendSetDto,
  ): Promise<RecomendResDto> {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const { bbsctt_id } = param;
      const { recomend_se } = body;
      const result_recomend_se = await this.communityService.setBbscttRecomend(
        user,
        bbsctt_id as string,
        recomend_se,
      );
      return {
        status: true,
        status_code: '0000000',
        recomend_se: result_recomend_se,
        message: ` ${result_recomend_se === '1' ? '좋아요' : '싫어요'} 성공`,
      };
    } catch (e) {
      throw e;
    }
  }

  @Delete('/bbsctt-recomend/:bbsctt_id')
  @ApiParam({ name: 'bbsctt_id', description: '게시글ID' })
  @ApiBody({ type: BbscttRecomendSetDto })
  @ApiOperation({ summary: '커뮤니티 게시글 좋아요, 싫어요 취소' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 200, description: '성공', type: RecomendResDto })
  async bbscttRecomendCancel(
    @Param() param: PathBbscttIdDto,
    @Request() req,
    @Body() body: BbscttRecomendSetDto,
  ): Promise<RecomendResDto> {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const { bbsctt_id } = param;
      const { recomend_se } = body;

      const result_recomend_se = await this.communityService.setBbscttRecomendCancel(
        user,
        bbsctt_id as string,
        recomend_se,
      );

      return {
        status: true,
        status_code: '0000000',
        recomend_se: result_recomend_se,
        message: ` ${result_recomend_se === '1' ? '좋아요' : '싫어요'} 취소 성공`,
      };
    } catch (e) {
      throw e;
    }
  }

  @Post('/bbsctt-sttemnt/:bbsctt_id')
  @ApiParam({ name: 'bbsctt_id', description: '게시글ID' })
  @ApiOperation({ summary: '커뮤니티 게시글 신고' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 201, description: '성공', type: BaseResDto })
  async bbscttSttemnt(
    @Param() param: PathBbscttIdDto,
    @Request() req,
    @Body() body: BbscttSttemnt,
  ): Promise<BaseResDto> {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const { bbsctt_id = '' } = param;
      const result = await this.communityService.bbscttSttemnt(user, bbsctt_id as string, body);
      return {
        status: true,
        status_code: '0000000',
      };
    } catch (e) {
      throw e;
    }
  }

  @Get('/bbs-category/:bbs_id')
  @ApiParam({ name: 'bbs_id', description: '게시판 ID' })
  @ApiOperation({ summary: '커뮤니티 게시판 카테고리 리스트 조회' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 200, description: '성공', type: GetBbsCategoryResDto })
  async getBbsCategory(@Param('bbs_id') bbs_id: string): Promise<GetBbsCategoryResDto> {
    try {
      const data = await this.communityService.getBbsCategory(bbs_id);
      return {
        status: true,
        status_code: '0000000',
        data,
      };
    } catch (e) {
      throw e;
    }
  }

  @Post('/bbsctt')
  @ApiBody({ type: BbscttSavetDto })
  @ApiOperation({ summary: '커뮤니티 게시글 등록' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 201, description: '성공', type: PostBbscttResDto })
  async insertBbsctt(@Request() req, @Body() body: BbscttSavetDto): Promise<PostBbscttResDto> {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const bbsctt_id = await this.communityService.insertBbsctt(user, body);
      return {
        status: true,
        status_code: '0000000',
        data: {
          bbsctt_id,
        },
      };
    } catch (e) {
      throw e;
    }
  }

  @Put('/bbsctt/:bbsctt_id')
  @ApiParam({ name: 'bbsctt_id', description: '게시글 ID' })
  @ApiOperation({ summary: '커뮤니티 게시글 수정' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: BaseResDto,
    content: {
      'application/json': {
        example: {
          status: true,
          status_code: '0000000',
        },
      },
    },
  })
  async updateBbsctt(
    @Param() param: PathBbscttIdDto,
    @Request() req,
    @Body() body: BbscttSavetDto,
  ) {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const { bbsctt_id } = param;
      const result = await this.communityService.updateBbsctt(user, bbsctt_id, body);
      return {
        status: true,
        status_code: '0000000',
      };
    } catch (e) {
      throw e;
    }
  }

  @Delete('/bbsctt/:bbsctt_id')
  @ApiParam({ name: 'bbsctt_id', description: '게시글 ID' })
  @ApiOperation({ summary: '커뮤니티 게시글 삭제' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: BaseResDto,
    content: {
      'application/json': {
        example: {
          status: true,
          status_code: '0000000',
        },
      },
    },
  })
  async deleteBbsctt(@Param() param: PathBbscttIdDto, @Request() req) {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const { bbsctt_id } = param;
      const result = await this.communityService.deleteBbsctt(user, bbsctt_id);
      return {
        status: true,
        status_code: '0000000',
      };
    } catch (e) {
      throw e;
    }
  }

  @Post('/bbsctt-answer')
  @ApiOperation({
    summary: '커뮤니티 게시글 댓글(댓글 답글 - parnts_bbsctt_answer_id 필드 있으면 답글) 추가',
  })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 201, description: '성공', type: PostBbscttAnswerResDto })
  async insertAnswer(@Request() req, @Body() body: BbscttAnswerInsertDto) {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const data = await this.communityService.insertBbscttAnswer(user, body);
      return {
        status: true,
        status_code: '0000000',
        data,
      };
    } catch (e) {
      throw e;
    }
  }

  @Put('/bbsctt-answer/:bbsctt_answer_id')
  @ApiParam({ name: 'bbsctt_answer_id', description: '게시글 댓글 ID' })
  @ApiOperation({ summary: '커뮤니티 게시글 댓글 수정' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 200, description: '성공', type: BaseResDto })
  async updateAnswer(
    @Param('bbsctt_answer_id') bbsctt_answer_id: string,
    @Request() req,
    @Body() body: BbscttAnswerUpdateDto,
  ) {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const result = await this.communityService.updateBbscttAnswer(
        Number(bbsctt_answer_id),
        user,
        body,
      );
      return {
        status: true,
        status_code: '0000000',
      };
    } catch (e) {
      throw e;
    }
  }

  @Delete('/bbsctt-answer/:bbsctt_answer_id')
  @ApiParam({ name: 'bbsctt_answer_id', description: '게시글 댓글 ID' })
  @ApiOperation({ summary: '커뮤니티 게시글 댓글 삭제' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 200, description: '성공', type: BaseResDto })
  async deleteAnswer(@Param('bbsctt_answer_id') bbsctt_answer_id: number, @Request() req) {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const result = await this.communityService.deleteBbscttAnswer(bbsctt_answer_id, user);
      return {
        status: true,
        status_code: '0000000',
      };
    } catch (e) {
      throw e;
    }
  }

  @Post('/bbsctt-answer/sttemnt/:bbsctt_answer_id')
  @ApiParam({ name: 'bbsctt_answer_id', description: '게시글 댓글 ID' })
  @ApiOperation({ summary: '커뮤니티 게시글 댓글 신고' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 201, description: '성공', type: BaseResDto })
  async answerSttemnt(
    @Request() req,
    @Param('bbsctt_answer_id') bbsctt_answer_id: string,
    @Body() body: BbscttSttemnt,
  ) {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const result = await this.communityService.bbscttAnswerSttemnt(
        user,
        Number(bbsctt_answer_id),
        body,
      );
      return {
        status: true,
        status_code: '0000000',
      };
    } catch (e) {
      throw e;
    }
  }

  @Post('/bbsctt-answer/recomend/:bbsctt_answer_id')
  @ApiParam({ name: 'bbsctt_answer_id', description: '게시글댓글ID' })
  @ApiBody({ type: BbscttRecomendSetDto })
  @ApiOperation({ summary: '커뮤니티 게시글->댓글 좋아요, 싫어요' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 201, description: '성공', type: RecomendResDto })
  async bbscttAnswerRecomend(
    @Param('bbsctt_answer_id') bbsctt_answer_id: string,
    @Request() req,
    @Body() body: BbscttRecomendSetDto,
  ): Promise<RecomendResDto> {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const { recomend_se } = body;
      const result_recomend_se = await this.communityService.setBbscttAnswerRecomend(
        user,
        Number(bbsctt_answer_id),
        recomend_se,
      );
      return {
        status: true,
        status_code: '0000000',
        recomend_se: result_recomend_se,
        message: ` ${result_recomend_se === '1' ? '좋아요' : '싫어요'} 성공`,
      };
    } catch (e) {
      throw e;
    }
  }

  @Delete('/bbsctt-answer/recomend/:bbsctt_answer_id')
  @ApiParam({ name: 'bbsctt_answer_id', description: '게시글댓글ID' })
  @ApiBody({ type: BbscttRecomendCancelDto })
  @ApiOperation({ summary: '커뮤니티 게시글->댓글 좋아요, 싫어요 취소' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 200, description: '성공', type: RecomendResDto })
  async bbscttAnswerRecomendCancel(
    @Param('bbsctt_answer_id') bbsctt_answer_id: number,
    @Request() req,
    @Body() body: BbscttRecomendCancelDto,
  ): Promise<RecomendResDto> {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const { recomend_se } = body;
      const result_recomend_se = await this.communityService.setBbscttAnswerRecomendCancel(
        user,
        bbsctt_answer_id,
        recomend_se,
      );
      return {
        status: true,
        status_code: '0000000',
        recomend_se: result_recomend_se,
        message: ` ${result_recomend_se === '1' ? '좋아요' : '싫어요'} 취소 성공`,
      };
    } catch (e) {
      throw e;
    }
  }
}
