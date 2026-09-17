import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';
import { User, Role } from './entities/user.entity';
import { UserRole } from './entities/user.role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
    private readonly prisma: PrismaService,
  ) {}

  async ensureRole(roleName: string): Promise<UserRole> {
    let role = await this.prisma.userRole.findFirst({
      where: { role_name: roleName },
    });

    if (!role) {
      role = await this.prisma.userRole.create({
        data: { role_name: roleName },
      });
    }

    return role as unknown as UserRole;
  }

  async createWithRole(
    email: string,
    password: string,
    roleName: string,
    name?: string,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    const userRole = await this.ensureRole(roleName);
    const hashedPassword = await bcrypt.hash(password, 10);

    return (await this.prisma.user.create({
      data: {
        name: name?.trim() || email.split('@')[0],
        email,
        password: hashedPassword,
        roleId: userRole.id,
        isSuspended: false,
      },
      include: { role: true },
    })) as unknown as User;
  }

  /**
   * Replaces any other super_admin accounts and upserts this one.
   * Password is bcrypt-hashed before storage.
   */
  async upsertSuperAdmin(
    email: string,
    password: string,
    name?: string,
  ): Promise<User> {
    const userRole = await this.ensureRole(Role.SUPER_ADMIN);
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.deleteMany({
      where: {
        role: { role_name: Role.SUPER_ADMIN },
        NOT: { email },
      },
    });

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return (await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          name: name?.trim() || email.split('@')[0],
          password: hashedPassword,
          roleId: userRole.id,
          isSuspended: false,
          otp: null,
          otpExpiresAt: null,
          refreshTokenHash: null,
        },
        include: { role: true },
      })) as unknown as User;
    }

    return (await this.prisma.user.create({
      data: {
        name: name?.trim() || email.split('@')[0],
        email,
        password: hashedPassword,
        roleId: userRole.id,
        isSuspended: false,
      },
      include: { role: true },
    })) as unknown as User;
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
    const admins = await this.prisma.user.findMany({
      where: {
        role: {
          role_name: Role.ADMIN,
        },
      },
      include: { role: true },
      orderBy: { email: 'asc' },
    });

    return admins.map((user) => this.mapAdminResponse(user as unknown as User));
  }

  async createAdmin(email: string, password: string, name?: string) {
    const user = await this.createWithRole(email, password, Role.ADMIN, name);
    return this.mapAdminResponse(user);
  }

  async toggleSuspendAdmin(id: string) {
    const user = await this.findAdminById(id);
    const savedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { isSuspended: !user.isSuspended },
      include: { role: true },
    });
    return this.mapAdminResponse(savedUser as unknown as User);
  }

  async removeAdmin(id: string) {
    const user = await this.findAdminById(id);
    await this.prisma.user.delete({
      where: { id: user.id },
    });
    return { message: 'Admin deleted successfully' };
  }

  async remove(id: string) {
    const user = await this.prisma.user.deleteMany({
      where: { id },
    });
    if (user.count === 0) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return { raw: [], affected: user.count };
  }

  private async findAdminById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user || user.role?.role_name !== Role.ADMIN) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user as unknown as User;
  }

  private mapAdminResponse(user: User): AdminUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.role_name ?? Role.ADMIN,
      isSuspended: Boolean(user.isSuspended),
    };
  }

  async findAll(): Promise<AdminUserResponse[]> {
    const users = await this.prisma.user.findMany({
      include: { role: true },
      orderBy: { email: 'asc' },
    });
    return users.map((user) => this.mapAdminResponse(user as unknown as User));
  }

  async findOne(id: string): Promise<AdminUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return this.mapAdminResponse(user as unknown as User);
  }

  async update(id: string, updateUserDto: { name?: string; email?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const saved = await this.prisma.user.update({
      where: { id },
      data: {
        ...(updateUserDto.name !== undefined
          ? { name: updateUserDto.name }
          : {}),
        ...(updateUserDto.email !== undefined
          ? { email: updateUserDto.email }
          : {}),
      },
      include: { role: true },
    });
    return this.mapAdminResponse(saved as unknown as User);
  }
}
