Analise completamente o projeto frontend e backend e prepare o sistema para produção na VPS.

Problemas identificados:

1) O frontend ainda está tentando conectar em:
ws://localhost:8081/
Isso indica que o build foi gerado em modo desenvolvimento.

2) O sistema está rodando em produção no domínio:
https://auditorias.site

3) O backend está rodando na VPS.

Objetivos:

1) Remover qualquer código de desenvolvimento:
- WebSocket localhost
- HMR
- refresh.js dev
- vite dev server

2) Garantir que o frontend esteja configurado para produção:

Criar ou corrigir:

.env.production

Com:

VITE_API_URL=https://auditorias.site/api

3) Garantir que o frontend use a variável de ambiente:

Exemplo correto:

const API_URL = import.meta.env.VITE_API_URL || "/api"

ou

axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

Nunca usar:

http://localhost
ws://localhost
render.com
vercel.app

4) Procurar e remover:

localhost
8081
render.com
vercel.app

5) Garantir build correto:

Configurar vite.config.js para produção.

6) Validar build:

Rodar:

npm run build

Verificar que dentro da pasta dist NÃO existe:

localhost
8081
render
vercel

7) Confirmar:

Frontend deve chamar apenas:

https://auditorias.site/api

8) Garantir compatibilidade VPS:

Frontend deve funcionar com nginx:

location / {
  try_files $uri /index.html;
}

location /api {
  proxy_pass http://localhost:3000;
}

9) Entregar resultado:

- Arquivos modificados
- Variáveis .env
- Confirmação que build é produção
- Lista de mudanças feitas

Objetivo final:

Após git pull na VPS:

cd /var/www/auditorias/frontend
npm install
npm run build

O site deve funcionar sem:

WebSocket localhost
Erro 500
Render URLs
Vercel URLs

E todo backend deve usar:

https://auditorias.site/api