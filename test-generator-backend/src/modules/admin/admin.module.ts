import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { schoolClass } from '../class/entities/class.entity';
import { BookModule } from '../book/book.module';

@Module({
  imports: [TypeOrmModule.forFeature([schoolClass]), BookModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
