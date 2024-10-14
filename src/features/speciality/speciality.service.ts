import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Speciality } from './speciality.model';
import { Repository } from 'typeorm';
import { TAG_NOT_FOUND_ERROR_MESSAGE } from '../tags/tags.constants';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { specialityInit } from './speciality.init';

@Injectable()
export class SpecialityService implements OnModuleInit {
  constructor(
    @InjectRepository(Speciality)
    private readonly specialityRepository: Repository<Speciality>,
  ) {}

  public async findAll(): Promise<Speciality[]> {
    return await this.specialityRepository.find();
  }

  public async create({ name }: { name: string }): Promise<Speciality> {
    const findItem = await this.specialityRepository.findOne({
      where: { name: name },
    });
    if (!findItem) {
      const tag = this.specialityRepository.create({ name });
      await this.specialityRepository.save(tag);
      return tag;
    } else {
      await this.specialityRepository.update(findItem.id, { name: name });
      return findItem;
    }
  }

  public async findById(id: any): Promise<Speciality | null> {
    const item = await this.specialityRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Speciality with id ${id} not found`);
    }
    return item;
  }

  public async delete(id: string): Promise<void> {
    const item = await this.specialityRepository.findOne({
      where: { id: +id },
    });
    if (!item) {
      throw new HttpException(
        TAG_NOT_FOUND_ERROR_MESSAGE,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.specialityRepository.delete(id);
  }

  public async update(
    id: string,
    dto: CreateSpecialityDto,
  ): Promise<Speciality> {
    const item = await this.specialityRepository.findOne({
      where: { id: +id },
    });
    if (!item) {
      throw new HttpException(
        TAG_NOT_FOUND_ERROR_MESSAGE,
        HttpStatus.NOT_FOUND,
      );
    }
    item.name = dto.name;

    await this.specialityRepository.save(item);
    return item;
  }

  public async onModuleInit(): Promise<void> {
    const findTags = await this.specialityRepository.find();
    if (!findTags.length) {
      for (const article of specialityInit) {
        const model = this.specialityRepository.create(article);
        await this.specialityRepository.save(model);
      }
    }
  }
}
