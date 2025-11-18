import { Diagnostico } from '../enum/Diagnostico.enum';
import { StatusMonitoramento } from '../enum/StatusMonitoramento.enum';
import { StatusPaciente } from '../enum/StatusPaciente.enum';
import { LeituraResponse } from './LeituraResponse';

export interface AtendimentoResponse {
  id?: number;
  pacienteId?: number;
  medicoResponsavelId?: number;
  medicoComplicacaoId?: number;
  statusPaciente?: StatusPaciente;
  statusMonitoramento?: StatusMonitoramento;
  acompanhante?: string;
  condicoesPreexistentes?: string;
  diagnostico?: Diagnostico;
  tratamento?: string;
  numeroQuarto?: number;
  dataEntrada?: string;
  dataSaida?: string;
  observacoes?: string;
  diagnosticoComplicacao?: Diagnostico;
  tratamentoComplicacao?: string;
  nomePaciente?: string;
  nomeMedicoResponsavel?: string;
  nomeMedicoComplicacao?: string;
  leituras?: LeituraResponse[];
}
