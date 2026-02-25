<template>
  <div class="avisos-importantes">
    <div class="section-header">
      <h2>⚠️ Avisos Importantes</h2>
      <span class="avisos-count">{{ avisos.length }}</span>
    </div>

    <div class="avisos-grid">
      <div
        v-for="aviso in avisosLimitados"
        :key="aviso.id"
        class="aviso-card"
        :class="`prioridade-${aviso.prioridade}`"
      >
        <div class="aviso-header">
          <div class="aviso-prioridade">
            {{ getPrioridadeIcon(aviso.prioridade) }}
          </div>
          <div class="aviso-data">{{ formatarData(aviso.createdAt) }}</div>
        </div>
        <div class="aviso-content">
          <h4>{{ aviso.titulo }}</h4>
          <p>{{ aviso.conteudo }}</p>
          <div v-if="aviso.autor" class="aviso-autor">
            <small>📝 Por: {{ aviso.autor }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="ver-tudo" @click="mostrarTodos = !mostrarTodos">
      {{ mostrarTodos ? 'Ver menos' : 'Ver tudo' }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, onMounted } from "vue";

const props = defineProps({
  achievements: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const avisos = ref([]);
const mostrarTodos = ref(false);
const carregando = ref(true);

// Computed para limitar avisos exibidos
const avisosLimitados = computed(() => {
  return mostrarTodos.value ? avisos.value : avisos.value.slice(0, 4);
});

// Função para obter ícone da prioridade
const getPrioridadeIcon = (prioridade) => {
  const icones = {
    baixa: '🟢',
    media: '🟡',
    alta: '🟠',
    critica: '🔴'
  };
  return icones[prioridade] || '🟡';
};

// Função para formatar data
const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Função para carregar avisos
const carregarAvisos = async () => {
  try {
    carregando.value = true;
    const response = await fetch('/api/avisos?status=aprovado&limite=10', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-loja': '001'
      }
    });

    if (response.ok) {
      const data = await response.json();
      avisos.value = data.avisos || [];
    } else {
      console.error('Erro ao carregar avisos:', response.statusText);
      // Usar dados mock em caso de erro
      avisos.value = [
        {
          id: 1,
          titulo: 'Manutenção programada',
          conteudo: 'Sistema ficará fora do ar das 02:00 às 04:00',
          prioridade: 'alta',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          titulo: 'Nova funcionalidade',
          conteudo: 'Novo módulo de relatórios disponível',
          prioridade: 'media',
          createdAt: new Date().toISOString()
        }
      ];
    }
  } catch (error) {
    console.error('Erro ao carregar avisos:', error);
    // Usar dados mock em caso de erro
    avisos.value = [
      {
        id: 1,
        titulo: 'Bem-vindo ao sistema',
        conteudo: 'Sistema de avisos funcionando corretamente',
        prioridade: 'baixa',
        createdAt: new Date().toISOString()
      }
    ];
  } finally {
    carregando.value = false;
  }
};

// Carregar avisos ao montar componente
onMounted(() => {
  carregarAvisos();
});
</script>

<style scoped>
.avisos-importantes {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.avisos-count {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

.avisos-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.aviso-card {
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  background: white;
  transition: all 0.3s ease;
}

.aviso-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.aviso-card.prioridade-baixa {
  border-left: 4px solid #22c55e;
}

.aviso-card.prioridade-media {
  border-left: 4px solid #eab308;
}

.aviso-card.prioridade-alta {
  border-left: 4px solid #f97316;
}

.aviso-card.prioridade-critica {
  border-left: 4px solid #ef4444;
  background: #fef2f2;
}

.aviso-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.aviso-prioridade {
  font-size: 1.2rem;
}

.aviso-data {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.aviso-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.aviso-content p {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
}

.ver-tudo {
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  color: #6366f1;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.ver-tudo:hover {
  background: #6366f1;
  color: white;
  transform: translateY(-1px);
}

.aviso-autor {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

.aviso-autor small {
  color: #6b7280;
  font-style: italic;
}

@media (max-width: 768px) {
  .avisos-grid {
    grid-template-columns: 1fr;
  }

  .aviso-card {
    padding: 0.875rem;
  }
}
</style>
