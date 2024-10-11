import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseItems } from '../shared/interfaces/response-items.dto';
import { UserModel } from './user.model';
import { GetUsersDto } from './dto/get-users.dto';
import { ResponseUsersDto } from './dto/response-users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../shared/decorators/user-emails.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    type: ResponseUsersDto,
    description: 'Get a users',
  })
  @UseGuards(JwtAuthGuard)
  public async getUsers(
    @Query() params: GetUsersDto,
  ): Promise<ResponseItems<UserModel>> {
    return await this.usersService.findAll(params);
  }

  @Get('me')
  @ApiOkResponse({
    type: UserModel,
    description: 'Get current user',
  })
  @UseGuards(JwtAuthGuard)
  public async getArticles(
    @UserEmail() email: string,
  ): Promise<Omit<UserModel, 'passwordHash' | 'refreshToken'>> {
    return await this.usersService.findByEmails(email);
  }
}
