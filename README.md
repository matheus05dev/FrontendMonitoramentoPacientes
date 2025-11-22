# InfraMed - Interface de Monitoramento de Pacientes

Interface web moderna e responsiva para o sistema de gestão hospitalar InfraMed. Desenvolvida para oferecer uma experiência de usuário intuitiva e eficiente, permitindo o monitoramento de pacientes e a administração de recursos hospitalares em tempo real.

<p align="center">
  <img src="https://img.shields.io/badge/Status-Concluído-brightgreen" alt="Status do Projeto: Concluído">
  <img src="https://img.shields.io/badge/Angular-20.3.10-red?logo=angular&logoColor=white" alt="Angular 20.3.10">
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript&logoColor=white" alt="TypeScript 5.8.3">
  <img src="https://img.shields.io/badge/Angular_Material-20.2.12-purple?logo=angular&logoColor=white" alt="Angular Material 20.2.12">
</p>

# 📋 Sumário

<!--ts-->

- [📖 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Principais Funcionalidades](#-principais-funcionalidades)
- [🛠️ Tecnologias e Justificativas](#-tecnologias-e-justificativas)
- [🏗️ Arquitetura e Estrutura](#-arquitetura-e-estrutura)
- [🚀 Como Executar](#-como-executar)
- [💡 Contexto do Projeto](#-contexto-do-projeto)
- [✍️ Autor](#-autor)
<!--te-->

## 📖 Sobre o Projeto

O frontend do **InfraMed** é a interface visual do sistema, construída como uma Single-Page Application (SPA) com Angular. Ele consome a API RESTful do backend para fornecer uma plataforma centralizada onde a equipe de saúde pode gerenciar pacientes, funcionários, quartos e atendimentos de forma ágil e segura.

A interface foi projetada com foco na usabilidade, garantindo que os profissionais de saúde possam acessar informações críticas rapidamente, otimizando o fluxo de trabalho e melhorando a qualidade do atendimento ao paciente.

## ✨ Principais Funcionalidades

- **Dashboard Intuitivo:** Visualização rápida do status dos quartos e alertas de monitoramento.
- **Gestão Completa:** Interfaces para operações CRUD (Criar, Ler, Atualizar, Excluir) de Pacientes, Funcionários, Quartos e Atendimentos.
- **Autenticação Segura:** Sistema de login com JWT para garantir que apenas usuários autorizados acessem o sistema.
- **Controle de Acesso por Perfil:** A interface se adapta dinamicamente, exibindo funcionalidades de acordo com o perfil do usuário logado (Médico, Enfermeiro, Admin).
- **Design Responsivo:** A aplicação se adapta a diferentes tamanhos de tela, permitindo o uso em desktops, tablets e dispositivos móveis.
- **Notificações em Tempo Real:** Alertas visuais para eventos críticos, como leituras anormais de sensores, via WebSockets.
- **Validação de Formulários:** Validação reativa e em tempo real para garantir a integridade dos dados inseridos.

## 🛠️ Tecnologias e Justificativas

A escolha das tecnologias foi orientada para criar uma interface de usuário moderna, performática e de fácil manutenção:

- **Angular 20.3.10:** Framework robusto e escalável para a construção de SPAs complexas. Sua arquitetura baseada em componentes, injeção de dependências e sistema de roteamento são ideais para um projeto deste porte.
- **TypeScript 5.8.3:** Adiciona tipagem estática ao JavaScript, aumentando a segurança do código, facilitando a refatoração e melhorando a produtividade do desenvolvimento.
- **Angular Material 20.2.12:** Biblioteca de componentes de UI que implementa o Material Design do Google, garantindo uma interface visualmente consistente, moderna e acessível.
- **RxJS:** Utilizado para gerenciar a comunicação assíncrona com a API e lidar com fluxos de dados de forma reativa e eficiente.
- **SCSS:** Pré-processador CSS que adiciona recursos como variáveis, aninhamento e mixins, tornando a estilização mais organizada e reutilizável.
- **Angular CLI 20.3.9:** Ferramenta de linha de comando essencial para a criação, gerenciamento, build e teste de projetos Angular.
- **WebSockets (StompJS & SockJS):** Para comunicação em tempo real com o backend, permitindo o recebimento de notificações instantâneas.

## 🏗️ Arquitetura e Estrutura

O projeto segue as melhores práticas da arquitetura Angular, com uma estrutura modular e organizada:

- **Arquitetura Baseada em Componentes:** A interface é dividida em componentes reutilizáveis, promovendo a coesão e o baixo acoplamento.
- **Serviços (Services):** A lógica de comunicação com a API backend é encapsulada em serviços injetáveis, separando as responsabilidades e facilitando a manutenção.
- **Roteamento (Routing):** O `AppRoutingModule` gerencia a navegação entre as diferentes páginas da aplicação, com suporte a rotas protegidas por guardas de autenticação.
- **Validação Reativa (Reactive Forms):** Os formulários são construídos utilizando o `FormBuilder` e `FormGroup` do Angular, permitindo validações complexas e dinâmicas.
- **Injeção de Dependências:** Utilizada extensivamente para fornecer instâncias de serviços, como `HttpClient` e serviços customizados, aos componentes.

## 🚀 Como Executar

**Pré-requisitos:**

- Node.js 20.19.0 ou superior
- Angular CLI 20.3.9
- **Backend InfraMed** em execução. Para o correto funcionamento da interface, é essencial que a API do backend esteja ativa. O repositório do backend pode ser encontrado aqui [neste repositório](https://github.com/matheus05dev/BackendMonitoramentoPacientes).

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/FrontendMonitoramentoPacientes
    cd FrontendMonitoramentoPacientes
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Execute o servidor de desenvolvimento:**

    ```bash
    ng serve
    ```

4.  **Acesse a aplicação:**
    Abra seu navegador e acesse `http://localhost:4200/`. A aplicação será recarregada automaticamente se você modificar os arquivos de origem.

## 💡 Contexto do Projeto

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) do curso Técnico de Desenvolvimento de Sistemas da Escola SENAI 403 "Antônio Ermírio de Moraes". O objetivo foi aplicar conceitos de arquiteturas modernas e engenharia de software na criação de uma solução relevante para o setor de saúde.

## ✍️ Autor

**Matheus Nunes da Silva**

- **GitHub:** [https://github.com/matheus05dev](https://github.com/matheus05dev)
