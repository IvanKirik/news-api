import { ApiProperty } from '@nestjs/swagger';

export class FileElementResponse {
  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: String })
  name: string;
}
