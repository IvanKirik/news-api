import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CreateSpecialityDto {
  @ApiProperty({ required: true })
  @MaxLength(100)
  name: string;
}
