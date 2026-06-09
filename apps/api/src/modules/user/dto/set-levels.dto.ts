import { ArrayNotEmpty, IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SetLevelsDto {
  @ApiProperty({ type: [String], description: 'SubLevel ID listesi' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  subLevelIds: string[];

  @ApiPropertyOptional({ description: 'Birincil seviye ID' })
  @IsOptional()
  @IsString()
  primarySubLevelId?: string;
}
