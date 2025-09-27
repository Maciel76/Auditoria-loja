🌳 Visão Geral da Estrutura do Projeto
text
sistema-auditorias/
├── 📁 backend/ # Servidor Node.js/Express
│ ├── 📁 src/
│ │ ├── 📁 config/ # Configurações do sistema
│ │ │ ├── database.js # Configuração do MongoDB
│ │ │ ├── cloudinary.js # Configuração upload de imagens
│ │ │ └── middleware.js # Configuração de middlewares
│ │ ├── 📁 controllers/ # Lógica de negócio
│ │ │ ├── authController.js # Autenticação e usuários
│ │ │ ├── auditController.js # Processamento de auditorias
│ │ │ ├── storeController.js # Gestão de lojas
│ │ │ ├── reportController.js # Relatórios e estatísticas
│ │ │ └── dashboardController.js # Dados para dashboard
│ │ ├── 📁 middleware/ # Middlewares personalizados
│ │ │ ├── auth.js # Autenticação JWT
│ │ │ ├── role.js # Controle de hierarquia
│ │ │ ├── store.js # Validação de acesso à loja
│ │ │ └── upload.js # Processamento de uploads
│ │ ├── 📁 models/ # Modelos de dados MongoDB
│ │ │ ├── Store.js # Lojas/franquias
│ │ │ ├── User.js # Usuários do sistema
│ │ │ ├── Audit.js # Registros de auditoria
│ │ │ └── FileProcess.js # Controle de processamento
│ │ ├── 📁 routes/ # Definição de rotas da API
│ │ │ ├── auth.js # Rotas de autenticação
│ │ │ ├── audits.js # Rotas de auditorias
│ │ │ ├── stores.js # Rotas de gestão de lojas
│ │ │ ├── reports.js # Rotas de relatórios
│ │ │ └── dashboard.js # Rotas do dashboard
│ │ ├── 📁 services/ # Serviços e lógica complexa
│ │ │ ├── auditService.js # Processamento de auditorias
│ │ │ ├── reportService.js # Geração de relatórios
│ │ │ ├── emailService.js # Serviço de e-mails
│ │ │ └── storageService.js # Gerenciamento de arquivos
│ │ ├── 📁 utils/ # Utilitários e helpers
│ │ │ ├── excelParser.js # Processamento de Excel
│ │ │ ├── helpers.js # Funções auxiliares
│ │ │ ├── validators.js # Validações de dados
│ │ │ └── constants.js # Constantes do sistema
│ │ ├── 📁 uploads/ # Arquivos temporários
│ │ ├── app.js # Configuração principal do Express
│ │ └── server.js # Ponto de entrada do servidor
│ ├── 📁 tests/ # Testes automatizados
│ │ ├── unit/ # Testes unitários
│ │ └── integration/ # Testes de integração
│ ├── package.json
│ ├── .env # Variáveis de ambiente
│ └── .gitignore
│
├── 📁 frontend/ # Aplicação Vue.js
│ ├── 📁 src/
│ │ ├── 📁 components/ # Componentes reutilizáveis
│ │ │ ├── 📁 common/ # Componentes comuns
│ │ │ │ ├── AppHeader.vue
│ │ │ │ ├── AppSidebar.vue
│ │ │ │ ├── AppFooter.vue
│ │ │ │ ├── LoadingSpinner.vue
│ │ │ │ └── NotificationToast.vue
│ │ │ ├── 📁 auth/ # Componentes de autenticação
│ │ │ │ ├── LoginForm.vue
│ │ │ │ └── RegisterForm.vue
│ │ │ ├── 📁 audits/ # Componentes de auditoria
│ │ │ │ ├── UploadForm.vue
│ │ │ │ ├── AuditList.vue
│ │ │ │ └── AuditCard.vue
│ │ │ ├── 📁 dashboard/ # Componentes do dashboard
│ │ │ │ ├── StatsCard.vue
│ │ │ │ ├── ProgressChart.vue
│ │ │ │ └── RecentActivity.vue
│ │ │ ├── 📁 reports/ # Componentes de relatórios
│ │ │ │ ├── ReportFilters.vue
│ │ │ │ ├── ReportTable.vue
│ │ │ │ └── ReportChart.vue
│ │ │ └── 📁 admin/ # Componentes administrativos
│ │ │ ├── UserManager.vue
│ │ │ ├── StoreManager.vue
│ │ │ └── AuditManager.vue
│ │ ├── 📁 views/ # Páginas/rotas da aplicação
│ │ │ ├── LoginView.vue # Página de login
│ │ │ ├── DashboardView.vue # Dashboard principal
│ │ │ ├── AuditsView.vue # Gestão de auditorias
│ │ │ ├── ReportsView.vue # Relatórios e análises
│ │ │ ├── ProfileView.vue # Perfil do usuário
│ │ │ └── 📁 admin/ # Páginas administrativas
│ │ │ ├── AdminDashboard.vue
│ │ │ ├── UserAdminView.vue
│ │ │ └── StoreAdminView.vue
│ │ ├── 📁 stores/ # Gerenciamento de estado (Pinia)
│ │ │ ├── auth.js # Estado de autenticação
│ │ │ ├── audit.js # Estado das auditorias
│ │ │ ├── user.js # Estado dos usuários
│ │ │ ├── store.js # Estado das lojas
│ │ │ └── report.js # Estado dos relatórios
│ │ ├── 📁 router/ # Configuração de rotas
│ │ │ └── index.js # Definição de rotas e guards
│ │ ├── 📁 services/ # Serviços de API
│ │ │ ├── api.js # Configuração base do axios
│ │ │ ├── authService.js # Serviços de autenticação
│ │ │ ├── auditService.js # Serviços de auditoria
│ │ │ ├── storeService.js # Serviços de lojas
│ │ │ └── reportService.js # Serviços de relatórios
│ │ ├── 📁 assets/ # Recursos estáticos
│ │ │ ├── 📁 css/ # Estilos globais
│ │ │ ├── 📁 images/ # Imagens e ícones
│ │ │ └── 📁 js/ # Scripts auxiliares
│ │ ├── 📁 composables/ # Composables do Vue 3
│ │ │ ├── useAuth.js # Lógica de autenticação
│ │ │ ├── useAudit.js # Lógica de auditoria
│ │ │ └── useApi.js # Lógica de chamadas API
│ │ ├── App.vue # Componente raiz
│ │ └── main.js # Ponto de entrada
│ ├── 📁 public/ # Arquivos públicos
│ │ ├── index.html
│ │ └── favicon.ico
│ ├── package.json
│ ├── vite.config.js # Configuração do Vite
│ └── .env
│
├── 📁 docs/ # Documentação do projeto
│ ├── API.md # Documentação da API
│ ├── DEPLOYMENT.md # Guia de implantação
│ └── USER_GUIDE.md # Guia do usuário
│
├── 📁 scripts/ # Scripts auxiliares
│ ├── deploy.sh # Script de deploy
│ ├── backup.sh # Script de backup
│ └── migrate.js # Script de migração de dados
│
├── docker-compose.yml # Orquestração de containers
├── Dockerfile # Configuração do Docker
├── package.json # Configuração do monorepo (opcional)
└── README.md # Documentação principal
