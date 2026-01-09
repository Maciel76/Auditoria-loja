# 🔐 Sistema de Autenticação Administrativa

Sistema completo de login administrativo implementado para proteger páginas sensíveis.

## 📋 O que foi implementado:

### 1. **Store de Autenticação** (`authStore.js`)

- Gerenciamento de sessão administrativa
- Login/Logout
- Verificação de credenciais
- Persistência no localStorage

### 2. **Página de Login Admin** (`AdminLogin.vue`)

- Interface moderna e responsiva
- Validação de formulário
- Feedback visual de erros
- Animações suaves
- Rota: `/admin/login`

### 3. **Proteção de Rotas**

- Guard de navegação no router
- Verificação automática de sessão
- Redirecionamento para login se não autenticado

### 4. **Botão de Logout**

- Adicionado ao componente TesteMetricas
- Design destacado em vermelho
- Limpa sessão e redireciona para login

## 🔑 Credenciais Padrão

```
Usuário: admin
Senha: admin123
```

> ⚠️ **IMPORTANTE**: Em produção, estas credenciais devem vir de um backend seguro com hash de senha.

## 🚀 Como usar:

### Acessar área administrativa:

1. Navegue para `/admin/login`
2. Digite as credenciais
3. Será redirecionado para `/teste-metricas`

### Proteger outras rotas:

No arquivo `router/index.js`, adicione a meta `requiresAuth: true`:

```javascript
{
  path: "/sua-rota",
  name: "SuaRota",
  component: SeuComponente,
  meta: { requiresAuth: true } // Adicione esta linha
}
```

## 📁 Arquivos criados/modificados:

```
frontend/
├── src/
│   ├── store/
│   │   └── authStore.js          ✨ NOVO
│   ├── views/
│   │   └── AdminLogin.vue         ✨ NOVO
│   ├── router/
│   │   └── index.js               🔧 MODIFICADO
│   └── views/PerfilLoja/
│       └── TesteMetricas.vue      🔧 MODIFICADO
```

## 🛡️ Segurança

### Implementado:

- ✅ Proteção de rotas via navigation guards
- ✅ Verificação de sessão ao carregar páginas
- ✅ Token armazenado em localStorage
- ✅ Logout manual disponível

### Para produção (recomendações):

- 🔒 Mover credenciais para backend
- 🔒 Implementar JWT tokens
- 🔒 Adicionar refresh tokens
- 🔒 Implementar rate limiting
- 🔒 Usar HTTPS
- 🔒 Adicionar 2FA (autenticação de dois fatores)
- 🔒 Hash de senhas com bcrypt

## 🎨 Funcionalidades da UI:

- **Login**:

  - Animações de entrada
  - Toggle de visibilidade de senha
  - Mensagens de erro amigáveis
  - Loading state durante autenticação
  - Link para voltar à seleção de loja

- **TesteMetricas**:
  - Botão de logout visível
  - Estilo diferenciado (vermelho)
  - Tooltip informativo

## 📱 Responsividade:

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

## 🔄 Fluxo de Autenticação:

```
1. Usuário acessa /teste-metricas
   ↓
2. Router verifica meta.requiresAuth
   ↓
3. authStore verifica isAuthenticated
   ↓
4. Se NÃO autenticado → Redireciona para /admin/login
   ↓
5. Usuário faz login
   ↓
6. Token salvo no localStorage
   ↓
7. Redirecionado para /teste-metricas
   ↓
8. Acesso permitido
```

## 🧪 Testando:

```bash
# 1. Tente acessar diretamente (sem login)
http://localhost:5173/teste-metricas
# Resultado: Redirecionado para /admin/login

# 2. Faça login com as credenciais
# Usuário: admin
# Senha: admin123

# 3. Será redirecionado automaticamente para /teste-metricas

# 4. Clique em "Sair" para deslogar
# Resultado: Redirecionado de volta para /admin/login
```

## 💡 Dicas:

- O sistema verifica sessão automaticamente ao recarregar a página
- Token expira apenas quando usuário faz logout manualmente
- Para adicionar timeout automático, implemente lógica de expiração de token

## 🔧 Personalizações futuras:

- Adicionar níveis de permissão (admin, moderador, etc)
- Implementar histórico de login
- Adicionar recuperação de senha
- Criar página de perfil administrativo
- Implementar auditoria de ações
