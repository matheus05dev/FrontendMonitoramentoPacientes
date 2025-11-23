import { Role } from '../enum/Role.enum';

export interface UsuarioAutenticado {
  username: string;
  role: Role | string;
  exp: number;
  iat: number;
}
