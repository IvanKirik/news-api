import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    required: true,
    maxLength: 255,
  })
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    maxLength: 100,
  })
  @MaxLength(100)
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    minLength: 6,
  })
  @MinLength(6)
  @IsString()
  password: string;

  @ApiProperty({
    required: true,
    type: [Number],
    default: 'Array of specialties id',
  })
  speciality: number[];
}
