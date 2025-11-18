import { Role } from '../enum/Role.enum';

export interface UserRequest {
  username: string;
  password: string;
  role: Role;
}
