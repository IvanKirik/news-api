import { Module } from '@nestjs/common';
import { SpecialityController } from './speciality.controller';
import { SpecialityService } from './speciality.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Speciality } from './speciality.model';

@Module({
  imports: [TypeOrmModule.forFeature([Speciality])],
  controllers: [SpecialityController],
  providers: [SpecialityService],
  exports: [SpecialityService],
})
export class SpecialityModule {}
