import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './user.model';
import { SpecialityModule } from '../speciality/speciality.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), SpecialityModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
