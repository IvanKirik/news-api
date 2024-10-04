import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './article.model';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateArticleDto } from './dto/create-article.dto';
import { ARTICLE_NOT_FOUND_ERROR_MESSAGE } from './article.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetArticleDto } from './dto/get-article.dto';
import { ResponseItems } from '../core/interfaces/response-items.dto';
import { ResponseArticlesDto } from './dto/response-articles.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOkResponse({
    type: ResponseArticlesDto,
    description: 'Get a articles',
  })
  public async getArticles(
    @Query() params: GetArticleDto,
  ): Promise<ResponseItems<Article>> {
    return await this.articlesService.findAll(params);
  }

  @Get(':id')
  @ApiOkResponse({
    type: Article,
    description: 'Get a article',
  })
  public async getArticle(@Param('id') id: string) {
    const article = await this.articlesService.findById(id);
    if (!article) {
      throw new HttpException(
        ARTICLE_NOT_FOUND_ERROR_MESSAGE,
        HttpStatus.NOT_FOUND,
      );
    }
    return article;
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  @ApiOkResponse({
    type: Article,
    description: 'Create a article',
  })
  @UseGuards(JwtAuthGuard)
  public async createArticle(@Body() dto: CreateArticleDto): Promise<Article> {
    return await this.articlesService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: Article,
    description: 'Update a article',
  })
  @UseGuards(JwtAuthGuard)
  public async updateArticle(
    @Param('id') id: string,
    @Body() dto: CreateArticleDto,
  ): Promise<Article | null> {
    return await this.articlesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public deleteArticle(@Param('id') id: string): Promise<void> {
    return this.articlesService.delete(id);
  }
}
