import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get('levels')
  @ApiOperation({ summary: 'CEFR seviyeleri ve alt seviyeleri listele' })
  getLevels() {
    return this.contentService.getLevels();
  }

  @Get('sublevels')
  @ApiOperation({ summary: 'Alt seviyeleri listele' })
  @ApiQuery({ name: 'levelId', required: false })
  getSubLevels(@Query('levelId') levelId?: string) {
    return this.contentService.getSubLevels(levelId);
  }

  @Get('topics')
  @ApiOperation({ summary: 'Konuları listele' })
  @ApiQuery({ name: 'subLevelId', required: false })
  getTopics(@Query('subLevelId') subLevelId?: string) {
    return this.contentService.getTopics(subLevelId);
  }
}
