import { ApiProperty } from '@nestjs/swagger';

export class SendArticlesDto {
  @ApiProperty({
    required: true,
    type: [Number],
    default: 'Array of users id',
  })
  users: number[];

  @ApiProperty({
    required: true,
    type: [Number],
    default: 'Array of articles id',
  })
  articles: number[];
}
