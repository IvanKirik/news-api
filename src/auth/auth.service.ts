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
import {
  INVALID_REFRESH_TOKEN,
  USER_NOT_FOUND,
  WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { ConfigService } from '@nestjs/config';
import { TokensResponseDto } from './dto/tokens-response.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  async validateUser(email: string, password: string): Promise<UserModel> {
    const user = (await this.findUser(email)) as UserModel;
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }
    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return user;
  }

  async login(user: UserModel): Promise<TokensResponseDto> {
    const { accessToken, refreshToken } = await this.generateTokens(user);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
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

  public async refresh(refreshToken: string): Promise<TokensResponseDto> {
    try {
      const payload = await this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.findUser(payload.email);
      if (
        !user ||
        !user.refreshToken ||
        !(await compare(refreshToken, user.refreshToken))
      ) {
        throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
      }

      // Генерация новых токенов
      const { accessToken, refreshToken: refresh } =
        await this.generateTokens(user);
      return {
        access_token: accessToken,
        refresh_token: refresh,
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }
  }

  private async generateTokens(user: UserModel) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const hashedRefreshToken = await hash(refreshToken, 10);

    await this.userRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return { accessToken, refreshToken };
  }
}
