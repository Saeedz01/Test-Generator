import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { schoolClass } from './entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([schoolClass])],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [TypeOrmModule],
})
export class ClassModule {}
