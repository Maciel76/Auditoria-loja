<template>
  <div class="hero-section">
    <!-- Elementos decorativos de fundo -->
    <div class="decoration-circle hero-circle-1"></div>
    <div class="decoration-circle hero-circle-2"></div>
    <div class="decoration-circle hero-circle-3"></div>
    <div class="decoration-circle hero-circle-4"></div>
    <div class="decoration-circle hero-circle-5"></div>
    <div class="decoration-circle hero-circle-6"></div>

    <div class="hero-content">
      <div class="hero-text">
        <h1>
          Transforme auditorias em
          <span class="highlight">Analise Visual inteligente</span>
        </h1>
        <p class="hero-subtitle">
          Sistema de auditoria colaborativa onde sua voz faz a diferença
        </p>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">+120</span>
            <span class="stat-label">Auditorias Concluídas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">+45</span>
            <span class="stat-label">usuários ativos esta semana</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">10</span>
            <span class="stat-label">Lojas Implementadas</span>
          </div>
        </div>

        <div class="hero-actions">
          <button class="btn-primary" @click="$emit('start-audit')">
            <i class="fas fa-search"></i>
            🔍 Começar Auditoria
          </button>
          <button class="btn-secondary" @click="openSuggestionModal">
            <i class="fas fa-lightbulb"></i>
            💡 Enviar Sugestão
          </button>
        </div>
      </div>

      <div class="hero-visual">
        <div class="floating-card card-1">
          <i class="fas fa-chart-line"></i>
          <span>Media Regional +16%</span>
        </div>
        <div class="floating-card card-2">
          <i class="fas fa-users"></i>
          <span>Loja em destaque</span>
          <img src="../../assets/svg/grafico.svg" alt="" />
        </div>
        <div class="floating-card card-3">
          <i class="fas fa-trophy"></i>
          <span>Colaborador em Destaque</span>
        </div>
      </div>
    </div>

    <!-- Modal de Sugestões -->
    <div
      v-if="showSuggestionModal"
      class="modal-overlay"
      @click="closeSuggestionModal"
    >
      <div class="suggestion-modal" @click.stop>
        <div class="modal-header">
          <h2>💡 Deixe sua Sugestão</h2>
          <button class="close-btn" @click="closeSuggestionModal">×</button>
        </div>

        <div class="modal-content">
          <p class="modal-description">
            Sua opinião é muito importante! Compartilhe suas ideias para
            melhorarmos o sistema de auditorias.
          </p>

          <div class="form-group">
            <label for="email">Email (opcional)</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="suggestion">Sua Sugestão *</label>
            <textarea
              id="suggestion"
              v-model="suggestion"
              placeholder="Descreva sua sugestão de melhoria para o sistema..."
              class="form-textarea"
              rows="5"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeSuggestionModal">
            Cancelar
          </button>
          <button
            class="btn-submit"
            @click="submitSuggestion"
            :disabled="isSubmitting"
          >
            <span class="btn-icon">📤</span>
            {{ isSubmitting ? "Enviando..." : "Enviar Sugestão" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineEmits(["start-audit"]);

// Estados reativos
const showSuggestionModal = ref(false);
const suggestion = ref("");
const email = ref("");
const isSubmitting = ref(false);

// Métodos
const openSuggestionModal = () => {
  showSuggestionModal.value = true;
};

const closeSuggestionModal = () => {
  showSuggestionModal.value = false;
  suggestion.value = "";
  email.value = "";
  isSubmitting.value = false;
};

const submitSuggestion = async () => {
  if (!suggestion.value.trim()) {
    alert("Por favor, digite sua sugestão");
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch("http://localhost:3000/api/sugestoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sugestao: suggestion.value,
        email: email.value || null,
        tipo: "hero-section",
        data_criacao: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      alert("Sugestão enviada com sucesso! Obrigado pelo feedback.");
      closeSuggestionModal();
    } else {
      throw new Error("Erro ao enviar sugestão");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao enviar sugestão. Tente novamente.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text h1 {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.highlight {
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #fbbf24;
  color: #1a202c;
}

.btn-primary:hover {
  background: #f59e0b;
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.hero-visual {
  position: relative;
  height: 300px;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  animation: float 3s ease-in-out infinite;
}

.card-1 {
  top: 20px;
  left: 0;
  animation-delay: 0s;
}

.card-2 {
  top: 100px;
  right: 0;
  animation-delay: 1s;
}

.card-3 {
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 2s;
}

/* Elementos decorativos de fundo */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: floatBackground 6s ease-in-out infinite;
}

.hero-circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -50px;
  animation-delay: 0s;
}

.hero-circle-2 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: -40px;
  animation-delay: 1s;
}

.hero-circle-3 {
  width: 100px;
  height: 100px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.hero-circle-4 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 10%;
  animation-delay: 3s;
}

.hero-circle-5 {
  width: 60px;
  height: 60px;
  top: 60%;
  left: 5%;
  animation-delay: 4s;
}

.hero-circle-6 {
  width: 90px;
  height: 90px;
  top: 10%;
  left: 20%;
  animation-delay: 5s;
}

@keyframes floatBackground {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-actions {
    justify-content: center;
  }

  /* Esconde algumas bolinhas em mobile para não poluir */
  .hero-circle-3,
  .hero-circle-4,
  .hero-circle-5,
  .hero-circle-6 {
    display: none;
  }
}

/* Estilos do Modal de Sugestões */
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
  backdrop-filter: blur(4px);
}

.suggestion-modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 20px 20px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-content {
  padding: 30px 24px;
}

.modal-description {
  color: #64748b;
  margin-bottom: 24px;
  line-height: 1.6;
  text-align: center;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  resize: none;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  min-height: 120px;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cancel {
  background: #e2e8f0;
  color: #64748b;
}

.btn-cancel:hover {
  background: #cbd5e1;
  transform: translateY(-1px);
}

.btn-submit {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 1rem;
}

/* Responsividade do Modal */
@media (max-width: 768px) {
  .suggestion-modal {
    width: 95%;
    margin: 20px;
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 20px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
