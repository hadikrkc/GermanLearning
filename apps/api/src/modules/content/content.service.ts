import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  getLevels() {
    return this.prisma.level.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        subLevels: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  getSubLevels(levelId?: string) {
    return this.prisma.subLevel.findMany({
      where: {
        isActive: true,
        ...(levelId ? { levelId } : {}),
      },
      orderBy: { sortOrder: 'asc' },
      include: { level: true },
    });
  }

  getTopics(subLevelId?: string) {
    return this.prisma.topic.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
        ...(subLevelId ? { subLevelId } : {}),
      },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        displayName: true,
        description: true,
        sortOrder: true,
        subLevel: { select: { id: true, code: true, displayName: true } },
        level: { select: { id: true, code: true, displayName: true } },
      },
    });
  }
}
