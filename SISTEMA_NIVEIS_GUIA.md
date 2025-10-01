# 🎮 Sistema de Níveis e Conquistas - Guia Completo

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Como Editar Conquistas](#-como-editar-conquistas)
- [Sistema de Títulos](#-sistema-de-títulos)
- [Escalabilidade](#-escalabilidade)
- [Funcionalidades Futuras](#-funcionalidades-futuras)
- [Insights e Analytics](#-insights-e-analytics)
- [Gamificação Avançada](#-gamificação-avançada)

---

## 🎯 Visão Geral

O sistema de níveis implementado é modular e escalável, com as seguintes características:

### **Componentes Principais:**

- **nivelStore.js**: Gerencia XP, níveis, títulos e rankings
- **Conquistas modulares**: Cada conquista é um componente separado
- **Sistema de XP**: Baseado em ações dos usuários
- **Ranking global**: Comparação entre todas as lojas

### **Fórmula de Níveis:**

```javascript
Nível = Math.floor(XP_Total / 100) + 1;
XP_Total = Itens_Lidos + XP_Conquistas;
```

---

## 🏆 Como Editar Conquistas

### **1. Estrutura das Conquistas**

Todas as conquistas estão em: `/src/components/conquistas/`

#### **Arquivo Base (ConquistaBase.vue):**

```vue
<template>
  <div
    class="conquista-card"
    :class="{ desbloqueada: conquistaData.desbloqueada }"
  >
    <!-- Interface padrão para todas as conquistas -->
  </div>
</template>
```

#### **Conquista Individual (Exemplo: MetaBatida.vue):**

```vue
<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
export default {
  computed: {
    conquistaData() {
      const contador = this.usuario.contador || 0;
      const desbloqueada = contador >= 500; // CONDIÇÃO AQUI

      return {
        id: "meta_500",
        nome: "Meta Batida",
        descricao: "Leu mais de 500 itens",
        icone: "🎯",
        xp: 50, // XP GANHO AQUI
        desbloqueada,
        progresso: Math.min(100, (contador / 500) * 100),
      };
    },
  },
};
</script>
```

### **2. Criando Nova Conquista**

#### **Passo 1: Criar arquivo da conquista**

```bash
# Criar novo arquivo
touch /src/components/conquistas/MinhaNovaConquista.vue
```

#### **Passo 2: Implementar a conquista**

```vue
<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from "./ConquistaBase.vue";

export default {
  name: "MinhaNovaConquista",
  components: { ConquistaBase },
  props: {
    usuario: { type: Object, required: true },
    // Adicione props necessárias para sua condição
  },
  computed: {
    conquistaData() {
      // DEFINA SUA CONDIÇÃO AQUI
      const desbloqueada = this.usuario.contador >= 1500;

      return {
        id: "minha_conquista",
        nome: "Minha Conquista",
        descricao: "Descrição da conquista",
        icone: "🚀",
        xp: 75,
        desbloqueada,
        // Adicione repetição se necessário
        repeticao: "mensal", // opcional
        progresso: this.calcularProgresso(),
      };
    },
  },
  methods: {
    calcularProgresso() {
      // Lógica para calcular progresso 0-100%
      return Math.min(100, (this.usuario.contador / 1500) * 100);
    },
  },
};
</script>
```

#### **Passo 3: Registrar no index.js**

```javascript
// /src/components/conquistas/index.js
export { default as MinhaNovaConquista } from "./MinhaNovaConquista.vue";
```

#### **Passo 4: Adicionar ao SelosConquistas.vue**

```vue
<template>
  <div class="conquistas-grid">
    <!-- Conquistas existentes -->
    <MinhaNovaConquista :usuario="usuario" />
  </div>
</template>

<script>
import { MinhaNovaConquista } from "@/components/conquistas";
export default {
  components: { MinhaNovaConquista },
};
</script>
```

### **3. Tipos de Conquistas**

#### **Conquistas Únicas (uma vez só):**

```javascript
{
  id: 'primeira_vez',
  repeticao: undefined // padrão
}
```

#### **Conquistas Repetíveis:**

```javascript
{
  id: 'relampago',
  repeticao: 'diária'  // 'diária', 'semanal', 'mensal'
}
```

#### **Conquistas por Marcos:**

```javascript
// Use múltiplas conquistas para diferentes marcos
MetaBatida500.vue; // 500 itens
MetaBatida1000.vue; // 1000 itens
MetaBatida2000.vue; // 2000 itens
```

---

## 👑 Sistema de Títulos

### **1. Como os Títulos são Definidos**

Títulos estão em: `/src/store/nivelStore.js`

```javascript
obterTitulo: () => (nivel) => {
  const titulos = {
    1: "Novato",
    2: "Iniciante",
    3: "Aprendiz",
    5: "Competente",
    8: "Experiente",
    12: "Veterano",
    16: "Especialista",
    20: "Mestre",
    25: "Auditor Senior",
    30: "Lenda",
    40: "Elite",
    50: "Supremo",
  };

  // Lógica para encontrar título apropriado
  const niveisOrdenados = Object.keys(titulos)
    .map(Number)
    .sort((a, b) => b - a);

  for (const nivelMinimo of niveisOrdenados) {
    if (nivel >= nivelMinimo) {
      return titulos[nivelMinimo];
    }
  }

  return "Auditor de Estoque"; // fallback
};
```

### **2. Criando Novo Título**

#### **Adicionar no objeto titulos:**

```javascript
const titulos = {
  1: "Novato",
  // ... títulos existentes
  60: "Imortal", // NOVO TÍTULO
  70: "Transcendente", // OUTRO NOVO
};
```

#### **Títulos Especiais por Conquistas:**

```javascript
// Função para títulos baseados em conquistas específicas
obterTituloEspecial: () => (usuario, conquistas) => {
  if (conquistas.includes("zero_faltas_30_dias")) {
    return "Perfeccionista";
  }
  if (conquistas.includes("todas_lojas_visitadas")) {
    return "Explorador Universal";
  }

  return null; // usa título por nível normal
};
```

### **3. Ícones de Título**

No PerfilHeader.vue:

```javascript
const tituloIcon = computed(() => {
  const nivel = nivelAtual.value;
  if (nivel >= 70) return "👑"; // Transcendente
  if (nivel >= 60) return "💎"; // Imortal
  if (nivel >= 50) return "🏆"; // Supremo
  if (nivel >= 40) return "🥇"; // Elite
  // ... outros ícones
});
```

---

## 🚀 Escalabilidade

### **1. Banco de Dados**

#### **Tabela usuarios_estatisticas:**

```sql
CREATE TABLE usuarios_estatisticas (
  id SERIAL PRIMARY KEY,
  usuario_id VARCHAR(50),
  xp_total INTEGER DEFAULT 0,
  nivel INTEGER DEFAULT 1,
  titulo VARCHAR(100),
  conquistas_json TEXT, -- array de IDs das conquistas
  ultima_atividade TIMESTAMP,
  data_criacao TIMESTAMP DEFAULT NOW()
);
```

#### **Tabela conquistas_historico:**

```sql
CREATE TABLE conquistas_historico (
  id SERIAL PRIMARY KEY,
  usuario_id VARCHAR(50),
  conquista_id VARCHAR(100),
  xp_ganho INTEGER,
  data_conquista TIMESTAMP DEFAULT NOW(),
  loja_codigo VARCHAR(10)
);
```

### **2. Sistema de Cache**

#### **Redis para Rankings:**

```javascript
// Cache do ranking global (atualizar a cada hora)
const rankingKey = `ranking:global:${new Date().getHours()}`;
await redis.setex(rankingKey, 3600, JSON.stringify(ranking));
```

#### **Cache de Usuário:**

```javascript
// Cache dos dados do usuário (atualizar a cada ação)
const userKey = `user:${usuarioId}:stats`;
await redis.setex(userKey, 1800, JSON.stringify(userStats));
```

### **3. API Endpoints Sugeridos**

```javascript
// Rotas do backend
GET    /api/usuarios/:id/estatisticas
POST   /api/usuarios/:id/conquistas
GET    /api/ranking/global
GET    /api/ranking/loja/:codigo
POST   /api/eventos/xp        // Ganhar XP por ação
GET    /api/conquistas/disponiveis/:usuarioId
```

### **4. Eventos em Tempo Real**

#### **WebSockets para atualizações live:**

```javascript
// Cliente
socket.on("xp_ganho", (data) => {
  showNotification(`+${data.xp} XP! ${data.motivo}`);
  updateUserLevel(data.nivel_novo);
});

socket.on("conquista_desbloqueada", (conquista) => {
  showConquistaAnimation(conquista);
});

// Servidor
io.to(`loja_${codigoLoja}`).emit("ranking_updated", novoRanking);
```

---

## 🎨 Funcionalidades Futuras

### **1. Funcionalidades para o Perfil**

#### **🏅 Sistema de Badges Dinâmicos:**

```vue
<!-- BadgeShowcase.vue -->
<div class="badges-showcase">
  <div v-for="badge in userBadges" :key="badge.id" class="badge-item">
    <div class="badge-icon">{{ badge.icon }}</div>
    <div class="badge-info">
      <h4>{{ badge.nome }}</h4>
      <p>{{ badge.descricao }}</p>
      <span class="badge-data">{{ badge.dataConquista }}</span>
    </div>
  </div>
</div>
```

#### **📊 Gráfico de Progresso:**

```vue
<!-- ProgressChart.vue -->
<canvas ref="chartCanvas" class="progress-chart"></canvas>
<script>
// Usar Chart.js para mostrar evolução do XP ao longo do tempo
</script>
```

#### **🎯 Metas Personalizadas:**

```vue
<!-- MetasPersonalizadas.vue -->
<div class="metas-container">
  <div v-for="meta in metas" class="meta-card">
    <h3>{{ meta.titulo }}</h3>
    <div class="meta-progresso">
      <div class="progresso-bar" :style="{ width: meta.progresso + '%' }"></div>
    </div>
    <p>{{ meta.atual }}/{{ meta.objetivo }} {{ meta.unidade }}</p>
  </div>
</div>
```

#### **🏆 Vitrine de Conquistas:**

```vue
<!-- VitrineConquistas.vue -->
<div class="vitrine">
  <div class="conquista-destaque">
    <h3>Conquista Mais Recente</h3>
    <ConquistaCard :conquista="ultimaConquista" />
  </div>

  <div class="conquistas-raras">
    <h3>Conquistas Raras</h3>
    <div v-for="conquista in conquistasRaras" class="conquista-rara">
      <span class="raridade">{{ conquista.raridade }}%</span>
      <ConquistaCard :conquista="conquista" />
    </div>
  </div>
</div>
```

### **2. Funcionalidades Competitivas**

#### **🏁 Torneios Mensais:**

```javascript
// TorneioStore.js
export const useTorneioStore = defineStore("torneio", {
  state: () => ({
    torneioAtual: null,
    participantes: [],
    ranking: [],
  }),

  actions: {
    async participarTorneio(usuarioId) {
      // Inscrever usuário no torneio atual
    },

    async obterRankingTorneio() {
      // Ranking específico do torneio
    },
  },
});
```

#### **👥 Sistema de Equipes:**

```vue
<!-- EquipeProfile.vue -->
<div class="equipe-profile">
  <h2>{{ equipe.nome }}</h2>
  <div class="equipe-stats">
    <div class="stat">
      <span class="numero">{{ equipe.xpTotal }}</span>
      <span class="label">XP Total da Equipe</span>
    </div>
  </div>

  <div class="membros-equipe">
    <UserCard v-for="membro in equipe.membros" :user="membro" />
  </div>
</div>
```

#### **🎮 Desafios Diários:**

```javascript
// DesafiosStore.js
const desafiosDiarios = [
  {
    id: "velocidade",
    titulo: "Velocidade Máxima",
    descricao: "Leia 100 itens em menos de 2 horas",
    xp: 50,
    icone: "⚡",
    condicao: (atividades) => {
      // Lógica do desafio
    },
  },
];
```

### **3. Analytics e Relatórios**

#### **📈 Dashboard Pessoal:**

```vue
<!-- DashboardPessoal.vue -->
<div class="dashboard-pessoal">
  <div class="metricas-periodo">
    <select v-model="periodoSelecionado">
      <option value="7">Últimos 7 dias</option>
      <option value="30">Últimos 30 dias</option>
      <option value="90">Últimos 90 dias</option>
    </select>
  </div>

  <div class="graficos-container">
    <XpChart :dados="dadosXp" />
    <AtividadeChart :dados="dadosAtividade" />
    <ComparacaoChart :dados="dadosComparacao" />
  </div>
</div>
```

#### **🎯 Previsões e Sugestões:**

```javascript
// IA para sugestões
const sugestoesMelhoria = {
  async analisarDesempenho(usuarioId) {
    const dados = await obterDadosUsuario(usuarioId);

    return {
      pontosFracos: ["Velocidade de leitura", "Consistência"],
      sugestoes: [
        "Tente manter ritmo constante nas auditorias",
        "Foque em corredores com menor cobertura",
      ],
      metaRecomendada: "Alcançar 150 itens por dia",
    };
  },
};
```

---

## 📊 Insights e Analytics

### **1. Métricas Importantes para Acompanhar**

#### **📈 Métricas de Engajamento:**

```javascript
const metricas = {
  // Taxa de retenção
  retencao: {
    diaria: "Usuários que voltam no dia seguinte",
    semanal: "Usuários ativos por semana",
    mensal: "Usuários ativos por mês",
  },

  // Progressão
  progressao: {
    tempo_medio_nivel: "Tempo médio para subir de nível",
    taxa_abandono: "Em que nível usuários param de progredir",
    conquistas_populares: "Quais conquistas são mais obtidas",
  },

  // Competição
  competicao: {
    usuarios_top10: "Quantos usuários estão no top 10",
    diferenca_ranking: "Diferença de XP entre posições",
    atividade_competitiva: "Usuários que melhoram posição",
  },
};
```

#### **🎯 KPIs do Sistema:**

```javascript
// Dashboard para gestores
const kpis = {
  produtividade: {
    itens_por_usuario: mediaItensPorUsuario,
    eficiencia_auditoria: tempoMedioPorItem,
    cobertura_estoque: percentualEstoqueAuditado,
  },

  qualidade: {
    precisao_auditoria: errosIdentificados / totalItens,
    itens_faltantes_encontrados: itensFaltantesDetectados,
    tempo_resolucao: tempoMedioResolucaoProblemas,
  },

  engajamento: {
    usuarios_ativos_diarios: usuariosAtivosDia,
    tempo_medio_sessao: tempoMedioPlataforma,
    conquistas_por_usuario: mediaConquistasPorUsuario,
  },
};
```

### **2. Alertas Inteligentes**

#### **🚨 Alertas para Gestores:**

```javascript
const alertas = {
  desempenho: {
    queda_produtividade: "Usuário X teve queda de 30% na produtividade",
    meta_nao_atingida: "Loja Y não atingiu meta mensal",
    usuario_inativo: "Usuário Z não fez auditoria há 5 dias",
  },

  qualidade: {
    muitos_erros: "Aumento de 50% em itens faltantes na loja X",
    auditoria_incompleta: "Setor Y sem auditoria há 2 dias",
    divergencia_estoque: "Grandes diferenças no estoque do setor Z",
  },

  sistema: {
    conquista_popular: "Conquista X foi obtida por 80% dos usuários",
    nivel_dificil: "Apenas 5% dos usuários passaram do nível Y",
    ranking_estagnado: "Top 10 não mudou em 2 semanas",
  },
};
```

### **3. Análise Preditiva**

#### **🔮 Previsões baseadas em dados:**

```javascript
const predicoes = {
  async preverDesempenho(usuarioId) {
    const historico = await obterHistoricoUsuario(usuarioId);

    return {
      nivel_proximo_mes: calcularTendenciaNivel(historico),
      conquistas_provaveis: identificarConquistasProximas(historico),
      risco_inatividade: calcularRiscoAbandon(historico),
      meta_recomendada: sugerirMetaRealista(historico),
    };
  },

  async analisarTendenciasLoja(codigoLoja) {
    return {
      produtividade_media: tendenciaProducao,
      usuarios_em_risco: usuariosComRiscoSaida,
      areas_melhoria: setoresComBaixoDesempenho,
      oportunidades: conquistasSubutilizadas,
    };
  },
};
```

### **4. Relatórios Automatizados**

#### **📋 Relatório Semanal:**

```javascript
const relatorioSemanal = {
  async gerarRelatorio(periodo) {
    return {
      resumo_executivo: {
        usuarios_ativos: contadorUsuariosAtivos,
        itens_auditados: totalItensAuditados,
        conquistas_desbloqueadas: novasConquistas,
        nivel_medio: nivelMedioUsuarios,
      },

      destaques: {
        top_performers: top5Usuarios,
        conquistas_raras: conquistasDificeis,
        melhorias_significativas: usuariosComMaiorEvolucao,
      },

      areas_atencao: {
        usuarios_inativos: usuariosSemAtividade,
        setores_baixo_desempenho: setoresProblematicos,
        metas_nao_atingidas: metasPerdidas,
      },

      recomendacoes: {
        ajustes_sistema: sugestoesBalanceamento,
        novas_conquistas: ideiasNovasConquistas,
        melhorias_ui: feedbackUsuarios,
      },
    };
  },
};
```

---

## 🎮 Gamificação Avançada

### **1. Sistemas de Recompensas**

#### **💎 Moeda Virtual:**

```javascript
const moedasSistema = {
  // Usuários ganham "Audit Coins" por atividades
  ganharMoedas: {
    item_auditado: 1,
    conquista_desbloqueada: 10,
    meta_diaria: 50,
    posicao_top10: 100,
  },

  // Loja de recompensas
  lojaRecompensas: [
    { item: "Avatar personalizado", custo: 500 },
    { item: "Título exclusivo por 30 dias", custo: 1000 },
    { item: "Badge especial", custo: 250 },
    { item: "Escolher próximo desafio da loja", custo: 2000 },
  ],
};
```

#### **🎁 Sistema de Presentes:**

```vue
<!-- SistemaPresentes.vue -->
<div class="presentes-diarios">
  <h3>Presente Diário</h3>
  <div class="calendario-presentes">
    <div v-for="dia in 30" :key="dia" class="dia-presente">
      <span class="dia-numero">{{ dia }}</span>
      <div class="presente-icon">🎁</div>
      <span class="recompensa">{{ recompensasDiarias[dia] }}</span>
    </div>
  </div>
</div>
```

**Sugestões de presentes interessantes para o componente:**

- Moedas virtuais (ex: Audit Coins)
- XP extra (ex: +50 XP)
- Badges exclusivas do mês
- Avatares especiais temporários
- Boost de XP por 24h
- Títulos comemorativos (ex: "Colecionador de Presentes")
- Acesso antecipado a novos desafios
- Temas de perfil limitados
- Tickets para sorteios mensais
- Presentes surpresa (item aleatório)

Exemplo de array de recompensas:

```javascript
const recompensasDiarias = [
  "10 Audit Coins",
  "+50 XP",
  "Badge: Presenteiro",
  "Avatar especial",
  "Boost XP 24h",
  "Tema de perfil: Festivo",
  "Ticket de sorteio",
  "Presente surpresa",
  // ... até o dia 30
];
```

````

### **2. Eventos Especiais**

#### **🎉 Eventos Sazonais:**
```javascript
const eventosSazonais = {
  'black_friday': {
    nome: 'Black Friday Audit',
    periodo: '23-27 Nov',
    bonus_xp: 2.0,
    conquista_especial: 'Caçador de Ofertas',
    meta_evento: 'Auditar 1000 itens em 5 dias'
  },

  'natal': {
    nome: 'Auditoria Natalina',
    periodo: '15-31 Dez',
    tema_especial: 'Papai Noel dos Estoques',
    presentes_diarios: true,
    decoracao_perfil: 'Tema natalino'
  }
}
````

#### **⚡ Eventos Flash:**

```javascript
const eventosFlash = {
  hora_feliz: {
    duracao: "1 hora",
    bonus: "XP duplo",
    frequencia: "Aleatório 2-3x por semana",
    notificacao: "Push notification para usuários ativos",
  },

  desafio_loja: {
    duracao: "24 horas",
    objetivo: "Loja com maior número de auditorias",
    premio: "Todos da loja ganham badge especial",
  },
};
```

### **3. Mecânicas Sociais**

#### **👥 Sistema de Mentoria:**

```vue
<!-- SistemaMentoria.vue -->
<div class="mentoria-sistema">
  <div class="mentor-card" v-if="usuario.nivel >= 20">
    <h3>Seja um Mentor</h3>
    <p>Ajude novatos e ganhe XP extra</p>
    <button @click="tornarMentor">Tornar-se Mentor</button>
  </div>

  <div class="mentorado-card" v-if="usuario.nivel <= 5">
    <h3>Encontre um Mentor</h3>
    <p>Acelere seu progresso com ajuda experiente</p>
    <button @click="buscarMentor">Buscar Mentor</button>
  </div>
</div>
```

#### **🤝 Sistema de Parceiros:**

```javascript
const sistemaParcerias = {
  // Usuários podem formar duplas para desafios
  criarParceria: async (usuario1Id, usuario2Id) => {
    return {
      id: gerarIdParceria(),
      membros: [usuario1Id, usuario2Id],
      bonus_xp: 1.2, // 20% bonus quando trabalham juntos
      conquistas_dupla: ["Dupla Dinâmica", "Sincronia Perfeita"],
      chat_privado: true,
    };
  },
};
```

### **4. Personalização Avançada**

#### **🎨 Customização de Perfil:**

```vue
<!-- CustomizacaoPerfil.vue -->
<div class="customizacao-perfil">
  <div class="temas-disponiveis">
    <h3>Temas de Perfil</h3>
    <div v-for="tema in temasDesbloqueados" class="tema-card">
      <div class="tema-preview" :style="tema.preview"></div>
      <span>{{ tema.nome }}</span>
    </div>
  </div>

  <div class="avatares-especiais">
    <h3>Avatares Especiais</h3>
    <div v-for="avatar in avataresEspeciais" class="avatar-opcao">
      <img :src="avatar.imagem" :alt="avatar.nome">
      <span>{{ avatar.requisito }}</span>
    </div>
  </div>
</div>
```

#### **🏷️ Títulos Personalizados:**

```javascript
const titulosPersonalizados = {
  // Usuários podem criar títulos únicos ao atingir marcos
  criarTituloPersonalizado: {
    requisitos: "Nível 50 + todas as conquistas principais",
    limite_caracteres: 20,
    aprovacao_manual: true, // Moderação para evitar conteúdo inadequado
    custo_moedas: 5000,
  },

  // Títulos comunitários votados
  titulosComunitarios: {
    processo: "Usuários propõem, comunidade vota",
    duracao_votacao: "1 semana",
    implementacao: "Títulos mais votados entram no sistema",
  },
};
```

---

## 🔧 Implementação Prática

### **Próximos Passos Recomendados:**

1. **📊 Analytics Básico**: Implementar tracking de eventos primeiro
2. **🎁 Sistema de Recompensas**: Adicionar moedas virtuais
3. **📱 Notificações**: Push notifications para conquistas
4. **🏆 Eventos**: Criar primeiro evento sazonal
5. **👥 Social**: Implementar sistema de mentoria
6. **🎨 Personalização**: Permitir customização de perfil

### **Prioridade de Desenvolvimento:**

1. **Alta**: Analytics e métricas
2. **Média**: Eventos e recompensas
3. **Baixa**: Personalização avançada

---

## 📞 Suporte

Para dúvidas sobre implementação ou sugestões de melhorias, consulte:

- **Documentação do código**: Comentários nos arquivos fonte
- **Store principal**: `/src/store/nivelStore.js`
- **Componentes**: `/src/components/conquistas/`

---

_Sistema implementado com Vue 3 + Pinia + Sistema de Níveis Modular_

**Versão**: 1.0
**Última atualização**: Dezembro 2024
