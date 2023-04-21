import { Controller, Get, Post, Param, Request, UseGuards } from '@nestjs/common';
import { BaseErrorResDto, BaseResDto } from '@app/share/dto/default.dto';
import { ApiOperation, ApiBearerAuth, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { UserLocalAuthGuard } from './guards/user-local-auth.guard';
import { UserLoginReqDtoPost } from './dto/req.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  @Post('/user/login')
  @ApiOperation({ summary: '회원 로그인' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UserLoginReqDtoPost })
  @UseGuards(UserLocalAuthGuard)
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 200, description: '성공', type: BaseResDto })
  async login(@Request() req) {
    try {
      return {
        status: true,
        status_code: '0000000',
        //data,
      };
    } catch (e) {
      throw e;
    }
  }
}
