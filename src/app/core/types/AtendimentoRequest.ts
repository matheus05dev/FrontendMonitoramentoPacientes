import { Diagnostico } from '../enum/Diagnostico.enum';
import { StatusMonitoramento } from '../enum/StatusMonitoramento.enum';
import { StatusPaciente } from '../enum/StatusPaciente.enum';

export interface AtendimentoRequest {
  pacienteId?: number;
  medicoResponsavelId?: number;
  medicoComplicacaoId?: number;
  statusPaciente?: StatusPaciente;
  acompanhante?: string;
  condicoesPreexistentes?: string;
  diagnostico?: Diagnostico;
  tratamento?: string;
  dataEntrada?: string;
  dataSaida?: string;
  observacoes?: string;
  diagnosticoComplicacao?: Diagnostico;
  tratamentoComplicacao?: string;
  statusMonitoramento?: StatusMonitoramento;
}
