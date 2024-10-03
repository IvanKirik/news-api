import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from './user.model';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { USER_NOT_FOUND, WRONG_PASSWORD_ERROR } from './auth.constants';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  public async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const user = this.userRepository.create({
      email: dto.email,
      passwordHash: await hash(dto.password, salt),
    });
    await this.userRepository.save(user);
  }

  public async findUser(email: string): Promise<UserModel> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = (await this.findUser(email)) as UserModel;
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }
    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  public async onModuleInit(): Promise<void> {
    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminExists) {
      const admin = this.userRepository.create({
        email: 'admin@example.com',
        passwordHash: await hash('password', 10),
      });

      await this.userRepository.save(admin);
    }
  }
}
