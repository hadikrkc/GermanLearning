import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SetLevelsDto } from './dto/set-levels.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // ── GLS-19 Edit Profile / GET me ──────────────────────────────
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        displayName: true,
        avatarUrl: true,
        dailyGoalCount: true,
        lastLoginAt: true,
        createdAt: true,
        userLevels: {
          include: {
            subLevel: { include: { level: true } },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı.');
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        role: true,
        displayName: true,
        avatarUrl: true,
        dailyGoalCount: true,
      },
    });
  }

  // ── GLS-71 Change Password ─────────────────────────────────────
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('Mevcut şifre hatalı.');

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });

    // Dev: log; Prod: send confirmation email
    console.log(`[DEV] Şifre değişikliği onay e-postası gönderildi: ${user.email}`);
    return { message: 'Şifre başarıyla değiştirildi.' };
  }

  // ── GLS-73 Account Deactivation ───────────────────────────────
  async deactivate(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
    // Revoke all refresh tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { message: 'Hesap devre dışı bırakıldı. 30 gün içinde yeniden aktifleştirilebilir.' };
  }

  // ── GLS-74 View Login History ─────────────────────────────────
  async getLoginHistory(userId: string) {
    const sessions = await this.prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        revokedAt: true,
        expiresAt: true,
      },
    });
    return sessions.map((s: typeof sessions[number]) => ({
      id: s.id,
      ipAddress: s.ipAddress ?? 'Bilinmiyor',
      device: s.userAgent ?? 'Bilinmiyor',
      loginAt: s.createdAt,
      isActive: !s.revokedAt && s.expiresAt > new Date(),
    }));
  }

  // ── Onboarding: Set Levels ─────────────────────────────────────
  async setLevels(userId: string, dto: SetLevelsDto) {
    // Validate all subLevels exist
    const subLevels = await this.prisma.subLevel.findMany({
      where: { id: { in: dto.subLevelIds }, isActive: true },
    });
    if (subLevels.length !== dto.subLevelIds.length) {
      throw new BadRequestException('Geçersiz seviye ID içeriyor.');
    }

    // Replace existing levels
    await this.prisma.userLevel.deleteMany({ where: { userId } });
    await this.prisma.userLevel.createMany({
      data: dto.subLevelIds.map((subLevelId) => ({
        userId,
        subLevelId,
        isPrimary: subLevelId === dto.primarySubLevelId,
      })),
    });

    return this.getMe(userId);
  }
}
