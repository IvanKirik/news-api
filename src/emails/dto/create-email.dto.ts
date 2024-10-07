import { ApiProperty } from '@nestjs/swagger';

export class CreateEmailDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: true })
  email: string;
}
