import { User } from './user.entity';

export class UserRole {
  id: string;

  role_name: string;

  users: User[];
}
