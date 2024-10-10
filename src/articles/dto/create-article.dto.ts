import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateTagDto } from '../../tags/dto/create-tag.dto';
import { CreateEmailDto } from '../../emails/dto/create-email.dto';

export class CreateArticleDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty({ required: false })
  image: string;

  @ApiProperty({ required: false, type: [CreateTagDto] })
  tags: CreateTagDto[];

  @ApiProperty({ required: false, type: [CreateEmailDto] })
  emails: CreateEmailDto[];

  @IsString()
  @ApiProperty()
  emailIsAuthor: string;

  @IsString()
  @ApiProperty()
  nameIsAuthor: string;
}
