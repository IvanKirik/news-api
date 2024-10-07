import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Tag } from '../tags/tag.model';
import { GetTagDto } from '../tags/dto/get-tag.dto';
import { EmailsService } from './emails.service';
import { Email } from './email.model';
import { CreateEmailDto } from './dto/create-email.dto';

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
  public async create(@Body() dto: CreateEmailDto): Promise<Email> {
    return await this.emailsService.createEmail(dto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete email',
  })
  public async delete(@Param('id') id: string): Promise<void> {
    return await this.emailsService.deleteEmail(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: Tag,
    description: 'Update email',
  })
  public async update(
    @Param() id: string,
    @Body() dto: CreateEmailDto,
  ): Promise<Email> {
    return await this.emailsService.updateEmail(id, dto);
  }
}
