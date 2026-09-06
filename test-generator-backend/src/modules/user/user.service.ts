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
      include: { role_id: true },
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
        role_id: {
          role_name: Role.ADMIN,
        },
      },
      include: { role_id: true },
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
      include: { role_id: true },
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
      include: { role_id: true },
    });

    if (!user || user.role_id?.role_name !== Role.ADMIN) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user as unknown as User;
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
