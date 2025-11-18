import { Telefone } from './Telefone';
import { Sexo } from '../enum/Sexo.enum';
import { Cargo } from '../enum/Cargo.enum';

export interface FuncionarioSaudeRequestDTO {
  nome: string;
  email: string;
  sexo: Sexo;
  dataNascimento: string; // Format: 'YYYY-MM-DD'
  cpf: string;
  telefones: Telefone[];
  cargo: Cargo;
  especialidades: string[];
  identificacao: string;
}
