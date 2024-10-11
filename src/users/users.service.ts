import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './user.model';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import {
  ResponseItems,
  ResponseItemsDto,
} from '../shared/interfaces/response-items.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  public async findAll(dto: GetUsersDto): Promise<ResponseItems<UserModel>> {
    const { search, page, limit, sortField, sortOrder } = dto;

    const qb = this.userRepository.createQueryBuilder('users');

    qb.select([
      'users.id',
      'users.email',
      'users.createdAt',
      'users.updatedAt',
    ]);

    if (search) {
      qb.andWhere('users.name ILIKE :search', { search: `%${search}%` });
    }

    qb.distinct(true);

    const currentPage = parseInt(String(page), 10) || 1;
    const pageSize = parseInt(String(limit), 10) || 10;
    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    if (sortField) {
      qb.orderBy(`users.${sortField}`, sortOrder || 'ASC');
    } else {
      qb.orderBy('users.createdAt', 'DESC');
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

  public async findByEmails(
    email: string,
  ): Promise<Omit<UserModel, 'passwordHash' | 'refreshToken'>> {
    const {
      id,
      email: emailUser,
      createdAt,
      updatedAt,
    } = await this.userRepository.findOne({
      where: { email },
    });
    return { id, email: emailUser, createdAt, updatedAt };
  }

  public async createUser(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);
    await this.userRepository.save(user);
  }

  public async findUser(email: string): Promise<UserModel> {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async updateUser(id: number, user: Partial<UserModel>) {
    await this.userRepository.update(id, user);
  }
}
