import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseItems } from '../../shared/interfaces/response-items.dto';
import { UserModel } from './user.model';
import { GetUsersDto } from './dto/get-users.dto';
import { ResponseUsersDto } from './dto/response-users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../../shared/decorators/user-emails.decorator';
import { EditUserDto } from './dto/edit-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    type: ResponseUsersDto,
    description: 'Get a users',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async getArticles(
    @UserEmail() email: string,
  ): Promise<Omit<UserModel, 'passwordHash' | 'refreshToken'>> {
    return await this.usersService.findByEmails(email);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user',
    type: String,
  })
  @ApiOkResponse({
    type: EditUserDto,
    description: 'Update user',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async updateUser(
    @UserEmail() email: string,
    @Param() id: { id: string },
    @Body() dto: EditUserDto,
  ): Promise<Omit<UserModel, 'passwordHash' | 'refreshToken'>> {
    return await this.usersService.updateUser(+id.id, dto as any);
  }
}
