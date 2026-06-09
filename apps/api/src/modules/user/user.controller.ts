import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SetLevelsDto } from './dto/set-levels.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /** GLS-19 Edit Profile — GET */
  @Get('me')
  @ApiOperation({ summary: 'Profilimi getir (GLS-19)' })
  getMe(@CurrentUser() user: { id: string }) {
    return this.userService.getMe(user.id);
  }

  /** GLS-19 Edit Profile — PATCH */
  @Patch('me')
  @ApiOperation({ summary: 'Profili güncelle (GLS-19)' })
  updateMe(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateMe(user.id, dto);
  }

  /** GLS-71 Change Password */
  @Post('me/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Şifre değiştir (GLS-71)' })
  changePassword(
    @CurrentUser() user: { id: string },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user.id, dto);
  }

  /** GLS-73 Account Deactivation */
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hesabı devre dışı bırak (GLS-73)' })
  deactivate(@CurrentUser() user: { id: string }) {
    return this.userService.deactivate(user.id);
  }

  /** GLS-74 View Login History */
  @Get('me/login-history')
  @ApiOperation({ summary: 'Giriş geçmişi (GLS-74)' })
  getLoginHistory(@CurrentUser() user: { id: string }) {
    return this.userService.getLoginHistory(user.id);
  }

  /** Onboarding: Set Levels */
  @Post('me/levels')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'CEFR seviyelerimi belirle (Onboarding)' })
  setLevels(
    @CurrentUser() user: { id: string },
    @Body() dto: SetLevelsDto,
  ) {
    return this.userService.setLevels(user.id, dto);
  }
}
