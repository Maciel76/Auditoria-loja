<template>
  <div class="minha-auditoria">
    <div class="auditoria-header">
      <h2>
        <i class="fas fa-clipboard-check"></i>
        Auditoria
      </h2>
      <p class="subtitle">Acompanhe seu histórico de auditorias e desempenho</p>
    </div>

    <div class="auditoria-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ usuario.totalAuditorias || 0 }}</span>
          <span class="stat-label">Total de Auditorias</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-box"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ usuario.contador || 0 }}</span>
          <span class="stat-label">Itens Auditados</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ ultimaAuditoria }}</span>
          <span class="stat-label">Última Auditoria</span>
        </div>
      </div>
    </div>

    <div class="auditoria-empty">
      <i class="fas fa-clipboard-list"></i>
      <h3>Histórico de Auditorias</h3>
      <p>O histórico detalhado de auditorias estará disponível em breve.</p>
      <p class="info-text">
        Aqui você poderá visualizar todas as suas auditorias realizadas com
        detalhes completos.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  usuario: {
    type: Object,
    required: true,
  },
});

const ultimaAuditoria = computed(() => {
  if (props.usuario.ultimaAuditoria) {
    const data = new Date(props.usuario.ultimaAuditoria);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return "Nenhuma";
});
</script>

<style scoped>
.minha-auditoria {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.auditoria-header {
  margin-bottom: 2rem;
}

.auditoria-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.auditoria-header h2 i {
  color: #667eea;
  font-size: 1.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 0;
}

.auditoria-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.stat-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-icon i {
  font-size: 1.5rem;
  color: #667eea;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.3rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
}

.auditoria-empty {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px dashed #cbd5e0;
}

.auditoria-empty i {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.auditoria-empty h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.auditoria-empty p {
  color: #7f8c8d;
  margin: 0.5rem 0;
  font-size: 1rem;
}

.info-text {
  font-size: 0.9rem;
  color: #95a5a6;
}

/* Mobile responsivo */
@media (max-width: 768px) {
  .minha-auditoria {
    border-radius: 12px;
    padding: 1.5rem 1rem;
  }

  .auditoria-header h2 {
    font-size: 1.4rem;
  }

  .auditoria-header h2 i {
    font-size: 1.2rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .auditoria-stats {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-icon i {
    font-size: 1.2rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .auditoria-empty {
    padding: 3rem 1.5rem;
  }

  .auditoria-empty i {
    font-size: 3rem;
  }

  .auditoria-empty h3 {
    font-size: 1.2rem;
  }

  .auditoria-empty p {
    font-size: 0.9rem;
  }

  .info-text {
    font-size: 0.8rem;
  }
}

/* Mobile pequeno */
@media (max-width: 480px) {
  .minha-auditoria {
    padding: 1rem;
  }

  .auditoria-header h2 {
    font-size: 1.2rem;
  }

  .stat-card {
    padding: 0.8rem;
  }

  .auditoria-empty {
    padding: 2rem 1rem;
  }

  .auditoria-empty i {
    font-size: 2.5rem;
  }
}
</style>
