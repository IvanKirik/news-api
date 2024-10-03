import { HttpException, HttpStatus, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.model';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { ARTICLE_NOT_FOUND_ERROR_MESSAGE } from './article.constants';
import { GetArticleDto } from './dto/get-article.dto';
import { ResponseItems } from '../core/interfaces/response-items.dto';
import { articles } from './articles.init';

@Injectable()
export class ArticlesService implements OnModuleInit {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  public async findAll(dto: GetArticleDto): Promise<ResponseItems<Article>> {
    const { search, page, limit, sortField, sortOrder } = dto;

    const qb = this.articleRepository.createQueryBuilder('article');

    if (search) {
      qb.andWhere('article.title ILIKE :search', { search: `%${search}%` });
    }

    const currentPage = page || 1;
    const pageSize = limit || 10;

    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    if (sortField) {
      qb.orderBy(`article.${sortField}`, sortOrder || 'ASC');
    } else {
      qb.orderBy('article.createdAt', 'DESC');
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items,
      total,
      page: currentPage,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  public async findById(id: string | number): Promise<Article> {
    return await this.articleRepository.findOne({
      where: { id: +id },
    });
  }

  public async create(article: CreateArticleDto): Promise<Article> {
    const model = this.articleRepository.create(article);
    await this.articleRepository.save(model);
    return model;
  }

  public async update(id: string, dto: CreateArticleDto): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id: +id },
    });
    if (!article) {
      throw new HttpException(
        ARTICLE_NOT_FOUND_ERROR_MESSAGE,
        HttpStatus.NOT_FOUND,
      );
    }
    article.description = dto.description;
    article.image = dto.image;
    article.title = dto.title;

    await this.articleRepository.save(article);
    return article;
  }

  public async delete(id: string): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { id: +id },
    });
    if (!article) {
      throw new HttpException(
        ARTICLE_NOT_FOUND_ERROR_MESSAGE,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.articleRepository.delete(id);
  }

  public async onModuleInit(): Promise<void> {
    for (const article of articles) {
      const find = await this.findById(article.id);
      if (!find) {
        await this.articleRepository.save(article);
      } else {
        await this.articleRepository.update(article.id, {
          title: article.title,
          description: article.description,
          image: article.image,
          email: article.email,
        });
      }
    }
  }
}
