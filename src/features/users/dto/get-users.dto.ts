import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersDto {
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortField?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
