import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: true })
  name: string;
}
