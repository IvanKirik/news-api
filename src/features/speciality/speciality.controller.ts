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
import { Speciality } from './speciality.model';
import { SpecialityService } from './speciality.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { Tag } from '../tags/tag.model';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Speciality')
@Controller('speciality')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Get()
  @ApiOkResponse({
    type: [Speciality],
    description: 'Get all speciality',
  })
  public async findAll(): Promise<Speciality[]> {
    return await this.specialityService.findAll();
  }

  @Post('create')
  @ApiOkResponse({
    type: Tag,
    description: 'Create speciality',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async create(@Body() dto: CreateSpecialityDto): Promise<Speciality> {
    return await this.specialityService.create(dto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the speciality to retrieve',
    type: String,
  })
  @ApiOkResponse({
    description: 'Delete speciality',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async delete(@Param('id') id: string): Promise<void> {
    return await this.specialityService.delete(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the speciality to retrieve',
    type: String,
  })
  @ApiOkResponse({
    type: Tag,
    description: 'Update speciality',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async updateTag(
    @Param() id: string,
    @Body() dto: CreateSpecialityDto,
  ): Promise<Speciality> {
    return await this.specialityService.update(id, dto);
  }
}
