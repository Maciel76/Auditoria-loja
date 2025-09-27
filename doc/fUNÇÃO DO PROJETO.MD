Backend
config/: Configurações gerais do backend (banco de dados, middlewares, serviços externos).

controllers/: Lógica de negócio, recebe requisições, processa e retorna respostas.

middleware/: Interceptadores de requisições para autenticação, autorização, validações.

models/: Definição dos esquemas de dados do MongoDB.

routes/: Definição das rotas da API e associação aos controllers.

services/: Lógica mais complexa, processamento de dados, regras de negócio.

utils/: Funções auxiliares, parsers, validadores, constantes.

app.js: Configuração do Express (middlewares globais, rotas).

server.js: Ponto de entrada do servidor.

Frontend
components/: Componentes Vue reutilizáveis, organizados por funcionalidade.

views/: Páginas completas que são renderizadas pelas rotas.

stores/: Gerenciamento de estado global com Pinia.

router/: Definição das rotas frontend e guards de navegação.

services/: Comunicação com a API backend (axios).

assets/: Recursos estáticos (CSS, imagens, JS).

composables/: Funções composables do Vue 3 para lógica reutilizável.

App.vue: Componente raiz da aplicação.

main.js: Ponto de entrada do Vue.

Outros
docs/: Documentação do projeto.

scripts/: Scripts auxiliares para deploy, backup, migração.

docker-compose.yml: Configuração para orquestrar containers (ex: MongoDB).

Dockerfile: Instruções para construir a imagem Docker da aplicação.

Explicação dos Módulos Principais
Autenticação (auth): Controla login, logout, perfil e permissões.

Auditorias (audits): Upload, processamento e listagem de auditorias.

Lojas (stores): Gerenciamento das lojas (CRUD) e suas configurações.

Relatórios (reports): Geração de relatórios e estatísticas.

Dashboard: Fornece dados resumidos para o painel inicial.

Hierarquia de Usuários
Auditor: Faz upload e vê apenas seus dados e da sua loja.

Supervisor: Vê dados da equipe e relatórios da loja.

Manager: Vê múltiplas lojas e comparativos.

Admin: Acesso total ao sistema.

Fluxo de Dados
O frontend se comunica com o backend via API REST.

O estado global (Pinia) armazena dados do usuário, lojas, etc.

O backend processa os dados e armazena no MongoDB.

Essa estrutura permite que o sistema seja escalável, mantenha o código organizado e facilite a adição de novas funcionalidades.

Explicação Detalhada de Cada Componente do Sistema
🏗️ Backend - Estrutura e Funcionalidades
📁 config/
database.js: Configura conexão com MongoDB, gerencia pools de conexão e trata erros

cloudinary.js: Configura upload de imagens para avatares de usuários e fotos de lojas

middleware.js: Configuração centralizada de todos os middlewares do Express

📁 controllers/
authController.js:

Login/logout de usuários

Geração de tokens JWT

Recuperação de senha

Atualização de perfil

auditController.js:

Upload e processamento de planilhas

Validação de dados de auditoria

Cálculo de métricas e estatísticas

Gestão de histórico de auditorias

storeController.js:

CRUD de lojas

Atribuição de usuários às lojas

Configurações específicas por loja

reportController.js:

Geração de relatórios personalizados

Exportação de dados (Excel, PDF)

Análises comparativas entre lojas

dashboardController.js:

Fornecimento de dados para os dashboards

Métricas em tempo real

Alertas e notificações

📁 middleware/
auth.js: Verifica tokens JWT e autentica usuários

role.js: Controla acesso baseado em hierarquia (auditor, supervisor, manager, admin)

store.js: Garante que usuário só acesse dados de sua loja

upload.js: Processa uploads de arquivos e valida formatos

📁 models/
Store.js: Define estrutura de lojas (código, nome, cidade, configurações)

User.js: Gerencia usuários, suas permissões e estatísticas

Audit.js: Armazena todos os dados de auditoria com relacionamentos

FileProcess.js: Controla o processamento de arquivos uploadados

📁 routes/
auth.js: Rotas de autenticação (/login, /register, /logout)

audits.js: Rotas de auditoria (/audits/upload, /audits/list)

stores.js: Rotas de gestão de lojas (/stores, /stores/:id)

reports.js: Rotas de relatórios (/reports, /reports/export)

dashboard.js: Rotas do dashboard (/dashboard/stats, /dashboard/alerts)

📁 services/
auditService.js: Lógica complexa de processamento de planilhas Excel

reportService.js: Geração de relatórios com dados agregados

emailService.js: Envio de notificações e relatórios por email

storageService.js: Gerenciamento de arquivos no cloud storage

📁 utils/
excelParser.js: Processa planilhas Excel e extrai dados estruturados

helpers.js: Funções utilitárias (formatação de datas, cálculos)

validators.js: Validação de dados de entrada

constants.js: Constantes do sistema (roles, status, tipos de auditoria)

🖥️ Frontend - Estrutura e Funcionalidades
📁 components/common/
AppHeader.vue: Cabeçalho com navegação e informações do usuário

AppSidebar.vue: Menu lateral com navegação baseada nas permissões

AppFooter.vue: Rodapé com informações do sistema

LoadingSpinner.vue: Indicador de carregamento

NotificationToast.vue: Sistema de notificações toast

📁 components/auth/
LoginForm.vue: Formulário de login com validação

RegisterForm.vue: Formulário de registro (apenas para admins)

📁 components/audits/
UploadForm.vue: Interface de upload de planilhas com drag-and-drop

AuditList.vue: Listagem de auditorias com filtros e paginação

AuditCard.vue: Cartão individual de auditoria com resumo

📁 components/dashboard/
StatsCard.vue: Cartões de estatísticas (números, percentuais)

ProgressChart.vue: Gráficos de progresso e eficiência

RecentActivity.vue: Lista de atividades recentes

📁 components/reports/
ReportFilters.vue: Filtros avançados para relatórios

ReportTable.vue: Tabela de dados com ordenação e paginação

ReportChart.vue: Visualização gráfica dos relatórios

📁 components/admin/
UserManager.vue: CRUD de usuários e gestão de permissões

StoreManager.vue: Gestão de lojas e suas configurações

AuditManager.vue: Visualização administrativa de todas as auditorias

📁 views/
LoginView.vue: Página de login completa

DashboardView.vue: Dashboard principal com resumo e métricas

AuditsView.vue: Página de gestão de auditorias

ReportsView.vue: Página de relatórios e análises

ProfileView.vue: Página de perfil do usuário

Admin/: Conjunto de páginas para administração do sistema

📁 stores/
auth.js: Gerencia estado de autenticação e dados do usuário

audit.js: Controla estado das auditorias e uploads

user.js: Gerencia dados de usuários (para admin)

store.js: Gerencia dados das lojas

report.js: Controla estado de relatórios e filtros

📁 services/
api.js: Configuração base do axios e interceptors

authService.js: Chamadas API para autenticação

auditService.js: Serviços de upload e gestão de auditorias

storeService.js: Serviços de gestão de lojas

reportService.js: Serviços de geração de relatórios

📁 composables/
useAuth.js: Lógica reutilizável para autenticação

useAudit.js: Lógica reutilizável para auditorias

useApi.js: Lógica reutilizável para chamadas API

🔐 Sistema de Hierarquia e Permissões
👤 Auditor (Funcionário de Loja)
Upload de planilhas de auditoria

Visualização do próprio desempenho

Acesso apenas aos dados da sua loja

Visualização do ranking pessoal

👨‍💼 Supervisor (Coordenador de Loja)
Todas as permissões do Auditor

Visualização do desempenho da equipe

Relatórios da loja

Comparativos de performance

👔 Manager (Gerente Regional)
Todas as permissões do Supervisor

Acesso a múltiplas lojas

Comparativos entre lojas

Relatórios regionais

🛡️ Admin (Administrador do Sistema)
Acesso completo ao sistema

CRUD de usuários e lojas

Configurações do sistema

Visualização de todas as auditorias

Relatórios globais

🔄 Fluxos Principais do Sistema
📤 Upload de Auditoria
Usuário seleciona loja e tipo de auditoria

Faz upload da planilha Excel

Sistema processa e valida os dados

Dados são salvos no banco com relacionamentos corretos

Estatísticas são atualizadas em tempo real

Usuário recebe confirmação e resumo

📊 Geração de Relatórios
Usuário aplica filtros (data, loja, tipo)

Sistema consulta dados agregados

Dados são processados e formatados

Relatório é exibido em tabela e gráficos

Opção de exportar para Excel/PDF

📈 Dashboard em Tempo Real
Sistema coleta métricas das últimas auditorias

Calcula eficiência, progresso e comparativos

Exibe cards com informações resumidas

Atualiza automaticamente com novos dados

👥 Gestão de Usuários (Admin)
Admin cria/edita usuários

Define loja e nível de permissão

Usuário recebe email com credenciais

Sistema registra todas as ações administrativas

🛠️ Funcionalidades Técnicas Avançadas
🔄 Processamento em Background
Uploads não travam a interface

Processamento pesado é feito assincronamente

Usuário pode continuar usando o sistema

📱 Design Responsivo
Interface adaptada para desktop, tablet e mobile

Experiência consistente em todos os dispositivos

🔒 Segurança
Autenticação JWT

Validação de dados em todas as camadas

Sanitização de inputs

Controle de acesso por role e loja

📦 Gestão de Estado
Estado global gerenciado com Pinia

Dados em cache para performance

Atualizações em tempo real

🔔 Sistema de Notificações
Alertas de conclusão de processamento

Notificações de atividades importantes

Sistema de mensagens toast

Esta estrutura garante que o sistema seja robusto, escalável e mantenha a organização mesmo com o crescimento do projeto. Cada componente tem uma responsabilidade clara, facilitando a manutenção e adição de novas funcionalidades.
