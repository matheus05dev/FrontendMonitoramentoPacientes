import { Telefone } from './Telefone';
import { Sexo } from '../enum/Sexo.enum';

export interface PacienteResponse {
  id: number;
  nome: string;
  email: string;
  sexo: Sexo;
  dataNascimento: string; // Format: 'YYYY-MM-DD'
  cpf: string;
  telefones: Telefone[];
  alergias: string[];
  quartoId: number;
}
