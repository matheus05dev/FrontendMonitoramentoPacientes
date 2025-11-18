import { CondicaoSaude } from '../enum/CondicaoSaude.enum';
import { Gravidade } from '../enum/Gravidade.enum';
import { TipoDado } from '../enum/TipoDado.enum';
import { UnidadeMedida } from '../enum/UnidadeMedida.enum';

export interface LeituraResponse {
  id?: number;
  atendimentoId?: number;
  valor?: number;
  dataHora?: string;
  tipoDado?: TipoDado;
  unidadeMedida?: UnidadeMedida;
  condicaoSaude?: CondicaoSaude;
  gravidade?: Gravidade;
}
