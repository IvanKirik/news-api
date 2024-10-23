import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetTagDto {
  @ApiProperty()
  // @Type(() => Number)
  id: number;
}
