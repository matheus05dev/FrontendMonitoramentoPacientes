import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { NotificacoesService } from '../../core/services/notificacoes.service';
import { AtendimentosService } from '../../core/services/atendimentos.service';
import { NotificacaoResponse } from '../../core/types/NotificacaoResponse';
import { AtendimentoResponse } from '../../core/types/AtendimentoResponse';
import { StatusNotificacao } from '../../core/enum/StatusNotificacao.enum';
import { TipoDado } from '../../core/enum/TipoDado.enum';
import { Gravidade } from '../../core/enum/Gravidade.enum';
import { Subscription } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

interface ActivityDisplay {
  type: string;
  name: string;
  action: string;
  time: string;
  icon: string;
  gravidade?: Gravidade;
  status?: StatusNotificacao;
}

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('transacoesChart', { static: false })
  transacoesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('leiturasCriticasChart', { static: false })
  leiturasCriticasChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('atendimentosChart', { static: false })
  atendimentosChartRef!: ElementRef<HTMLCanvasElement>;

  private notificacoesService = inject(NotificacoesService);
  private atendimentosService = inject(AtendimentosService);
  private notificacoesSubscription?: Subscription;

  activities: ActivityDisplay[] = [];
  notificacoesCriticas: ActivityDisplay[] = [];
  notificacoesAbertas: ActivityDisplay[] = [];
  notificacoesPendentes: ActivityDisplay[] = [];
  notificacoesFechadas: ActivityDisplay[] = [];
  atendimentos: AtendimentoResponse[] = [];

  totalNotificacoes = 0;
  totalAtendimentos = 0;

  isLoadingNotificacoes = false;
  isLoadingAtendimentos = false;
  // single-theme: assume dark theme is always active
  isDarkMode = true;

  private transacoesChart?: Chart;
  private leiturasCriticasChart?: Chart;
  private atendimentosChart?: Chart;

  ngOnInit(): void {
    // single-theme: do not auto-toggle based on system preference
    this.isDarkMode = true;

    // Carregar notificações via WebSocket
    this.carregarNotificacoes();
    // Carregar atendimentos
    this.carregarAtendimentos();
  }

  ngAfterViewInit(): void {
    // Aguardar um pouco para garantir que os canvas estejam renderizados
    setTimeout(() => {
      this.inicializarGraficos();
    }, 1000);
  }

  ngOnDestroy(): void {
    // Limpar subscription ao destruir o componente
    if (this.notificacoesSubscription) {
      this.notificacoesSubscription.unsubscribe();
    }

    // Destruir gráficos
    if (this.transacoesChart) {
      this.transacoesChart.destroy();
    }
    if (this.leiturasCriticasChart) {
      this.leiturasCriticasChart.destroy();
    }
    if (this.atendimentosChart) {
      this.atendimentosChart.destroy();
    }
  }

  carregarNotificacoes(): void {
    this.isLoadingNotificacoes = true;
    console.log('Iniciando carregamento de notificações...');

    // Aguardar um pouco para garantir que o WebSocket esteja conectado
    // O WebSocket já deve estar conectado após o login, mas aguardamos para garantir
    setTimeout(() => {
      console.log('Buscando histórico de notificações via WebSocket...');
      this.notificacoesSubscription = this.notificacoesService
        .buscarHistoricoNotificacoes()
        .subscribe({
          next: (notificacoes: NotificacaoResponse[]) => {
            console.log('Notificações recebidas no componente:', notificacoes);
            if (
              notificacoes &&
              Array.isArray(notificacoes) &&
              notificacoes.length > 0
            ) {
              console.log(
                `Transformando ${notificacoes.length} notificações em atividades...`
              );
              this.activities =
                this.transformarNotificacoesEmAtividades(notificacoes);
              this.notificacoesCriticas = this.filtrarNotificacoesCriticas(
                this.activities
              );
              this.separarNotificacoesPorStatus();
              this.totalNotificacoes = this.activities.length;
              console.log(`Atividades criadas: ${this.activities.length}`);
              console.log(
                `Notificações críticas: ${this.notificacoesCriticas.length}`
              );

              // Atualizar gráficos após carregar dados
              setTimeout(() => {
                this.atualizarGraficos(notificacoes);
              }, 500);
            } else {
              console.log('Nenhuma notificação recebida ou array vazio');
              this.activities = [];
              this.notificacoesCriticas = [];
              this.notificacoesAbertas = [];
              this.notificacoesPendentes = [];
              this.notificacoesFechadas = [];
              this.totalNotificacoes = 0;
            }
            this.isLoadingNotificacoes = false;
          },
          error: (error) => {
            console.error(
              'Erro ao carregar notificações via WebSocket:',
              error
            );
            console.warn(
              'Notificações não serão carregadas. Verifique se o WebSocket está configurado corretamente no backend.'
            );
            this.isLoadingNotificacoes = false;
            this.activities = [];
          },
        });
    }, 500); // Reduzido para 500ms, já que o WebSocket deve estar conectado após o login
  }

  transformarNotificacoesEmAtividades(
    notificacoes: NotificacaoResponse[]
  ): ActivityDisplay[] {
    return notificacoes
      .sort((a, b) => {
        // Ordenar por data de criação (mais recentes primeiro)
        const dataA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
        const dataB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
        return dataB - dataA;
      })
      .map((notificacao) => {
        const leitura = notificacao.leituraSensor;
        const tipoDado = leitura?.tipoDado || '';
        const valor = leitura?.valor || 0;
        const unidadeMedida = leitura?.unidadeMedida || '';
        const gravidade = leitura?.gravidade;
        const numeroQuarto = notificacao.numeroQuarto || 0;

        // Determinar ícone e tipo baseado no tipo de dado
        let icon = 'warning';
        let type = 'alert';

        if (tipoDado === TipoDado.TEMPERATURA) {
          icon = 'thermostat';
          type = 'temperature';
        } else if (tipoDado === TipoDado.FREQUENCIA_CARDIACA) {
          icon = 'favorite';
          type = 'heart';
        } else if (tipoDado === TipoDado.PRESSAO_ARTERIAL) {
          icon = 'monitor_heart';
          type = 'pressure';
        }

        // Criar descrição da ação
        let action = '';
        if (tipoDado && valor) {
          action = `${this.formatarTipoDado(
            tipoDado
          )}: ${valor} ${unidadeMedida}`;
          if (gravidade) {
            action += ` (${this.formatarGravidade(gravidade)})`;
          }
        } else {
          action = 'Leitura de sensor';
        }

        // Nome baseado no quarto
        const name =
          numeroQuarto > 0 ? `Quarto ${numeroQuarto}` : 'Monitoramento';

        // Formatar tempo
        const time = this.formatarTempo(notificacao.dataCriacao);

        return {
          type,
          name,
          action,
          time,
          icon,
          gravidade,
          status: notificacao.status,
        };
      });
  }

  formatarTipoDado(tipoDado: string): string {
    const map: { [key: string]: string } = {
      [TipoDado.TEMPERATURA]: 'Temperatura',
      [TipoDado.FREQUENCIA_CARDIACA]: 'Frequência Cardíaca',
      [TipoDado.PRESSAO_ARTERIAL]: 'Pressão Arterial',
    };
    return map[tipoDado] || tipoDado;
  }

  formatarGravidade(gravidade: Gravidade): string {
    const map: { [key: string]: string } = {
      [Gravidade.EMERGENCIAL]: 'Emergencial',
      [Gravidade.ALERTA]: 'Alerta',
      [Gravidade.NORMAL]: 'Normal',
    };
    return map[gravidade] || gravidade;
  }

  formatarTempo(data: string | undefined): string {
    if (!data) {
      return 'Data não disponível';
    }

    try {
      const dataNotificacao = new Date(data);
      const agora = new Date();
      const diferencaMs = agora.getTime() - dataNotificacao.getTime();
      const diferencaMinutos = Math.floor(diferencaMs / 60000);
      const diferencaHoras = Math.floor(diferencaMinutos / 60);
      const diferencaDias = Math.floor(diferencaHoras / 24);

      if (diferencaMinutos < 1) {
        return 'Agora';
      } else if (diferencaMinutos < 60) {
        return `${diferencaMinutos} minuto${
          diferencaMinutos > 1 ? 's' : ''
        } atrás`;
      } else if (diferencaHoras < 24) {
        return `${diferencaHoras} hora${diferencaHoras > 1 ? 's' : ''} atrás`;
      } else if (diferencaDias < 7) {
        return `${diferencaDias} dia${diferencaDias > 1 ? 's' : ''} atrás`;
      } else {
        // Formato de data completo para datas mais antigas
        return dataNotificacao.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch (error) {
      return 'Data inválida';
    }
  }

  getStatusClass(status: StatusNotificacao | undefined): string {
    if (!status) return '';

    const map: { [key: string]: string } = {
      [StatusNotificacao.ABERTA]: 'status-aberta',
      [StatusNotificacao.EM_ATENDIMENTO]: 'status-em-atendimento',
      [StatusNotificacao.PENDENTE]: 'status-pendente',
      [StatusNotificacao.FECHADA]: 'status-fechada',
    };
    return map[status] || '';
  }

  getGravidadeClass(gravidade: Gravidade | undefined): string {
    if (!gravidade) return '';

    const map: { [key: string]: string } = {
      [Gravidade.EMERGENCIAL]: 'gravidade-emergencial',
      [Gravidade.ALERTA]: 'gravidade-alerta',
      [Gravidade.NORMAL]: 'gravidade-normal',
    };
    return map[gravidade] || '';
  }

  formatarStatus(status: StatusNotificacao): string {
    const map: { [key: string]: string } = {
      [StatusNotificacao.ABERTA]: 'Aberta',
      [StatusNotificacao.EM_ATENDIMENTO]: 'Em Atendimento',
      [StatusNotificacao.PENDENTE]: 'Pendente',
      [StatusNotificacao.FECHADA]: 'Fechada',
    };
    return map[status] || status;
  }

  toggleTheme() {
    // dark mode removed: keep single dark theme; don't toggle body class
    this.isDarkMode = true;
  }

  filtrarNotificacoesCriticas(
    activities: ActivityDisplay[]
  ): ActivityDisplay[] {
    return activities.filter(
      (activity) =>
        activity.gravidade === Gravidade.EMERGENCIAL ||
        activity.gravidade === Gravidade.ALERTA
    );
  }

  carregarAtendimentos(): void {
    this.isLoadingAtendimentos = true;
    this.atendimentosService.listarTodos().subscribe({
      next: (atendimentos: AtendimentoResponse[]) => {
        this.atendimentos = atendimentos;
        this.totalAtendimentos = atendimentos.length;
        this.isLoadingAtendimentos = false;

        // Atualizar gráfico de atendimentos
        setTimeout(() => {
          this.criarGraficoAtendimentos(atendimentos);
        }, 500);
      },
      error: (error) => {
        console.error('Erro ao carregar atendimentos:', error);
        this.isLoadingAtendimentos = false;
        this.atendimentos = [];
        this.totalAtendimentos = 0;
      },
    });
  }

  separarNotificacoesPorStatus(): void {
    this.notificacoesAbertas = this.activities.filter(
      (a) => a.status === StatusNotificacao.ABERTA
    );
    this.notificacoesPendentes = this.activities.filter(
      (a) =>
        a.status === StatusNotificacao.EM_ATENDIMENTO ||
        a.status === StatusNotificacao.PENDENTE
    );
    this.notificacoesFechadas = this.activities.filter(
      (a) => a.status === StatusNotificacao.FECHADA
    );
  }

  inicializarGraficos(): void {
    if (
      this.transacoesChartRef?.nativeElement &&
      this.leiturasCriticasChartRef?.nativeElement
    ) {
      this.criarGraficoTransacoes();
      this.criarGraficoLeiturasCriticas();
    }
    if (this.atendimentosChartRef?.nativeElement) {
      this.criarGraficoAtendimentos();
    }
  }

  atualizarGraficos(notificacoes: NotificacaoResponse[]): void {
    if (
      this.transacoesChartRef?.nativeElement &&
      this.leiturasCriticasChartRef?.nativeElement
    ) {
      this.criarGraficoTransacoes(notificacoes);
      this.criarGraficoLeiturasCriticas(notificacoes);
    }
    if (
      this.atendimentosChartRef?.nativeElement &&
      this.atendimentos.length > 0
    ) {
      this.criarGraficoAtendimentos(this.atendimentos);
    }
  }

  criarGraficoTransacoes(notificacoes?: NotificacaoResponse[]): void {
    if (!this.transacoesChartRef?.nativeElement) return;

    // Destruir gráfico anterior se existir
    if (this.transacoesChart) {
      this.transacoesChart.destroy();
    }

    // Processar dados de notificações por quarto
    const dadosPorQuarto: { [key: number]: number } = {};

    if (notificacoes && notificacoes.length > 0) {
      notificacoes.forEach((notif) => {
        const quarto = notif.numeroQuarto || 0;
        if (quarto > 0) {
          dadosPorQuarto[quarto] = (dadosPorQuarto[quarto] || 0) + 1;
        }
      });
    }

    const quartos = Object.keys(dadosPorQuarto)
      .map(Number)
      .sort((a, b) => a - b);
    const contagens = quartos.map((quarto) => dadosPorQuarto[quarto]);

    const isDark = this.isDarkMode;
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const gridColor = isDark
      ? 'rgba(226, 232, 240, 0.1)'
      : 'rgba(30, 41, 59, 0.1)';

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels:
          quartos.length > 0
            ? quartos.map((q) => `Quarto ${q}`)
            : ['Sem dados'],
        datasets: [
          {
            label: 'Número de Notificações',
            data: contagens.length > 0 ? contagens : [0],
            backgroundColor: 'rgba(14, 165, 233, 0.6)',
            borderColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 2,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: textColor,
            },
          },
          tooltip: {
            backgroundColor: isDark
              ? 'rgba(30, 41, 59, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: 'rgba(14, 165, 233, 0.5)',
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor,
              stepSize: 1,
            },
            grid: {
              color: gridColor,
            },
          },
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
        },
      },
    };

    this.transacoesChart = new Chart(
      this.transacoesChartRef.nativeElement,
      config
    );
  }

  criarGraficoLeiturasCriticas(notificacoes?: NotificacaoResponse[]): void {
    if (!this.leiturasCriticasChartRef?.nativeElement) return;

    // Destruir gráfico anterior se existir
    if (this.leiturasCriticasChart) {
      this.leiturasCriticasChart.destroy();
    }

    // Processar dados de notificações críticas ao longo do tempo
    const notificacoesCriticas =
      notificacoes?.filter((n) => {
        const gravidade = n.leituraSensor?.gravidade;
        return (
          gravidade === Gravidade.EMERGENCIAL || gravidade === Gravidade.ALERTA
        );
      }) || [];

    // Agrupar por data (últimas 7 dias)
    const hoje = new Date();
    const ultimos7Dias: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      data.setHours(0, 0, 0, 0);
      ultimos7Dias.push(data);
    }

    const contagensPorDia: number[] = ultimos7Dias.map((data) => {
      return notificacoesCriticas.filter((n) => {
        if (!n.dataCriacao) return false;
        const dataNotif = new Date(n.dataCriacao);
        dataNotif.setHours(0, 0, 0, 0);
        return dataNotif.getTime() === data.getTime();
      }).length;
    });

    const labels = ultimos7Dias.map((data) => {
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    });

    const isDark = this.isDarkMode;
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const gridColor = isDark
      ? 'rgba(226, 232, 240, 0.1)'
      : 'rgba(30, 41, 59, 0.1)';

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Notificações Críticas',
            data: contagensPorDia,
            borderColor: 'rgba(14, 165, 233, 1)',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgba(14, 165, 233, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: textColor,
            },
          },
          tooltip: {
            backgroundColor: isDark
              ? 'rgba(30, 41, 59, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: 'rgba(14, 165, 233, 0.5)',
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor,
              stepSize: 1,
            },
            grid: {
              color: gridColor,
            },
          },
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
        },
      },
    };

    this.leiturasCriticasChart = new Chart(
      this.leiturasCriticasChartRef.nativeElement,
      config
    );
  }

  criarGraficoAtendimentos(atendimentos?: AtendimentoResponse[]): void {
    if (!this.atendimentosChartRef?.nativeElement) return;

    // Destruir gráfico anterior se existir
    if (this.atendimentosChart) {
      this.atendimentosChart.destroy();
    }

    // Processar dados de atendimentos abertos e fechados por dia
    const hoje = new Date();
    const ultimos7Dias: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      data.setHours(0, 0, 0, 0);
      ultimos7Dias.push(data);
    }

    // Contar atendimentos abertos por dia (data de entrada)
    const atendimentosAbertos: number[] = ultimos7Dias.map((data) => {
      return (atendimentos || this.atendimentos).filter((a) => {
        if (!a.dataEntrada) return false;
        const dataEntrada = new Date(a.dataEntrada);
        dataEntrada.setHours(0, 0, 0, 0);
        return dataEntrada.getTime() === data.getTime();
      }).length;
    });

    // Contar atendimentos fechados por dia (data de saída)
    const atendimentosFechados: number[] = ultimos7Dias.map((data) => {
      return (atendimentos || this.atendimentos).filter((a) => {
        if (!a.dataSaida) return false;
        const dataSaida = new Date(a.dataSaida);
        dataSaida.setHours(0, 0, 0, 0);
        return dataSaida.getTime() === data.getTime();
      }).length;
    });

    const labels = ultimos7Dias.map((data) => {
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    });

    const isDark = this.isDarkMode;
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const gridColor = isDark
      ? 'rgba(226, 232, 240, 0.1)'
      : 'rgba(30, 41, 59, 0.1)';

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Abertos',
            data: atendimentosAbertos,
            backgroundColor: 'rgba(14, 165, 233, 0.6)',
            borderColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 2,
            borderRadius: 4,
          },
          {
            label: 'Fechados',
            data: atendimentosFechados,
            backgroundColor: 'rgba(96, 165, 250, 0.6)',
            borderColor: 'rgba(96, 165, 250, 1)',
            borderWidth: 2,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: textColor,
            },
          },
          tooltip: {
            backgroundColor: isDark
              ? 'rgba(30, 41, 59, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: 'rgba(14, 165, 233, 0.5)',
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor,
              stepSize: 1,
            },
            grid: {
              color: gridColor,
            },
          },
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
        },
      },
    };

    this.atendimentosChart = new Chart(
      this.atendimentosChartRef.nativeElement,
      config
    );
  }
}
