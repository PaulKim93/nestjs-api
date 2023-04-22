import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { BaseErrorResDto, BaseResDto } from '@app/share/dto/default.dto';
import { ApiOperation, ApiBearerAuth, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { UserLocalAuthGuard } from './guards/user-local-auth.guard';
import { AuthService } from './auth.service';
import { DefaultUserDto } from '@api/auth/dto/res.dto';
import { UserJoinReqDtoPost, UserLoginReqDtoPost } from './dto/req.dto';
import { RealIP } from 'nestjs-real-ip';
import { UserRefreshJwtAuthGuard } from './guards/user-refresh-jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/user/login')
  @ApiOperation({ summary: '회원 로그인' })
  @UseGuards(UserLocalAuthGuard)
  @ApiBody({ type: UserLoginReqDtoPost })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 200, description: '성공', type: BaseResDto })
  async loginPost(@Request() req) {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const data = await this.authService.ceateUserToken(user);
      return {
        status: true,
        status_code: '0000000',
        data,
      };
    } catch (e) {
      throw e;
    }
  }

  @Post('/user/refresh')
  @ApiOperation({ summary: 'refresh token' })
  @UseGuards(UserRefreshJwtAuthGuard)
  @ApiBearerAuth('refresh-token')
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 200, description: '성공', type: BaseResDto })
  async refreshPost(@Request() req) {
    try {
      const { user }: { user: DefaultUserDto } = req;
      const data = await this.authService.ceateUserToken(user);
      return {
        status: true,
        status_code: '0000000',
        data,
      };
    } catch (e) {
      throw e;
    }
  }

  @Post('/user/join')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 400, description: '필수 항목 미입력', type: BaseErrorResDto })
  @ApiResponse({ status: 200, description: '성공', type: BaseResDto })
  async joinPost(@Body() dto: UserJoinReqDtoPost, @RealIP() ip: string) {
    try {
      const data = await this.authService.userJoinPost(dto, ip);
      return {
        status: true,
        status_code: '0000000',
        data,
      };
    } catch (e) {
      throw e;
    }
  }
}
