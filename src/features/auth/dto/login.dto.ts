import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    maxLength: 255,
  })
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    minLength: 6,
  })
  @MinLength(6)
  @IsString()
  password: string;
}
