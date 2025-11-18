import { LocalizacaoQuarto } from '../enum/LocalizacaoQuarto.enum';
import { TipoQuarto } from '../enum/TipoQuarto.enum';

export interface QuartoResponse {
  id: number;
  numero: number;
  localizacao: LocalizacaoQuarto;
  tipo: TipoQuarto;
  capacidade: number;
  pacientesIds: number[];
}
