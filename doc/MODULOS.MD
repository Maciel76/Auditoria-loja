🔗 Fluxo de Dependências entre Módulos
Backend
text
server.js → app.js →
├── middlewares (auth, role, store) →
├── routes →
│ ├── controllers →
│ │ ├── services →
│ │ │ ├── utils
│ │ │ └── models
│ │ └── models
│ └── middlewares
└── config
Frontend
text
main.js → App.vue →
├── router →
│ └── guards (autenticação)
├── views →
│ ├── components
│ └── stores
├── stores →
│ └── services
└── services → API
👥 Hierarquia de Usuários e Permissões
Níveis de Acesso
Auditor - Funcionário de loja

Upload de auditorias

Visualizar próprio desempenho

Visualizar dados da própria loja

Supervisor - Coordenador de loja

Todas permissões do Auditor

Visualizar equipe

Relatórios da loja

Manager - Gerente regional

Todas permissões do Supervisor

Visualizar múltiplas lojas

Comparativos entre lojas

Admin - Administrador do sistema

Acesso completo

Gerenciamento de usuários

Gerenciamento de lojas

Configurações do sistema

📊 Fluxo de Processamento de Auditoria
text
Upload → Validação →
├→ Processamento →
│ ├→ Extração dados →
│ ├→ Validação dados →
│ ├→ Salvar no banco →
│ └→ Atualizar estatísticas
└→ Retorno para usuário
🔄 Fluxo de Autenticação
text
Login → Validação credenciais →
├→ Geração token JWT →
├→ Armazenamento token (localStorage) →
├→ Inclusão token em headers →
└→ Redirecionamento dashboard
Esta árvore genealógica representa a estrutura completa do sistema, mostrando como cada componente se relaciona e a hierarquia de dependências. A estrutura é projetada para ser modular, escalável e de fácil manutenção, permitindo que o sistema cresça de forma organizada.
