import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetArticleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Min(100)
  limit?: number = 10;

  @ApiProperty({
    required: false,
    description: 'Array of tag IDs. Example queryParams - tags=1,2,44',
  })
  @IsOptional()
  tags?: string;

  @ApiProperty({
    required: false,
    description: 'Array of email IDs. Example queryParams - emails=1,2,44',
  })
  @IsOptional()
  emails?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortField?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
