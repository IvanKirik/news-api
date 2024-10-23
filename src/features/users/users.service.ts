import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './user.model';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import {
  ResponseItems,
  ResponseItemsDto,
} from '../../shared/interfaces/response-items.dto';
import { SpecialityService } from '../speciality/speciality.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    private readonly specialityService: SpecialityService,
  ) {}

  public async findAll(dto: GetUsersDto): Promise<ResponseItems<UserModel>> {
    const { search, page, limit, sortField, sortOrder } = dto;

    const qb = this.userRepository.createQueryBuilder('users');

    qb.leftJoinAndSelect('users.speciality', 'speciality');

    qb.select([
      'users.id',
      'users.name',
      'users.email',
      'users.role',
      'users.createdAt',
      'users.updatedAt',
      'speciality.id',
      'speciality.name',
    ]);

    if (search) {
      qb.andWhere('users.name ILIKE :search', { search: `%${search}%` });
    }

    qb.distinct(true);

    const currentPage = parseInt(String(page), 10) || 1;
    const pageSize = parseInt(String(limit), 10) || 10;
    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    if (sortField) {
      if (sortField === 'speciality') {
        qb.orderBy('speciality.name', sortOrder || 'ASC');
      } else {
        qb.orderBy(`users.${sortField}`, sortOrder || 'ASC');
      }
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
      name,
      role,
      createdAt,
      updatedAt,
      speciality,
    } = await this.userRepository.findOne({
      where: { email },
    });
    return {
      id,
      email: emailUser,
      name,
      role,
      speciality,
      createdAt,
      updatedAt,
    };
  }

  public async createUser(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);
    await this.userRepository.save(user);
  }

  public async findUser(email: string): Promise<UserModel> {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async updateUser(id: number, user: Partial<UserModel>) {
    const existingUser = await this.userRepository.findOne({
      where: { id },
      relations: ['speciality'],
    });

    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    await this.userRepository.save({
      ...existingUser,
      ...user,
    });

    if (user.speciality) {
      const specialities = await this.specialityService.findByIds(
        user.speciality as any,
      );

      existingUser.speciality = specialities;
      await this.userRepository.save(existingUser);
    }

    return this.userRepository.findOne({
      where: { id },
      relations: ['speciality'],
    });
  }
}
