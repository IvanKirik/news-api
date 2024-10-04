import { Article } from '../article.model';
import { ResponseItems } from '../../core/interfaces/response-items.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseArticlesDto implements ResponseItems<Article> {
  @ApiProperty({ type: [Article] })
  data: Article[];

  @ApiProperty({ type: Number })
  page: number;

  @ApiProperty({ type: Number })
  pageSize: number;

  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: Number })
  totalPages: number;
}
