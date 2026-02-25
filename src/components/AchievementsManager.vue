<template>
  <div class="achievements-manager">
    <div class="manager-header">
      <h2>🏆 Gerenciamento de Conquistas</h2>
      <p>Edite nomes, raridades e pontos das conquistas</p>
    </div>

    <div class="achievements-list">
      <div 
        v-for="achievement in achievements" 
        :key="achievement.achievementId" 
        class="achievement-card"
      >
        <div class="achievement-header">
          <div class="achievement-icon">{{ achievement.achievementData?.icon || '🎁' }}</div>
          <div class="achievement-info">
            <h3>{{ achievement.achievementData?.title || achievement.achievementId }}</h3>
            <p>{{ achievement.achievementData?.description || 'Descrição não disponível' }}</p>
          </div>
        </div>

        <div class="achievement-details">
          <div class="detail-item">
            <label>ID:</label>
            <span>{{ achievement.achievementId }}</span>
          </div>
          
          <div class="detail-item">
            <label>Categoria:</label>
            <span>{{ achievement.achievementData?.category || 'N/A' }}</span>
          </div>
          
          <div class="detail-item">
            <label>Dificuldade:</label>
            <span>{{ achievement.achievementData?.difficulty || 'N/A' }}</span>
          </div>
        </div>

        <div class="achievement-stats">
          <div class="stat-item">
            <label>Target:</label>
            <span>{{ achievement.progress?.target || 0 }}</span>
          </div>
          
          <div class="stat-item">
            <label>Tipo:</label>
            <span>{{ achievement.achievementData?.criteria?.type || 'N/A' }}</span>
          </div>
        </div>

        <div class="achievement-edit">
          <div class="form-group">
            <label>Nome:</label>
            <input 
              v-model="achievement.editTitle" 
              type="text" 
              class="form-control"
              :placeholder="achievement.achievementData?.title || 'Digite o nome'"
            />
          </div>

          <div class="form-group">
            <label>Descrição:</label>
            <input 
              v-model="achievement.editDescription" 
              type="text" 
              class="form-control"
              :placeholder="achievement.achievementData?.description || 'Digite a descrição'"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Pontos:</label>
              <input 
                v-model.number="achievement.editPoints" 
                type="number" 
                class="form-control"
                min="0"
                :placeholder="achievement.achievementData?.points || 0"
              />
            </div>

            <div class="form-group">
              <label>Raridade:</label>
              <select 
                v-model="achievement.editRarity" 
                class="form-control"
              >
                <option value="Basica">Básica</option>
                <option value="Comum">Comum</option>
                <option value="Raro">Raro</option>
                <option value="Epico">Épico</option>
                <option value="Lendario">Lendário</option>
                <option value="Diamante">Diamante</option>
                <option value="Especial">Especial</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Ícone:</label>
            <input 
              v-model="achievement.editIcon" 
              type="text" 
              class="form-control"
              :placeholder="achievement.achievementData?.icon || 'Digite o ícone'"
            />
          </div>
        </div>

        <div class="achievement-actions">
          <button 
            @click="updateAchievement(achievement)" 
            class="btn-save"
            :disabled="isUpdating"
          >
            {{ isUpdating ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Carregando conquistas...</p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import api from '@/config/api';

export default {
  name: 'AchievementsManager',
  data() {
    return {
      achievements: [],
      loading: false,
      error: null,
      isUpdating: false,
    };
  },
  async mounted() {
    await this.loadAchievements();
  },
  methods: {
    async loadAchievements() {
      this.loading = true;
      this.error = null;
      
      try {
        // Primeiro, vamos buscar as conquistas do modelo MetricasUsuario
        // Como não temos um endpoint específico para isso, vamos simular
        // com base nas conquistas que sabemos que existem
        
        // Simulando dados com base no modelo MetricasUsuario
        const mockAchievements = [
          {
            achievementId: "first-audit",
            achievementData: {
              title: "Primeira Auditoria",
              description: "Concluiu sua primeira auditoria",
              icon: "🔍",
              category: "audits",
              difficulty: "easy",
              rarity: "Basica",
              points: 10,
              criteria: { type: "count", target: 1, description: "Realizar 1 auditoria atualizada" },
            },
            progress: { target: 1 },
            editTitle: "Primeira Auditoria",
            editDescription: "Concluiu sua primeira auditoria",
            editPoints: 10,
            editRarity: "Basica",
            editIcon: "🔍",
          },
          {
            achievementId: "audit-enthusiast",
            achievementData: {
              title: "Entusiasta de Auditoria",
              description: "Concluiu 5 auditorias atualizadas",
              icon: "📊",
              category: "audits",
              difficulty: "medium",
              rarity: "Raro",
              points: 150,
              criteria: { type: "count", target: 5, description: "Realizar 5 auditorias atualizadas" },
            },
            progress: { target: 5 },
            editTitle: "Entusiasta de Auditoria",
            editDescription: "Concluiu 5 auditorias atualizadas",
            editPoints: 150,
            editRarity: "Raro",
            editIcon: "📊",
          },
          {
            achievementId: "audit-master",
            achievementData: {
              title: "Mestre de Auditoria",
              description: "Concluiu 10 auditorias atualizadas",
              icon: "🏆",
              category: "audits",
              difficulty: "hard",
              rarity: "Epico",
              points: 1500,
              criteria: { type: "count", target: 10, description: "Realizar 10 auditorias atualizadas" },
            },
            progress: { target: 10 },
            editTitle: "Mestre de Auditoria",
            editDescription: "Concluiu 10 auditorias atualizadas",
            editPoints: 1500,
            editRarity: "Epico",
            editIcon: "🏆",
          },
          {
            achievementId: "consistent-auditor",
            achievementData: {
              title: "Auditor Consistente",
              description: "Realizou 20 auditorias atualizadas",
              icon: "📅",
              category: "consistency",
              difficulty: "hard",
              rarity: "Lendario",
              points: 5000,
              criteria: { type: "count", target: 20, description: "Realizar 20 auditorias atualizadas" },
            },
            progress: { target: 20 },
            editTitle: "Auditor Consistente",
            editDescription: "Realizou 20 auditorias atualizadas",
            editPoints: 5000,
            editRarity: "Lendario",
            editIcon: "📅",
          },
          {
            achievementId: "weekly-warrior",
            achievementData: {
              title: "Mestre das Auditorias",
              description: "Realizou 50 auditorias atualizadas",
              icon: "👑",
              category: "performance",
              difficulty: "very-hard",
              rarity: "Diamante",
              points: 25000,
              criteria: { type: "count", target: 50, description: "Realizar 50 auditorias atualizadas" },
            },
            progress: { target: 50 },
            editTitle: "Mestre das Auditorias",
            editDescription: "Realizou 50 auditorias atualizadas",
            editPoints: 25000,
            editRarity: "Diamante",
            editIcon: "👑",
          },
          {
            achievementId: "item-collector-100",
            achievementData: {
              title: "Colecionador",
              description: "Leu 100 itens",
              icon: "💯",
              category: "performance",
              difficulty: "easy",
              rarity: "Basica",
              points: 15,
              criteria: { type: "count", target: 100, description: "Ler 100 itens" },
            },
            progress: { target: 100 },
            editTitle: "Colecionador",
            editDescription: "Leu 100 itens",
            editPoints: 15,
            editRarity: "Basica",
            editIcon: "💯",
          },
          {
            achievementId: "item-collector-500",
            achievementData: {
              title: "Meta Batida",
              description: "Leu 500 itens",
              icon: "🎯",
              category: "performance",
              difficulty: "medium",
              rarity: "Comum",
              points: 50,
              criteria: { type: "count", target: 500, description: "Ler 500 itens" },
            },
            progress: { target: 500 },
            editTitle: "Meta Batida",
            editDescription: "Leu 500 itens",
            editPoints: 50,
            editRarity: "Comum",
            editIcon: "🎯",
          },
          {
            achievementId: "item-collector-1000",
            achievementData: {
              title: "Maratona",
              description: "Leu 1000 itens",
              icon: "🏅",
              category: "performance",
              difficulty: "hard",
              rarity: "Raro",
              points: 100,
              criteria: { type: "count", target: 1000, description: "Ler 1000 itens" },
            },
            progress: { target: 1000 },
            editTitle: "Maratona",
            editDescription: "Leu 1000 itens",
            editPoints: 100,
            editRarity: "Raro",
            editIcon: "🏅",
          },
          {
            achievementId: "perfect-accuracy",
            achievementData: {
              title: "Precisão Perfeita",
              description: "Manteve 95% de precisão",
              icon: "🎯",
              category: "performance",
              difficulty: "hard",
              rarity: "Epico",
              points: 40,
              criteria: { type: "percentage", target: 95, description: "Manter 95% de precisão" },
            },
            progress: { target: 95 },
            editTitle: "Precisão Perfeita",
            editDescription: "Manteve 95% de precisão",
            editPoints: 40,
            editRarity: "Epico",
            editIcon: "🎯",
          },
          {
            achievementId: "team-player",
            achievementData: {
              title: "Jogador de Equipe",
              description: "Trabalhou em 3 setores diferentes",
              icon: "🤝",
              category: "participation",
              difficulty: "medium",
              rarity: "Comum",
              points: 20,
              criteria: { type: "count", target: 3, description: "Trabalhar em 3 setores diferentes" },
            },
            progress: { target: 3 },
            editTitle: "Jogador de Equipe",
            editDescription: "Trabalhou em 3 setores diferentes",
            editPoints: 20,
            editRarity: "Comum",
            editIcon: "🤝",
          }
        ];

        this.achievements = mockAchievements;
      } catch (error) {
        console.error('Erro ao carregar conquistas:', error);
        this.error = 'Erro ao carregar conquistas: ' + error.message;
      } finally {
        this.loading = false;
      }
    },
    
    async updateAchievement(achievement) {
      this.isUpdating = true;
      
      try {
        // Aqui faríamos a atualização real no backend
        // Por enquanto, vamos apenas atualizar localmente
        
        // Atualizar os dados editáveis
        achievement.achievementData.title = achievement.editTitle;
        achievement.achievementData.description = achievement.editDescription;
        achievement.achievementData.points = achievement.editPoints;
        achievement.achievementData.rarity = achievement.editRarity;
        achievement.achievementData.icon = achievement.editIcon;
        
        // Simular requisição de atualização
        await new Promise(resolve => setTimeout(resolve, 500));
        
        alert(`Conquista "${achievement.editTitle}" atualizada com sucesso!`);
      } catch (error) {
        console.error('Erro ao atualizar conquista:', error);
        alert('Erro ao atualizar conquista: ' + error.message);
      } finally {
        this.isUpdating = false;
      }
    }
  }
};
</script>

<style scoped>
.achievements-manager {
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.manager-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.manager-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.manager-header p {
  margin: 0;
  color: #6c757d;
  font-size: 0.95rem;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.achievement-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.achievement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.achievement-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.achievement-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.achievement-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.achievement-info p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.achievement-details,
.achievement-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.detail-item,
.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item label,
.stat-item label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
}

.detail-item span,
.stat-item span {
  font-size: 0.9rem;
  color: #6c757d;
}

.achievement-edit {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f1f3f5;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.achievement-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-save {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #3a0ca3, #4361ee);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f8f9fa;
  border-top: 4px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin-top: 1rem;
}
</style>