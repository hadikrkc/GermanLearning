import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ── GLS-17 Student Registration ────────────────────────────────
  async register(dto: RegisterDto, ipAddress?: string, userAgent?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Bu e-posta adresi zaten kayıtlı.');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
        role: dto.role ?? UserRole.USER,
      },
      select: { id: true, email: true, role: true, displayName: true, createdAt: true },
    });

    // Dev ortamında email gönderimi simüle edilir
    console.log(`[DEV] Kayıt teyit e-postası gönderildi: ${dto.email}`);

    const tokens = await this._issueTokens(user.id, user.email, user.role, ipAddress, userAgent);
    return { user, ...tokens };
  }

  // ── GLS-18 Student Login ────────────────────────────────────────
  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Geçersiz kimlik bilgileri.');

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('Geçersiz kimlik bilgileri.');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this._issueTokens(user.id, user.email, user.role, ipAddress, userAgent);
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      ...tokens,
    };
  }

  // ── GLS-23 Log Out ──────────────────────────────────────────────
  async logout(userId: string, rawRefreshToken: string) {
    const tokenHash = this._hashToken(rawRefreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { userId, tokenHash },
      data: { revokedAt: new Date() },
    });
  }

  // ── Token Refresh ───────────────────────────────────────────────
  async refresh(userId: string, rawRefreshToken: string, ipAddress?: string, userAgent?: string) {
    const tokenHash = this._hashToken(rawRefreshToken);
    const stored = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    if (!stored) throw new UnauthorizedException('Geçersiz veya süresi dolmuş refresh token.');

    // Rotate token
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return this._issueTokens(user.id, user.email, user.role, ipAddress, userAgent);
  }

  // ── GLS-21 Password Reset ───────────────────────────────────────
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Always return OK to avoid email enumeration
    if (!user || !user.isActive) return { message: 'E-posta gönderildi.' };

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this._hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    // Dev: log token; Production: send email
    console.log(`[DEV] Şifre sıfırlama linki: /auth/reset-password?token=${rawToken}`);

    return { message: 'E-posta gönderildi.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = this._hashToken(token);
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Geçersiz veya süresi dolmuş token.');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Şifre başarıyla güncellendi.' };
  }

  // ── Helpers ─────────────────────────────────────────────────────
  private async _issueTokens(
    userId: string,
    email: string,
    role: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('ACCESS_TOKEN_TTL', '15m'),
    });

    const rawRefresh = crypto.randomBytes(48).toString('hex');
    const refreshExpiresIn = this.config.get('REFRESH_TOKEN_TTL', '30d');
    const expiresAt = new Date(
      Date.now() + this._parseTtl(refreshExpiresIn),
    );

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this._hashToken(rawRefresh),
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    return { accessToken, refreshToken: rawRefresh };
  }

  private _hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private _parseTtl(ttl: string): number {
    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) return 30 * 24 * 60 * 60 * 1000;
    const [, num, unit] = match;
    const n = parseInt(num);
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return n * (multipliers[unit] ?? 86_400_000);
  }
}
