import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.model';
import { TAG_NOT_FOUND_ERROR_MESSAGE } from './tags.constants';
import { CreateTagDto } from './dto/create-tag.dto';
import { tagsInit } from './tags.init';

@Injectable()
export class TagsService implements OnModuleInit {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  public async getTags(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  public async createTag({ name }: { name: string }): Promise<Tag> {
    const findTag = await this.tagRepository.findOne({ where: { name: name } });
    if (!findTag) {
      const tag = this.tagRepository.create({ name });
      await this.tagRepository.save(tag);
      return tag;
    } else {
      await this.tagRepository.update(findTag.id, { name: name });
      return findTag;
    }
  }

  public async findTag(id: any): Promise<Tag | null> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return tag;
  }

  public async deleteTag(id: string): Promise<void> {
    const tag = await this.tagRepository.findOne({ where: { id: +id } });
    if (!tag) {
      throw new HttpException(
        TAG_NOT_FOUND_ERROR_MESSAGE,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.tagRepository.delete(id);
  }

  public async updateTag(id: string, tagDto: CreateTagDto): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id: +id },
    });
    if (!tag) {
      throw new HttpException(
        TAG_NOT_FOUND_ERROR_MESSAGE,
        HttpStatus.NOT_FOUND,
      );
    }
    tag.name = tagDto.name;

    await this.tagRepository.save(tag);
    return tag;
  }

  public async onModuleInit(): Promise<void> {
    const findTags = await this.tagRepository.find();
    if (!findTags.length) {
      for (const article of tagsInit) {
        const model = this.tagRepository.create(article);
        await this.tagRepository.save(model);
      }
    }
  }
}
