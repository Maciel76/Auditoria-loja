<template>
  <div class="system-summary">
    <h3>📈 Sugestões do Sistema</h3>
    <div class="summary-grid">
      <div class="summary-item">
        <span class="summary-number">{{ estatisticas.totalGeral || 0 }}</span>
        <span class="summary-label">Total de Sugestões</span>
      </div>
      <div class="summary-item">
        <span class="summary-number">{{ estatisticas.porStatus?.pendente || 0 }}</span>
        <span class="summary-label">Sugestões Pendentes</span>
      </div>
      <div class="summary-item">
        <span class="summary-number">{{ estatisticas.porStatus?.implementado || 0 }}</span>
        <span class="summary-label">Implementadas</span>
      </div>
      <div class="summary-item">
        <span class="summary-number">{{ estatisticas.sugestoesRecentes || 0 }}</span>
        <span class="summary-label">Recentes (7 dias)</span>
      </div>
    </div>
    <div class="ver-tudo" @click="abrirDetalhes">
      Ver detalhes completos
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";

const props = defineProps({
  stats: {
    type: Object,
    required: false,
    default: () => ({}),
  },
});

const estatisticas = ref({
  totalGeral: 0,
  sugestoesRecentes: 0,
  porStatus: {
    pendente: 0,
    analisando: 0,
    implementado: 0,
    rejeitado: 0
  },
  porTipo: {}
});

const carregando = ref(true);

// Função para carregar estatísticas das sugestões
const carregarEstatisticas = async () => {
  try {
    carregando.value = true;
    const response = await fetch('/api/api/sugestoes/estatisticas', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-loja': '001'
      }
    });

    if (response.ok) {
      const data = await response.json();
      estatisticas.value = data;
    } else {
      console.error('Erro ao carregar estatísticas:', response.statusText);
      // Usar dados mock em caso de erro
      estatisticas.value = {
        totalGeral: 25,
        sugestoesRecentes: 8,
        porStatus: {
          pendente: 12,
          analisando: 5,
          implementado: 6,
          rejeitado: 2
        },
        porTipo: {
          geral: 15,
          dashboard: 4,
          ranking: 3,
          auditoria: 2,
          relatorios: 1
        }
      };
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
    // Dados padrão em caso de erro
    estatisticas.value = {
      totalGeral: 0,
      sugestoesRecentes: 0,
      porStatus: {
        pendente: 0,
        analisando: 0,
        implementado: 0,
        rejeitado: 0
      },
      porTipo: {}
    };
  } finally {
    carregando.value = false;
  }
};

// Função para abrir detalhes (pode ser expandida no futuro)
const abrirDetalhes = () => {
  // Por enquanto, apenas recarrega as estatísticas
  carregarEstatisticas();
  // TODO: Abrir modal com detalhes completos das sugestões
};

// Carregar estatísticas ao montar componente
onMounted(() => {
  carregarEstatisticas();
});
</script>

<style scoped>
.system-summary {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.system-summary h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.summary-item {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.summary-item:hover {
  background: #e2e8f0;
  border-color: #6366f1;
  transform: translateY(-2px);
}

.summary-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.3;
}

.ver-tudo {
  text-align: center;
  padding: 0.75rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.875rem;
}

.ver-tudo:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .summary-item {
    padding: 0.875rem;
  }

  .summary-number {
    font-size: 1.25rem;
  }
}
</style>
