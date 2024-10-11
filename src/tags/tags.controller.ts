import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { Tag } from './tag.model';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagDto } from './dto/get-tag.dto';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOkResponse({
    type: [Tag],
    description: 'Get all tags',
  })
  public async getTags() {
    return await this.tagsService.getTags();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the tag to retrieve',
    type: String,
  })
  @ApiOkResponse({
    type: Tag,
    description: 'Get tag by id',
  })
  public async getTag(@Param('id') id: GetTagDto) {
    return await this.tagsService.findTag(id);
  }

  @Post('create')
  @ApiOkResponse({
    type: Tag,
    description: 'Create tag',
  })
  public async createTag(@Body() dto: CreateTagDto): Promise<Tag> {
    return await this.tagsService.createTag(dto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the tag to retrieve',
    type: String,
  })
  @ApiOkResponse({
    description: 'Delete tag',
  })
  public async deleteTag(@Param('id') id: string): Promise<void> {
    return await this.tagsService.deleteTag(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the tag to retrieve',
    type: String,
  })
  @ApiOkResponse({
    type: Tag,
    description: 'Update tag',
  })
  public async updateTag(
    @Param() id: string,
    @Body() dto: CreateTagDto,
  ): Promise<Tag> {
    return await this.tagsService.updateTag(id, dto);
  }
}
