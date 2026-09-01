import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';
import { User, Role } from './entities/user.entity';
import { UserRole } from './entities/user.role.entity';
import { CreateUserDto } from './dto/create-user.dto';

export interface AdminUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  isSuspended: boolean;
  createdAt?: Date;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async ensureRole(roleName: string): Promise<UserRole> {
    let role = await this.userRoleRepository.findOne({
      where: { role_name: roleName },
    });

    if (!role) {
      role = await this.userRoleRepository.save(
        this.userRoleRepository.create({ role_name: roleName }),
      );
    }

    return role;
  }

  async createWithRole(
    email: string,
    password: string,
    roleName: string,
    name?: string,
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    const userRole = await this.ensureRole(roleName);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name: name?.trim() || email.split('@')[0],
      email,
      password: hashedPassword,
      role_id: userRole,
      isSuspended: false,
    });

    return this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto) {
    return this.createWithRole(
      createUserDto.email,
      createUserDto.password,
      Role.ADMIN,
      createUserDto.name,
    );
  }

  async findAllAdmins(): Promise<AdminUserResponse[]> {
    const admins = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role_id', 'role')
      .where('role.role_name = :roleName', { roleName: Role.ADMIN })
      .orderBy('user.email', 'ASC')
      .getMany();

    return admins.map((user) => this.mapAdminResponse(user));
  }

  async createAdmin(email: string, password: string, name?: string) {
    const user = await this.createWithRole(email, password, Role.ADMIN, name);
    return this.mapAdminResponse(user);
  }

  async toggleSuspendAdmin(id: string) {
    const user = await this.findAdminById(id);
    user.isSuspended = !user.isSuspended;
    const savedUser = await this.userRepository.save(user);
    return this.mapAdminResponse(savedUser);
  }

  async removeAdmin(id: string) {
    const user = await this.findAdminById(id);
    await this.userRepository.delete(user.id);
    return { message: 'Admin deleted successfully' };
  }

  async remove(id: string) {
    const user = await this.userRepository.delete(id);
    if (user.affected === 0) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  private async findAdminById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role_id'],
    });

    if (!user || user.role_id?.role_name !== Role.ADMIN) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  private mapAdminResponse(user: User): AdminUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role_id?.role_name ?? Role.ADMIN,
      isSuspended: Boolean(user.isSuspended),
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: unknown) {
    return `This action updates a #${id} user`;
  }
}
