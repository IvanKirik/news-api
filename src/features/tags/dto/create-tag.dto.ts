import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: true })
  @MaxLength(100)
  name: string;
}
