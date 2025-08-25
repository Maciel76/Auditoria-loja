# Auditoria de Setores - Frontend

## O que é este sistema?

Este sistema é uma aplicação web para auditoria em lojas, permitindo o controle, análise e monitoramento de produtos, colaboradores e locais auditados. O usuário pode visualizar estatísticas, filtrar dados por data, local, status e produto, exportar relatórios e acompanhar o progresso da auditoria.

## Tecnologias utilizadas

- **Vue.js**: Framework principal do frontend
- **Vite**: Ferramenta de build e desenvolvimento rápido
- **Axios**: Requisições HTTP para o backend
- **Lodash**: Utilitários JS para performance e usabilidade
- **CSS Moderno**: Layout responsivo e visual agradável

## Propósito

O objetivo é facilitar a gestão de auditorias em lojas, tornando o processo mais visual, rápido e eficiente. O sistema permite importar planilhas, visualizar dados filtrados, exportar relatórios e acompanhar o desempenho dos colaboradores.

## O que ele faz?

- Importa dados de auditoria via planilha
- Exibe estatísticas por setor/local
- Permite filtrar por data, local, status e produto
- Exporta relatórios em CSV
- Visualiza mapa de calor dos setores
- Mostra progresso e desempenho dos colaboradores

## Passo a passo para rodar localmente

### 1. Clonar o projeto

```sh
git clone https://github.com/Maciel76/Auditoria-loja.git
git clone https://github.com/Maciel76/Backend-auditoria-loja.git
```

### 2. Organizar a estrutura de pastas

Crie uma pasta chamada `auditoria` e mova as pastas `Auditoria-loja` (frontend) e `Backend-auditoria-loja` (backend) para dentro dela. A estrutura final ficará assim:

```
auditoria/
├── frontend/      # Código do frontend (Auditoria-loja)
├── backend/       # Código do backend (Backend-auditoria-loja)
```

Renomeie as pastas, se necessário, para `frontend` e `backend` para facilitar o uso dos comandos seguintes.

### 2. Instalar dependências do frontend em cada pasta execute o código a segui no terminal

```sh
cd Auditoria-loja/frontend
npm install
```

### 3. Instalar dependências do backend

```sh
cd ../backend
npm install
```

### 4. Configurar o MongoDB

- Certifique-se de ter o MongoDB instalado e rodando localmente (padrão: mongodb://localhost:27017)
- O backend já está configurado para conectar no banco local

### 5. Iniciar o backend

```sh
node server.js
```

### 6. Iniciar o frontend

```sh
cd ../frontend
npm run dev
```

### 7. Acessar o sistema

Abra o navegador e acesse:

```
http://localhost:5173
```

## Observações

- O backend deve estar rodando em `http://localhost:3000`
- O frontend se comunica via API REST com o backend
- Para importar dados, use a tela de upload no sistema

## Requisitos

- Node.js (v18 ou superior)
- npm
- MongoDB
- Git

---

Se tiver dúvidas, ou entre em contato com o desenvolvedor.

- [WhatsApp: (62) 98280-9010](https://wa.me/5562982809010)
- [E-mail: stwcontato@hotmail.com](mailto:stwcontato@hotmail.com)
