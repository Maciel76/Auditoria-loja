<template>
  <div class="dashboard-dev-container">
    <!-- Header com gradiente igual ao resto do site -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-title">
          <div class="title-icon">🚧</div>
          <div class="title-section">
            <h1>Dashboard em Desenvolvimento</h1>
            <p>Estamos criando uma experiência incrível para você!</p>
          </div>
        </div>
      </div>
    </div>

    <div class="dev-notice-card">
      <div class="construction-animation">
        <div class="construction-icon">📊</div>
        <div class="pulse"></div>
      </div>

      <div class="message-box">
        <p class="message">
          Em desenvolvimento - estou pensando ainda no que colocar aqui.
          <br /><br />
          Visite o perfil das lojas - o dashboard e análise gráfica por loja já
          está implementado em cada perfil das lojas.
        </p>
      </div>

      <div class="features-preview">
        <h3>O que estamos preparando:</h3>
        <div class="features-grid">
          <div class="feature-item">
            <i class="fas fa-chart-line"></i>
            <span>Análises Gráficas Avançadas</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-store"></i>
            <span>Comparativo entre Lojas</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-bell"></i>
            <span>Alertas Inteligentes</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-rocket"></i>
            <span>Relatórios Automatizados</span>
          </div>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-info">
          <span>Progresso do desenvolvimento</span>
          <span>{{ progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn-primary" @click="visitStores">
          <span class="btn-icon">🏪</span>
          Explorar Perfil das Lojas
        </button>
        <button class="btn-secondary" @click="goToDashboardViews">
          <span class="btn-icon">📊</span>
          Ver Dashboard Atual
        </button>
        <button class="btn-outline" @click="notifyMe">
          <span class="btn-icon">💡</span>
          Deixe sua Sugestão
        </button>
      </div>

      <div class="contact-info">
        <p>Precisa de ajuda agora? <a href="#">Entre em contato conosco</a></p>
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
            melhorarmos esse sistema.
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
              placeholder="Descreva sua sugestão de melhoria para o dashboard..."
              class="form-textarea"
              rows="5"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeSuggestionModal">
            Cancelar
          </button>
          <button class="btn-submit" @click="submitSuggestion">
            <span class="btn-icon">📤</span>
            Enviar Sugestão
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardDevNotice",
  data() {
    return {
      progress: 35,
      showSuggestionModal: false,
      suggestion: "",
      email: "",
    };
  },
  methods: {
    visitStores() {
      // Redirecionar para a loja selecionada
      this.$router.push("/");
    },
    goToDashboardViews() {
      // Ir para ranking de lojas
      this.$router.push("/ranking-lojas");
    },
    notifyMe() {
      // Abrir modal de sugestões
      this.showSuggestionModal = true;
    },
    async submitSuggestion() {
      if (!this.suggestion.trim()) {
        alert("Por favor, digite sua sugestão");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/sugestoes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sugestao: this.suggestion,
            email: this.email || null,
            tipo: "dashboard",
            data_criacao: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          alert("Sugestão enviada com sucesso! Obrigado pelo feedback.");
          this.suggestion = "";
          this.email = "";
          this.showSuggestionModal = false;
        } else {
          throw new Error("Erro ao enviar sugestão");
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao enviar sugestão. Tente novamente.");
      }
    },
    closeSuggestionModal() {
      this.showSuggestionModal = false;
      this.suggestion = "";
      this.email = "";
    },
  },
};
</script>

<style scoped>
.dashboard-dev-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Header igual ao resto do site */
.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  max-width: 1200px;
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
  letter-spacing: -0.5px;
}

.title-section p {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.dev-notice-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  width: 100%;
  margin: 40px auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.construction-animation {
  position: relative;
  margin: 0 auto 30px;
  width: 120px;
  height: 120px;
}

.construction-icon {
  font-size: 60px;
  color: #4361ee;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(67, 97, 238, 0.1);
  border-radius: 50%;
  animation: bounce 2s infinite;
}

.pulse {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid #4361ee;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.message-box {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-left: 4px solid #4361ee;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.message-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4361ee, #764ba2);
}

.message {
  color: #2c3e50;
  line-height: 1.6;
  font-size: 1rem;
  margin: 0;
}

.features-preview {
  margin-bottom: 30px;
  text-align: left;
}

.features-preview h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
  font-weight: 600;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(
    135deg,
    rgba(67, 97, 238, 0.1),
    rgba(102, 126, 234, 0.05)
  );
  border-radius: 12px;
  color: #4361ee;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(67, 97, 238, 0.1);
}

.feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
  background: linear-gradient(
    135deg,
    rgba(67, 97, 238, 0.15),
    rgba(102, 126, 234, 0.08)
  );
}

.feature-item span {
  font-size: 1.2rem;
}

.progress-section {
  margin-bottom: 30px;
  text-align: left;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #555;
  font-size: 0.9rem;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4361ee, #764ba2);
  border-radius: 4px;
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.btn-primary,
.btn-secondary,
.btn-outline {
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #4361ee, #764ba2);
  color: white;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(67, 97, 238, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.btn-secondary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(72, 187, 120, 0.4);
}

.btn-outline {
  background: transparent;
  color: #4361ee;
  border: 2px solid #4361ee;
}

.btn-outline:hover {
  background: rgba(67, 97, 238, 0.1);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
}

.contact-info {
  color: #546e7a;
  font-size: 0.9rem;
  text-align: center;
  padding: 20px;
  background: rgba(67, 97, 238, 0.05);
  border-radius: 12px;
  margin-top: 20px;
}

.contact-info a {
  color: #4361ee;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.contact-info a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Responsividade */
@media (max-width: 768px) {
  .dashboard-header {
    padding: 20px;
  }

  .header-title {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .title-icon {
    font-size: 2rem;
  }

  .title-section h1 {
    font-size: 1.5rem;
  }

  .dev-notice-card {
    margin: 20px;
    padding: 30px 20px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    gap: 12px;
  }

  .btn-primary,
  .btn-secondary,
  .btn-outline {
    padding: 12px 20px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .construction-animation {
    width: 100px;
    height: 100px;
  }

  .construction-icon {
    font-size: 50px;
  }

  .features-grid {
    gap: 12px;
  }

  .feature-item {
    padding: 12px;
    font-size: 0.9rem;
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
  background: linear-gradient(135deg, #4361ee, #764ba2);
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
  color: #546e7a;
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
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  resize: none;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.form-textarea {
  min-height: 120px;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
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
  background: #e9ecef;
  color: #546e7a;
}

.btn-cancel:hover {
  background: #dee2e6;
  transform: translateY(-1px);
}

.btn-submit {
  background: linear-gradient(135deg, #4361ee, #764ba2);
  color: white;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(67, 97, 238, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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
