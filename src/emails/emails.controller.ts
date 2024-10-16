import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Tag } from '../tags/tag.model';
import { GetTagDto } from '../tags/dto/get-tag.dto';
import { EmailsService } from './emails.service';
import { Email } from './email.model';
import { CreateEmailDto } from './dto/create-email.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Emails')
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get()
  @ApiOkResponse({
    type: [Email],
    description: 'Get all emails',
  })
  public async getAll() {
    return await this.emailsService.getEmails();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the email to retrieve',
    type: String,
  })
  @ApiOkResponse({
    type: Email,
    description: 'Get email by id',
  })
  public async getById(@Param('id') id: GetTagDto) {
    return await this.emailsService.findEmail(id);
  }

  @Post('create')
  @ApiOkResponse({
    type: Email,
    description: 'Create email',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async create(@Body() dto: CreateEmailDto): Promise<Email> {
    return await this.emailsService.createEmail(dto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the email to retrieve',
    type: String,
  })
  @ApiOkResponse({
    description: 'Delete email',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async delete(@Param('id') id: string): Promise<void> {
    return await this.emailsService.deleteEmail(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the email to retrieve',
    type: String,
  })
  @ApiOkResponse({
    type: Tag,
    description: 'Update email',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async update(
    @Param() id: string,
    @Body() dto: CreateEmailDto,
  ): Promise<Email> {
    return await this.emailsService.updateEmail(id, dto);
  }
}
