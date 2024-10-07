import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { RefreshDto } from './dto/refresh.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  public async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.email);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    await this.authService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @ApiOkResponse({
    type: TokensResponseDto,
    description: 'Authenticated token successfully.',
  })
  @HttpCode(200)
  @Post('login')
  public async login(@Body() dto: AuthDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @UsePipes(new ValidationPipe())
  @ApiOkResponse({
    type: TokensResponseDto,
    description: 'Authenticated token successfully.',
  })
  @Post('refresh')
  public async refresh(@Body() { refreshToken }: RefreshDto) {
    return await this.authService.refresh(refreshToken);
  }
}
