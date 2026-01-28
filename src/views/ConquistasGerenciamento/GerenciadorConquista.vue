<template>
  <div class="achievements-manager-layout">
    <!-- Header -->
    <div class="area-top">
      <div class="achievements-header">
        <div class="header-content">
          <div class="header-title">
            <div class="title-icon">🏆</div>
            <div class="title-section">
              <h1>Gerenciamento de Conquistas</h1>
              <p>Configure e gerencie todas as conquistas do sistema</p>
            </div>
          </div>
          <div class="header-actions">
            <button @click="loadAchievements" class="btn-refresh">🔄 Atualizar</button>
            <button @click="openCreateModal" class="btn-create">
              ➕ Nova Conquista
              <!-- reque atenção -->
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content-wrapper">
      <!-- Sidebar -->
      <div class="area-left">
        <div class="filter-section">
          <h3>📂 Filtrar por Categoria</h3>
          <div class="filter-buttons">
            <button
              class="filter-btn"
              :class="{ active: categoryFilter === '' }"
              @click="categoryFilter = ''"
            >
              🎯 Todas ({{ achievements.length }})
            </button>
            <button
              class="filter-btn"
              :class="{ active: categoryFilter === 'audits' }"
              @click="categoryFilter = 'audits'"
            >
              📋 Auditorias ({{ getCountByCategory("audits") }})
            </button>
            <button
              class="filter-btn"
              :class="{ active: categoryFilter === 'performance' }"
              @click="categoryFilter = 'performance'"
            >
              ⚡ Performance ({{ getCountByCategory("performance") }})
            </button>
            <button
              class="filter-btn"
              :class="{ active: categoryFilter === 'consistency' }"
              @click="categoryFilter = 'consistency'"
            >
              📅 Consistência ({{ getCountByCategory("consistency") }})
            </button>
            <button
              class="filter-btn"
              :class="{ active: categoryFilter === 'participation' }"
              @click="categoryFilter = 'participation'"
            >
              🤝 Participação ({{ getCountByCategory("participation") }})
            </button>
          </div>
        </div>

        <div class="stats-section">
          <h3>📊 Estatísticas</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-value">{{ achievements.length }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ getCountByDifficulty("easy") }}</span>
              <span class="stat-label">Fáceis</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ getCountByDifficulty("medium") }}</span>
              <span class="stat-label">Médias</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ getCountByDifficulty("hard") }}</span>
              <span class="stat-label">Difíceis</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Conteúdo Principal -->
      <div class="area-right">
        <div class="content-header">
          <h2>{{ getFilterTitle() }}</h2>
          <p>{{ filteredAchievements.length }} conquistas encontradas</p>
        </div>

        <!-- Lista de Conquistas -->
        <div class="achievements-list">
          <div
            v-for="achievement in filteredAchievements"
            :key="achievement.achievementId"
            class="achievement-card"
            :class="`difficulty-${achievement.difficulty}`"
          >
            <!-- Header -->
            <div class="achievement-header">
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-info">
                <h3>{{ achievement.title }}</h3>
                <p class="achievement-id">{{ achievement.achievementId }}</p>
              </div>
              <div class="achievement-badges">
                <span class="badge badge-category" :class="achievement.category">
                  {{ getCategoryText(achievement.category) }}
                </span>
                <span class="badge badge-difficulty" :class="achievement.difficulty">
                  {{ getDifficultyText(achievement.difficulty) }}
                </span>
                <span class="badge badge-points">{{ achievement.points }} XP</span>
              </div>
            </div>

            <!-- Descrição -->
            <div class="achievement-description">
              <p>{{ achievement.description }}</p>
            </div>

            <!-- Critérios -->
            <div class="achievement-criteria">
              <h4>🎯 Critérios de Desbloqueio</h4>
              <div class="criteria-grid">
                <div class="criteria-item">
                  <span class="criteria-label">Tipo:</span>
                  <span class="criteria-value">{{
                    getCriteriaTypeText(achievement.criteria.type)
                  }}</span>
                </div>
                <div class="criteria-item">
                  <span class="criteria-label">Meta:</span>
                  <span class="criteria-value">{{ achievement.criteria.target }}</span>
                </div>
                <div class="criteria-item">
                  <span class="criteria-label">Campo Fonte:</span>
                  <span class="criteria-value source-field">{{
                    achievement.sourceField || "Não definido"
                  }}</span>
                </div>
              </div>
              <p class="criteria-description">
                {{ achievement.criteria.description }}
              </p>
            </div>

            <!-- Ações -->
            <div class="achievement-actions">
              <button @click="editAchievement(achievement)" class="btn-action btn-edit">
                ✏️ Editar
              </button>
              <button
                @click="duplicateAchievement(achievement)"
                class="btn-action btn-duplicate"
              >
                📋 Duplicar
              </button>
              <button
                @click="deleteAchievement(achievement.achievementId)"
                class="btn-action btn-delete"
              >
                🗑️ Deletar
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredAchievements.length === 0" class="empty-state">
            <div class="empty-icon">🏆</div>
            <h3>Nenhuma conquista encontrada</h3>
            <p>Crie uma nova conquista para começar</p>
            <button @click="openCreateModal" class="btn-create-empty">
              ➕ Criar Conquista
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Criar/Editar -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <!-- Modal Header -->
          <div class="modal-header">
            <h2>
              {{ isEditing ? "✏️ Editar Conquista" : "➕ Nova Conquista" }}
            </h2>
            <button @click="closeModal" class="btn-close">✖</button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <!-- Seção 1: Informações Básicas -->
            <div class="form-section">
              <h3>📝 Informações Básicas</h3>
              <div class="form-row">
                <div class="form-group full">
                  <label>ID da Conquista *</label>
                  <input
                    v-model="formData.achievementId"
                    type="text"
                    placeholder="ex: first-audit"
                    :disabled="isEditing"
                    class="form-input"
                  />
                  <small>Identificador único (apenas letras, números e hífen)</small>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Título *</label>
                  <input
                    v-model="formData.title"
                    type="text"
                    placeholder="ex: Primeira Auditoria"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>Ícone *</label>
                  <input
                    v-model="formData.icon"
                    type="text"
                    placeholder="🏆"
                    class="form-input icon-input"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group full">
                  <label>Descrição *</label>
                  <textarea
                    v-model="formData.description"
                    placeholder="Descrição da conquista"
                    class="form-textarea"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Seção 2: Classificação -->
            <div class="form-section">
              <h3>🏷️ Classificação</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Categoria *</label>
                  <select v-model="formData.category" class="form-select">
                    <option value="audits">📋 Auditorias</option>
                    <option value="performance">⚡ Performance</option>
                    <option value="consistency">📅 Consistência</option>
                    <option value="participation">🤝 Participação</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Dificuldade *</label>
                  <select v-model="formData.difficulty" class="form-select">
                    <option value="easy">🟢 Fácil</option>
                    <option value="medium">🟡 Média</option>
                    <option value="hard">🔴 Difícil</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Pontos XP *</label>
                  <input
                    v-model.number="formData.points"
                    type="number"
                    min="0"
                    placeholder="10"
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <!-- Seção 3: Critérios -->
            <div class="form-section">
              <h3>🎯 Critérios de Desbloqueio</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Tipo *</label>
                  <select v-model="formData.criteria.type" class="form-select">
                    <option value="count">Contagem</option>
                    <option value="percentage">Percentual</option>
                    <option value="streak">Sequência</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Meta *</label>
                  <input
                    v-model.number="formData.criteria.target"
                    type="number"
                    min="0"
                    placeholder="1"
                    class="form-input"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group full">
                  <label>Descrição do Critério *</label>
                  <input
                    v-model="formData.criteria.description"
                    type="text"
                    placeholder="ex: Realizar 1 auditoria"
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <!-- Seção 4: Campo Fonte -->
            <div class="form-section">
              <h3>⚙️ Campo Fonte de Dados</h3>
              <div class="form-row">
                <div class="form-group full">
                  <label>Selecione o campo que alimenta esta conquista *</label>
                  <select v-model="formData.sourceField" class="form-select">
                    <optgroup label="Auditorias">
                      <option value="contadoresAuditorias.totalGeral">
                        contadoresAuditorias.totalGeral
                      </option>
                      <option value="contadoresAuditorias.totalEtiquetas">
                        contadoresAuditorias.totalEtiquetas
                      </option>
                      <option value="contadoresAuditorias.totalRupturas">
                        contadoresAuditorias.totalRupturas
                      </option>
                    </optgroup>
                    <optgroup label="Itens Lidos">
                      <option value="totaisAcumulados.itensLidosTotal">
                        totaisAcumulados.itensLidosTotal
                      </option>
                      <option value="totaisAcumulados.itensLidosEtiquetas">
                        totaisAcumulados.itensLidosEtiquetas
                      </option>
                    </optgroup>
                    <optgroup label="Precisão">
                      <option value="totais.percentualConclusaoGeral">
                        totais.percentualConclusaoGeral
                      </option>
                    </optgroup>
                    <optgroup label="Tendências">
                      <option value="tendencias.currentStreak">
                        tendencias.currentStreak
                      </option>
                      <option value="tendencias.weeklyAudits">
                        tendencias.weeklyAudits
                      </option>
                    </optgroup>
                    <optgroup label="Participação">
                      <option value="ContadorLocais">
                        ContadorLocais (setores únicos)
                      </option>
                    </optgroup>
                  </select>
                  <small class="field-hint"
                    >Este campo define de onde vem o valor para comparar com a meta</small
                  >
                </div>
              </div>
            </div>

            <!-- Preview -->
            <div class="form-section preview-section">
              <h3>👁️ Preview</h3>
              <div class="preview-card">
                <div class="preview-header">
                  <span class="preview-icon">{{ formData.icon || "🏆" }}</span>
                  <div class="preview-info">
                    <h4>{{ formData.title || "Título da Conquista" }}</h4>
                    <p>
                      {{ formData.description || "Descrição da conquista" }}
                    </p>
                  </div>
                </div>
                <div class="preview-badges">
                  <span class="badge" :class="formData.category">{{
                    getCategoryText(formData.category)
                  }}</span>
                  <span class="badge" :class="formData.difficulty">{{
                    getDifficultyText(formData.difficulty)
                  }}</span>
                  <span class="badge">{{ formData.points || 0 }} XP</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button @click="closeModal" class="btn-cancel">Cancelar</button>
            <button @click="saveAchievement" class="btn-save">
              {{ isEditing ? "💾 Salvar" : "➕ Criar" }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Notificação -->
    <transition name="fade">
      <div v-if="notification.show" class="notification" :class="notification.type">
        {{ notification.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useConquistasStore } from "../../store/conquistasStore";

export default {
  name: "AchievementsManager",
  setup() {
    // Store
    const conquistasStore = useConquistasStore();

    // Estados
    const showModal = ref(false);
    const isEditing = ref(false);
    const categoryFilter = ref("");
    const currentEditId = ref(null);

    // Usar conquistas da store
    const achievements = computed(() => conquistasStore.conquistas);

    const notification = ref({
      show: false,
      message: "",
      type: "success",
    });

    // Formulário
    const formData = ref({
      achievementId: "",
      title: "",
      description: "",
      icon: "🏆",
      category: "audits",
      difficulty: "easy",
      points: 10,
      criteria: {
        type: "count",
        target: 1,
        description: "",
      },
      sourceField: "contadoresAuditorias.totalGeral",
    });

    // Computed
    const filteredAchievements = computed(() => {
      if (!categoryFilter.value) return achievements.value;
      return achievements.value.filter((a) => a.category === categoryFilter.value);
    });

    // Métodos
    const loadAchievements = async () => {
      try {
        await conquistasStore.carregarConquistas();
        showNotification("Conquistas atualizadas!", "success");
      } catch (error) {
        showNotification("Erro ao atualizar conquistas", "error");
      }
    };

    const getCountByCategory = (category) => {
      return achievements.value.filter((a) => a.category === category).length;
    };

    const getCountByDifficulty = (difficulty) => {
      return achievements.value.filter((a) => a.difficulty === difficulty).length;
    };

    const getCategoryText = (category) => {
      const texts = {
        audits: "Auditorias",
        performance: "Performance",
        consistency: "Consistência",
        participation: "Participação",
      };
      return texts[category] || category;
    };

    const getDifficultyText = (difficulty) => {
      const texts = {
        easy: "Fácil",
        medium: "Média",
        hard: "Difícil",
      };
      return texts[difficulty] || difficulty;
    };

    const getCriteriaTypeText = (type) => {
      const texts = {
        count: "Contagem",
        percentage: "Percentual",
        streak: "Sequência",
      };
      return texts[type] || type;
    };

    const getFilterTitle = () => {
      if (!categoryFilter.value) return "🏆 Todas as Conquistas";
      return `${getCategoryText(categoryFilter.value)}`;
    };

    const openCreateModal = () => {
      isEditing.value = false;
      resetForm();
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      resetForm();
    };

    const resetForm = () => {
      formData.value = {
        achievementId: "",
        title: "",
        description: "",
        icon: "🏆",
        category: "audits",
        difficulty: "easy",
        points: 10,
        criteria: {
          type: "count",
          target: 1,
          description: "",
        },
        sourceField: "contadoresAuditorias.totalGeral",
      };
    };

    const editAchievement = (achievement) => {
      isEditing.value = true;
      currentEditId.value = achievement._id || achievement.achievementId;
      formData.value = {
        ...achievement,
        criteria: { ...achievement.criteria },
      };
      showModal.value = true;
    };

    const duplicateAchievement = (achievement) => {
      isEditing.value = false;
      currentEditId.value = null;
      formData.value = {
        ...achievement,
        _id: undefined,
        achievementId: `${achievement.achievementId}-copy`,
        title: `${achievement.title} (Cópia)`,
        criteria: { ...achievement.criteria },
      };
      showModal.value = true;
    };

    const saveAchievement = async () => {
      if (!formData.value.achievementId || !formData.value.title) {
        showNotification("Preencha os campos obrigatórios!", "error");
        return;
      }

      try {
        if (isEditing.value) {
          // Atualizar conquista existente
          await conquistasStore.atualizarConquista(currentEditId.value, formData.value);
          showNotification("Conquista atualizada com sucesso!", "success");
        } else {
          // Criar nova conquista
          await conquistasStore.criarConquista(formData.value);
          showNotification("Conquista criada com sucesso!", "success");
        }
        closeModal();
      } catch (error) {
        const mensagem = error.response?.data?.erro || "Erro ao salvar conquista";
        showNotification(mensagem, "error");
      }
    };

    const deleteAchievement = async (achievementId) => {
      if (confirm("Tem certeza que deseja deletar esta conquista?")) {
        try {
          await conquistasStore.deletarConquista(achievementId, false); // Soft delete
          showNotification("Conquista desativada com sucesso!", "success");
        } catch (error) {
          showNotification("Erro ao deletar conquista", "error");
        }
      }
    };

    const showNotification = (message, type = "success") => {
      notification.value = { show: true, message, type };
      setTimeout(() => {
        notification.value.show = false;
      }, 3000);
    };

    // Carregar conquistas ao montar componente
    onMounted(async () => {
      await loadAchievements();
    });

    return {
      showModal,
      isEditing,
      categoryFilter,
      achievements,
      filteredAchievements,
      formData,
      notification,
      loadAchievements,
      getCountByCategory,
      getCountByDifficulty,
      getCategoryText,
      getDifficultyText,
      getCriteriaTypeText,
      getFilterTitle,
      openCreateModal,
      closeModal,
      editAchievement,
      duplicateAchievement,
      saveAchievement,
      deleteAchievement,
      loading: computed(() => conquistasStore.loading),
    };
  },
};
</script>

<style scoped>
/* Layout */
.achievements-manager-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  display: grid;
  grid-template-rows: auto 1fr;
}

/* Header */
.achievements-header {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  font-size: 2.5rem;
}

.title-section h1 {
  margin: 0 0 4px 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.title-section p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-refresh,
.btn-create {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-refresh {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-refresh:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.btn-create {
  background: white;
  color: #667eea;
}

.btn-create:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Main Content */
.main-content-wrapper {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  min-height: calc(100vh - 100px);
}

.area-left {
  background: white;
  padding: 24px;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
}

.area-right {
  background: #f8f9fa;
  padding: 24px;
  overflow-y: auto;
}

/* Filtros */
.filter-section,
.stats-section {
  margin-bottom: 24px;
}

.filter-section h3,
.stats-section h3 {
  margin: 0 0 12px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.filter-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-btn {
  padding: 10px 14px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-btn:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: #f59e0b;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat-card {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: #667eea;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 4px;
}

/* Content Header */
.content-header {
  margin-bottom: 20px;
}

.content-header h2 {
  margin: 0 0 4px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.content-header p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Achievements List */
.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.achievement-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.achievement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.achievement-card.difficulty-easy {
  border-left-color: #22c55e;
}

.achievement-card.difficulty-medium {
  border-left-color: #eab308;
}

.achievement-card.difficulty-hard {
  border-left-color: #ef4444;
}

.achievement-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.achievement-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.achievement-info {
  flex: 1;
}

.achievement-info h3 {
  margin: 0 0 4px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.achievement-id {
  margin: 0;
  font-size: 0.75rem;
  color: #6c757d;
  font-family: "Courier New", monospace;
}

.achievement-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-category.audits {
  background: #dbeafe;
  color: #1e40af;
}

.badge-category.performance {
  background: #e0e7ff;
  color: #4338ca;
}

.badge-category.consistency {
  background: #fce7f3;
  color: #be185d;
}

.badge-category.participation {
  background: #d1fae5;
  color: #065f46;
}

.badge-difficulty.easy {
  background: #dcfce7;
  color: #16a34a;
}

.badge-difficulty.medium {
  background: #fef3c7;
  color: #ca8a04;
}

.badge-difficulty.hard {
  background: #fee2e2;
  color: #dc2626;
}

.badge-points {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.achievement-description {
  margin-bottom: 16px;
}

.achievement-description p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}

.achievement-criteria {
  background: #f8f9fa;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.achievement-criteria h4 {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
}

.criteria-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 10px;
}

.criteria-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.criteria-label {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
}

.criteria-value {
  font-size: 0.85rem;
  color: #2c3e50;
  font-weight: 600;
}

.criteria-value.source-field {
  font-family: "Courier New", monospace;
  color: #059669;
  font-size: 0.8rem;
}

.criteria-description {
  margin: 8px 0 0 0;
  padding-top: 8px;
  border-top: 1px solid #e9ecef;
  font-size: 0.85rem;
  color: #6c757d;
  font-style: italic;
}

.achievement-actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background: #dbeafe;
  color: #1e40af;
}

.btn-edit:hover {
  background: #bfdbfe;
  transform: translateY(-1px);
}

.btn-duplicate {
  background: #e0e7ff;
  color: #4338ca;
}

.btn-duplicate:hover {
  background: #c7d2fe;
  transform: translateY(-1px);
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fecaca;
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #495057;
  font-size: 1.3rem;
}

.empty-state p {
  margin: 0 0 20px 0;
}

.btn-create-empty {
  padding: 12px 24px;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-create-empty:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 24px;
  border-bottom: 2px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.btn-close {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #fecaca;
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section h3 {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

.form-group small {
  font-size: 0.75rem;
  color: #6c757d;
}

.form-input,
.form-select,
.form-textarea {
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.icon-input {
  text-align: center;
  font-size: 1.5rem;
}

.field-hint {
  display: block;
  margin-top: 6px;
  padding: 8px;
  background: #eef2ff;
  border-left: 3px solid #667eea;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #92400e;
}

.preview-section {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
}

.preview-card {
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 2px solid #e9ecef;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.preview-icon {
  font-size: 2rem;
}

.preview-info h4 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.preview-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #6c757d;
}

.preview-badges {
  display: flex;
  gap: 6px;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 2px solid #e9ecef;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
  background: white;
}

.btn-cancel,
.btn-save {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-cancel {
  background: #e9ecef;
  color: #495057;
}

.btn-cancel:hover {
  background: #dee2e6;
}

.btn-save {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
}

/* Notificação */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 2000;
}

.notification.success {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.notification.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content-wrapper {
    grid-template-columns: 250px 1fr;
  }

  .criteria-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content-wrapper {
    grid-template-columns: 1fr;
  }

  .area-left {
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-container {
    max-width: 100%;
    border-radius: 0;
  }
}
</style>
