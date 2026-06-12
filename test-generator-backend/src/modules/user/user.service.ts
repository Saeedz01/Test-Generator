import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.role.entity';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  // common functions
  private getUserRole(email: string): string {
    if (email === 'admin@gmail.com') {
      return 'admin';
    } else if (email === 'super_admin@gmail.com') {
      return 'super_admin';
    } else {
      throw new NotFoundException(ERROR_MESSAGES.USER_ROLE_NOT_FOUND);
    }
  }


  // user service methods
  async create(createUserDto: CreateUserDto) {

    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }
    const userRole = await this.userRoleRepository.findOne({
      where: { role_name: this.getUserRole(createUserDto.email) },
    });
    if (!userRole) {
      throw new NotFoundException(ERROR_MESSAGES.USER_ROLE_NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role_id: userRole,
    });
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.delete(id);
    if (user.affected === 0) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
