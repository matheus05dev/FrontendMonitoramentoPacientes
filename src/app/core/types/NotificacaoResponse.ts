import { StatusNotificacao } from '../enum/StatusNotificacao.enum';
import { LeituraResponse } from './LeituraResponse';

export interface NotificacaoResponse {
  id?: number;
  leituraSensor?: LeituraResponse;
  status?: StatusNotificacao;
  dataCriacao?: string;
  dataFechamento?: string;
  numeroQuarto?: number;
}

