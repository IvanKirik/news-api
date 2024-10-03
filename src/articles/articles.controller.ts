import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { ApiTags } from '@nestjs/swagger';
import { CreateArticleDto } from './dto/create-article.dto';
import { ARTICLE_NOT_FOUND_ERROR_MESSAGE } from './article.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetArticleDto } from './dto/get-article.dto';
import { ResponseItems } from '../core/interfaces/response-items.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  public async getArticles(
    @Query() params: GetArticleDto,
  ): Promise<ResponseItems<Article>> {
    return await this.articlesService.findAll(params);
  }

  @Get(':id')
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
  // @UseGuards(JwtAuthGuard)
  public async createArticle(@Body() dto: CreateArticleDto): Promise<Article> {
    return await this.articlesService.create(dto);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  public async updateArticle(
    @Param('id') id: string,
    @Body() dto: CreateArticleDto,
  ): Promise<Article | null> {
    return await this.articlesService.update(id, dto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  public deleteArticle(@Param('id') id: string): Promise<void> {
    return this.articlesService.delete(id);
  }
}
