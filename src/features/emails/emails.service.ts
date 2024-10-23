import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from './email.model';
import { EMAIL_NOT_FOUND_ERROR_MESSAGE } from './emails.constatnts';
import { CreateEmailDto } from './dto/create-email.dto';
import { emailsInit } from './emails.init';

@Injectable()
export class EmailsService implements OnModuleInit {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
  ) {}

  public async getEmails(): Promise<Email[]> {
    return await this.emailRepository.find();
  }

  public async createEmail({ email }: { email: string }): Promise<Email> {
    const findEmail = await this.emailRepository.findOne({
      where: { email: email },
    });
    if (!findEmail) {
      const tag = this.emailRepository.create({ email });
      await this.emailRepository.save(tag);
      return tag;
    } else {
      await this.emailRepository.update(findEmail.id, { email: email });
      return findEmail;
    }
  }

  public async findEmail(id: any): Promise<Email | null> {
    const email = await this.emailRepository.findOne({ where: { id } });
    if (!email) {
      throw new NotFoundException(`Email with id ${id} not found`);
    }
    return email;
  }

  public async deleteEmail(id: string): Promise<void> {
    const tag = await this.emailRepository.findOne({ where: { id: +id } });
    if (!tag) {
      throw new HttpException(
        EMAIL_NOT_FOUND_ERROR_MESSAGE,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.emailRepository.delete(id);
  }

  public async updateEmail(id: string, dto: CreateEmailDto): Promise<Email> {
    const model = await this.emailRepository.findOne({
      where: { id: +id },
    });
    if (!model) {
      throw new HttpException(
        EMAIL_NOT_FOUND_ERROR_MESSAGE,
        HttpStatus.NOT_FOUND,
      );
    }
    model.email = dto.email;

    await this.emailRepository.save(model);
    return model;
  }

  public async onModuleInit(): Promise<void> {
    const findTags = await this.emailRepository.find();
    if (!findTags.length) {
      for (const email of emailsInit) {
        const model = this.emailRepository.create(email);
        await this.emailRepository.save(model);
      }
    }
  }
}
