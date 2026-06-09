import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('auth')
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** GLS-17 Student Registration */
  @Post('register')
  @ApiOperation({ summary: 'Kayıt ol (GLS-17)' })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(
      dto,
      req.ip,
      req.headers['user-agent'],
    );
    this._setRefreshCookie(res, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken };
  }

  /** GLS-18 Student Login */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Giriş yap (GLS-18)' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(
      dto,
      req.ip,
      req.headers['user-agent'],
    );
    this._setRefreshCookie(res, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken };
  }

  /** GLS-23 Log Out */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Çıkış yap (GLS-23)' })
  async logout(
    @CurrentUser() user: { id: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawRefresh = req.cookies?.['refresh_token'] ?? req.body?.refreshToken ?? '';
    await this.authService.logout(user.id, rawRefresh);
    res.clearCookie('refresh_token');
    return { message: 'Başarıyla çıkış yapıldı.' };
  }

  /** Token Refresh */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Access token yenile' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body('refreshToken') bodyToken?: string,
  ) {
    const rawRefresh = req.cookies?.['refresh_token'] ?? bodyToken;
    if (!rawRefresh) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Refresh token bulunamadı.' });
      return;
    }

    // Decode without verifying to get userId, then verify in service
    const parts = rawRefresh.split('.');
    if (parts.length < 3) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Geçersiz token.' });
      return;
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    const tokens = await this.authService.refresh(
      payload.sub,
      rawRefresh,
      req.ip,
      req.headers['user-agent'],
    );
    this._setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  /** GLS-21 Password Reset — Request */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Şifre sıfırlama isteği (GLS-21)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  /** GLS-21 Password Reset — Confirm */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Şifre sıfırla (GLS-21)' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  private _setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/api',
    });
  }
}
