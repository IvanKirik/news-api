import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { Column } from 'typeorm';
import { Role } from '../user.model';

export class EditUserDto {
  @ApiProperty({
    required: true,
    maxLength: 100,
  })
  @MaxLength(100)
  @IsString()
  name: string;

  @ApiProperty({
    enum: Role,
    default: Role.USER,
  })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @ApiProperty({
    required: true,
    type: [Number],
    default: 'Array of specialties id',
  })
  speciality: number[];
}
