# 🔧 Correção dos Erros de Desenvolvimento

## Problemas Identificados

### 1. Requisições API indo para o Frontend (Erro 404)
**Erro:**
```
POST http://localhost:5173/api/upload 404 (Not Found)
```

**Causa:** O frontend estava tentando chamar `/api` mas não havia proxy configurado para redirecionar para o backend (localhost:3000).

**Solução:** Adicionado proxy no `vite.config.js`.

---

### 2. WebSocket do Vite (Erro 8081)
**Erro:**
```
WebSocket connection to 'ws://localhost:8081/' failed
```

**Causa:** Este é o HMR (Hot Module Replacement) do Vite. É **NORMAL EM DESENVOLVIMENTO** e desaparece em produção.

**Solução:** Nenhum ação necessária - some em produção.

---

### 3. Resposta HTML em vez de JSON
**Erro:**
```
SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
```

**Causa:** As requisições estavam indo para o frontend (5173) em vez do backend (3000), retornando HTML do index.html.

**Solução:** Proxy configurado no vite.config.js resolve isso.

---

## ✅ Correções Aplicadas

### vite.config.js
Adicionado proxy para desenvolvimento:

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    },
    '/uploads': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

---

## 🔄 Como Testar

### 1. Reinicie o servidor de desenvolvimento

**Pare o servidor atual** (Ctrl+C) e inicie novamente:

```bash
cd frontend
npm run dev
```

### 2. Verifique o console

Agora as requisições devem aparecer como:
```
🌐 POST /api/upload
🌐 GET /api/sugestoes
```

E no network tab do browser:
```
Request URL: http://localhost:5173/api/upload
Request URL: http://localhost:3000/api/upload (após proxy)
```

### 3. Teste o upload

1. Vá para a página de upload
2. Selecione um arquivo
3. Envie
4. Deve funcionar sem erro 404

---

## 📝 Comportamento por Ambiente

### Desenvolvimento (npm run dev)
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Proxy: `/api` → `http://localhost:3000/api`
- WebSocket HMR: Ativo (normal)

### Produção (npm run build)
- Frontend: `https://auditorias.site`
- Backend: `https://auditorias.site/api` (nginx proxy)
- Proxy: Não necessário (nginx faz o proxy)
- WebSocket HMR: Inexistente

---

## 🎯 URLs Corretas

### Em Desenvolvimento:
| Chamada | URL Real |
|---------|----------|
| `api.get('/api/usuarios')` | `http://localhost:3000/api/usuarios` |
| `api.post('/api/upload')` | `http://localhost:3000/api/upload` |
| `api.get('/api/test')` | `http://localhost:3000/api/test` |

### Em Produção:
| Chamada | URL Real |
|---------|----------|
| `api.get('/api/usuarios')` | `https://auditorias.site/api/usuarios` |
| `api.post('/api/upload')` | `https://auditorias.site/api/upload` |
| `api.get('/api/test')` | `https://auditorias.site/api/test` |

---

## ⚠️ Importante

### Após as correções:

1. **REINICIE o servidor de desenvolvimento**
   ```bash
   # Pare com Ctrl+C
   npm run dev
   ```

2. **Limpe o cache do browser**
   - Chrome: Ctrl+Shift+Delete
   - Ou use aba anônima

3. **Verifique o console**
   - Erro do WebSocket (8081) é normal em desenvolvimento
   - Erros de API (404) devem desaparecer

---

## 🐛 Se os erros persistirem

### Verifique se o backend está rodando:
```bash
curl http://localhost:3000/test
# Deve retornar: {"status":"OK"}
```

### Verifique se o proxy está ativo:
No console do browser, as requisições devem mostrar:
```
Request URL: http://localhost:5173/api/...
Remote Address: 127.0.0.1:3000  (após proxy)
```

### Reinicie tudo:
```bash
# Backend
cd backend
npm start

# Frontend (outro terminal)
cd frontend
npm run dev
```

---

## ✅ Status

- [x] Proxy configurado no vite.config.js
- [x] .env atualizado
- [x] api.js configurado
- [ ] **REINICIAR servidor de desenvolvimento** ← FAZER ISSO AGORA!

---

**Data:** 25 de Fevereiro de 2026
**Status:** ✅ Corrigido - Reinicie o servidor!
