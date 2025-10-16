<template>
  <div class="post-form-expandable">
    <!-- Botão inicial -->
    <div v-if="!isExpanded" class="expand-button-container">
      <button @click="expandForm" class="expand-button" :disabled="loading">
        <span class="button-icon">📝</span>
        <span class="button-text">Criar Nova Postagem</span>
      </button>
    </div>

    <!-- Formulário expandido -->
    <div v-else class="post-form-container">
      <div class="post-form-card">
        <div class="form-header">
          <h3>📝 Criar Nova Postagem</h3>
          <p>Compartilhe suas ideias e sugestões com a comunidade!</p>
          <button
            class="close-button"
            @click="collapseForm"
            :disabled="loading"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="submitPost" class="post-form">
          <div class="form-group">
            <label for="title">Título da Postagem</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              placeholder="Digite o título da sua postagem..."
              :disabled="loading"
              required
            />
          </div>

          <div class="form-group">
            <label for="content">Conteúdo</label>
            <textarea
              id="content"
              v-model="form.content"
              placeholder="Descreva sua ideia, sugestão ou pensamento..."
              rows="4"
              :disabled="loading"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="type">Categoria da Postagem</label>
            <select id="type" v-model="form.type" :disabled="loading">
              <option value="geral">💡 Geral</option>
              <option value="dashboard">📊 Dashboard</option>
              <option value="ranking">🏆 Ranking</option>
              <option value="auditoria">🔍 Auditoria</option>
              <option value="relatorios">📋 Relatórios</option>
            </select>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="resetForm"
              class="btn-secondary"
              :disabled="loading"
            >
              Limpar
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading">⏳ Postando...</span>
              <span v-else>📤 Publicar</span>
            </button>
          </div>
        </form>

        <!-- Feedback messages -->
        <div v-if="message.text" :class="['message', message.type]">
          {{ message.text }}
        </div>
      </div>

      <!-- Preview da postagem -->
      <div v-if="isFormValid" class="post-preview">
        <h4>👁️ Prévia da Postagem</h4>
        <div class="preview-card">
          <div class="preview-header">
            <span class="preview-type"
              >{{ getTypeIcon(form.type) }} {{ getTypeLabel(form.type) }}</span
            >
            <span class="preview-time">Agora</span>
          </div>
          <h5>{{ form.title }}</h5>
          <p>{{ form.content }}</p>
          <div class="preview-actions">
            <button class="preview-btn">👍 0</button>
            <button class="preview-btn">👎 0</button>
            <button class="preview-btn">🔥 0</button>
            <button class="preview-btn">💚 0</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useDashboardStore } from "@/store/dashboardStore";

export default {
  name: "PostFormExpandable",
  emits: ["post-created"],
  setup(props, { emit }) {
    const dashboardStore = useDashboardStore();

    const isExpanded = ref(false);
    const form = ref({
      title: "",
      content: "",
      type: "geral",
    });

    const loading = ref(false);
    const message = ref({
      text: "",
      type: "",
    });

    const isFormValid = computed(() => {
      return (
        form.value.title.trim() &&
        form.value.content.trim() &&
        form.value.title.length >= 5 &&
        form.value.content.length >= 10
      );
    });

    const getTypeIcon = (type) => {
      const icons = {
        geral: "💡",
        dashboard: "📊",
        ranking: "🏆",
        auditoria: "🔍",
        relatorios: "📋",
      };
      return icons[type] || "💡";
    };

    const getTypeLabel = (type) => {
      const labels = {
        geral: "Geral",
        dashboard: "Dashboard",
        ranking: "Ranking",
        auditoria: "Auditoria",
        relatorios: "Relatórios",
      };
      return labels[type] || "Geral";
    };

    const showMessage = (text, type = "success") => {
      message.value = { text, type };
      setTimeout(() => {
        message.value = { text: "", type: "" };
      }, 4000);
    };

    const resetForm = () => {
      form.value = {
        title: "",
        content: "",
        type: "geral",
      };
      message.value = { text: "", type: "" };
    };

    const expandForm = () => {
      isExpanded.value = true;
    };

    const collapseForm = () => {
      isExpanded.value = false;
      resetForm();
    };

    const submitPost = async () => {
      if (!isFormValid.value) return;

      loading.value = true;

      try {
        // Criar o texto completo da sugestão
        const fullSuggestion = `${form.value.title}\n\n${form.value.content}`;

        // Usar o método do dashboardStore
        // Criar postagem com o tipo correto
        const result = await dashboardStore.submitSuggestion(fullSuggestion, form.value.type);

        if (result.success) {
          showMessage("✅ Postagem criada com sucesso!", "success");

          // Emitir evento para o componente pai
          emit("post-created", {
            title: form.value.title,
            content: form.value.content,
            type: form.value.type,
          });

          // Resetar formulário após sucesso
          setTimeout(() => {
            resetForm();
            collapseForm();
          }, 1500);
        } else {
          showMessage("❌ Erro ao criar postagem. Tente novamente.", "error");
        }
      } catch (error) {
        console.error("Erro ao submeter postagem:", error);
        showMessage("❌ Erro interno. Tente novamente.", "error");
      } finally {
        loading.value = false;
      }
    };

    return {
      isExpanded,
      form,
      loading,
      message,
      isFormValid,
      getTypeIcon,
      getTypeLabel,
      resetForm,
      expandForm,
      collapseForm,
      submitPost,
    };
  },
};
</script>

<style scoped>
.post-form-expandable {
  max-width: 1200px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.expand-button-container {
  display: flex;

  margin: 1rem 0;
}

.expand-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.expand-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
}

.expand-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-icon {
  font-size: 1.3rem;
}

.post-form-container {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  animation: expand 0.3s ease-out;
}

@keyframes expand {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-form-card {
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.form-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
}

.form-header p {
  margin: 0;
  color: #4a5568;
  font-size: 1.1rem;
}

.close-button {
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.close-button:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  font-size: 1rem;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #2d3748;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #a0aec0;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.form-group input:disabled,
.form-group textarea:disabled,
.form-group select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-group select option {
  background: white;
  color: #2d3748;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: none;
}

.btn-primary {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.6);
}

.btn-primary:disabled {
  background: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  text-align: center;
}

.message.success {
  background: rgba(40, 167, 69, 0.3);
  border: 2px solid rgba(40, 167, 69, 0.5);
}

.message.error {
  background: rgba(220, 53, 69, 0.3);
  border: 2px solid rgba(220, 53, 69, 0.5);
}

.post-preview {
  flex: 0 0 350px;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  height: fit-content;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.post-preview h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
}

.preview-card {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  background: #f8f9fa;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.preview-type {
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
}

.preview-time {
  color: #6c757d;
}

.preview-card h5 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.preview-card p {
  margin: 0 0 1rem 0;
  color: #555;
  line-height: 1.5;
}

.preview-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preview-btn {
  padding: 0.25rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: white;
  color: #667eea;
  font-size: 0.8rem;
  cursor: default;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .post-form-container {
    flex-direction: column;
    padding: 0.5rem;
  }

  .post-preview {
    flex: none;
  }

  .form-actions {
    flex-direction: column;
  }

  .expand-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
