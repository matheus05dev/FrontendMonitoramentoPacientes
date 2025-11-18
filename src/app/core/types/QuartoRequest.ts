import { LocalizacaoQuarto } from '../enum/LocalizacaoQuarto.enum';
import { TipoQuarto } from '../enum/TipoQuarto.enum';

export interface QuartoRequest {
  numero: number;
  localizacao: LocalizacaoQuarto;
  tipo: TipoQuarto;
  capacidade: number;
}
