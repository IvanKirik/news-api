import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileElementResponse } from './dto/file-element.response';
import { MediaFile } from './media-file.class';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Create a file',
    type: [FileElementResponse],
  })
  @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    console.log(file);
    const saveArr: MediaFile[] = [new MediaFile(file)];
    if (file.mimetype.includes('image')) {
      const buffer = await this.filesService.convertToWebp(file.buffer);
      saveArr.push(
        new MediaFile({
          originalname: `${file.originalname.split('.')[0]}.webp`,
          buffer,
        }),
      );
    }
    return this.filesService.saveFiles(saveArr);
  }
}
