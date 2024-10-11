import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.model';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { ARTICLE_NOT_FOUND_ERROR_MESSAGE } from './article.constants';
import { GetArticleDto } from './dto/get-article.dto';
import {
  ResponseItems,
  ResponseItemsDto,
} from '../shared/interfaces/response-items.dto';
import { articles } from './articles.init';
import { TagsService } from '../tags/tags.service';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class ArticlesService implements OnModuleInit {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly tagService: TagsService,
    private readonly emailsService: EmailsService,
  ) {}

  public async findAll(dto: GetArticleDto): Promise<ResponseItems<Article>> {
    const { search, page, limit, sortField, sortOrder, tags, emails } = dto;

    const tagsArr = tags ? tags.split(',') : [];
    const emailsArr = emails ? emails : [];

    const qb = this.articleRepository.createQueryBuilder('article');

    qb.leftJoinAndSelect('article.tags', 'tags');
    qb.leftJoinAndSelect('article.emailsToSend', 'emails');

    if (search) {
      qb.andWhere('article.title ILIKE :search', { search: `%${search}%` });
    }

    if (tagsArr.length > 0) {
      qb.innerJoin(
        'article.tags',
        'tags_filter',
        'tags_filter.id IN (:...tagsArr)',
        { tagsArr },
      );
    }

    if (emailsArr.length > 0) {
      qb.innerJoin(
        'article.emailsToSend',
        'emails_filter',
        'emails_filter.id IN (:...emailsArr)',
        { emailsArr },
      );
    }

    qb.distinct(true);

    const currentPage = parseInt(String(page), 10) || 1;
    const pageSize = parseInt(String(limit), 10) || 10;
    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    if (sortField) {
      qb.orderBy(`article.${sortField}`, sortOrder || 'ASC');
    } else {
      qb.orderBy('article.createdAt', 'DESC');
    }

    const [items, total] = await qb.getManyAndCount();

    return new ResponseItemsDto(
      items,
      page,
      pageSize,
      total,
      Math.ceil(total / pageSize),
    );
  }

  public async findById(id: string | number): Promise<Article> {
    return await this.articleRepository.findOne({
      where: { id: +id },
      relations: ['tags', 'emailsToSend'],
    });
  }

  public async create({
    tags,
    emails,
    ...article
  }: CreateArticleDto): Promise<Article> {
    const newTags = [];
    for (const tag of tags) {
      if (tag.id) {
        newTags.push(tag);
      } else {
        const newTag = await this.tagService.createTag({ name: tag.name });
        newTags.push(newTag);
      }
    }

    const emailsToSend = [];
    for (const email of emails) {
      if (email.id) {
        emailsToSend.push(email);
      } else {
        const newEmail = await this.emailsService.createEmail({
          email: email.email,
        });
        emailsToSend.push(newEmail);
      }
    }

    const model = this.articleRepository.create({
      ...article,
      tags: newTags,
      emailsToSend,
    });
    await this.articleRepository.save(model);
    return model;
  }

  public async update(
    id: string,
    { tags, emails, ...dto }: CreateArticleDto,
  ): Promise<Article> {
    const newTags: any = [];

    for (const tag of tags) {
      if (tag.id) {
        newTags.push(tag);
      } else {
        const newTag = await this.tagService.createTag({ name: tag.name });
        newTags.push(newTag);
      }
    }

    const emailsToSend = [];

    for (const email of emails) {
      if (email.id) {
        emailsToSend.push(email);
      } else {
        const newEmail = await this.emailsService.createEmail({
          email: email.email,
        });
        emailsToSend.push(newEmail);
      }
    }

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
    article.tags = newTags;
    article.emailsToSend = emailsToSend;

    await this.articleRepository.save(article);
    return await this.articleRepository.findOne({
      where: { id: +id },
      relations: ['tags', 'emailsToSend'],
    });
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
    const findArticles = await this.articleRepository.find();
    if (!findArticles.length) {
      for (const article of articles) {
        const model = this.articleRepository.create(article);
        await this.articleRepository.save(model);
      }
    }
  }
}
