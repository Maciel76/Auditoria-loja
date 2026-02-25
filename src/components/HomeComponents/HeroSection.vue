<template>
  <div class="hero-section">
    <!-- Elementos decorativos de fundo -->
    <div class="decoration-circle hero-circle-1"></div>
    <div class="decoration-circle hero-circle-2"></div>
    <div class="decoration-circle hero-circle-3"></div>
    <div class="decoration-circle hero-circle-4"></div>
    <div class="decoration-circle hero-circle-5"></div>
    <div class="decoration-circle hero-circle-6"></div>
    <div class="decoration-circle hero-circle-7"></div>
    <div class="decoration-circle hero-circle-8"></div>

    <div class="hero-content">
      <div class="hero-text">
        <h1>
          Fique Por Dentro Das Ultimas
          <span class="highlight">Novidades </span>
        </h1>
        <p class="hero-subtitle">
          Interaja Com a Comunidades, Crie Postagem, Envia Sugestões de
          Melhorias <br />
          Crie Avisos, Inicia Votação, e Muito Mais
        </p>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">+120</span>
            <span class="stat-label">Auditorias Concluídas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">+45</span>
            <span class="stat-label">usuários ativos </span>
          </div>
          <div class="stat-item">
            <span class="stat-number">+10</span>
            <span class="stat-label">Lojas Implementadas</span>
          </div>
        </div>

        <!-- Botões Desktop (4 botões separados) -->
        <div class="hero-actions desktop-only">
          <button class="btn-primary" @click="openPostModal">
            📝 Criar Nova Postagem
          </button>
          <button class="btn-secondary" @click="openSuggestionModal">
            💡 Enviar Sugestão
          </button>
          <button class="btn-secondary" @click="openNoticeModal">
            ⚠️ Novo Aviso
          </button>
          <button class="btn-secondary" @click="openVotingModal">
            🚀 Nova Votação
          </button>
        </div>

        <!-- Floating Action Button Mobile -->
        <div class="fab-container mobile-only">
          <!-- Botões do Menu (aparecem quando expandido) -->
          <transition-group name="fab-item" tag="div" class="fab-menu">
            <button
              v-if="fabMenuOpen"
              key="post"
              class="fab-menu-item"
              @click="openPostModal"
            >
              <span class="fab-icon">📝</span>
              <span class="fab-label">Nova Postagem</span>
            </button>
            <button
              v-if="fabMenuOpen"
              key="suggestion"
              class="fab-menu-item"
              @click="openSuggestionModal"
            >
              <span class="fab-icon">💡</span>
              <span class="fab-label">Enviar Sugestão</span>
            </button>
            <button
              v-if="fabMenuOpen"
              key="notice"
              class="fab-menu-item"
              @click="openNoticeModal"
            >
              <span class="fab-icon">⚠️</span>
              <span class="fab-label">Novo Aviso</span>
            </button>
            <button
              v-if="fabMenuOpen"
              key="voting"
              class="fab-menu-item"
              @click="openVotingModal"
            >
              <span class="fab-icon">🚀</span>
              <span class="fab-label">Nova Votação</span>
            </button>
          </transition-group>

          <!-- Botão Principal FAB -->
          <button
            class="fab-main"
            :class="{ active: fabMenuOpen }"
            @click="toggleFabMenu"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>

      <div class="hero-visual">
        <div class="floating-card card-1">
          <span>✨ Transforme Dados em Resultados</span>
        </div>
        <div class="floating-card card-2">
          <span>💡 Sua Ideia Pode Mudar Tudo</span>
        </div>
        <div class="floating-card card-3">
          <span>🌟 Juntos Somos Mais Fortes</span>
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
            <label for="nome">Nome (opcional)</label>
            <input
              id="nome"
              v-model="nome"
              type="text"
              placeholder="Seu nome"
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

    <!-- Modal de Nova Postagem -->
    <div v-if="showPostModal" class="modal-overlay" @click="closePostModal">
      <div class="suggestion-modal" @click.stop>
        <div class="modal-header">
          <h2>📝 Criar Nova Postagem</h2>
          <button class="close-btn" @click="closePostModal">×</button>
        </div>

        <div class="modal-content">
          <p class="modal-description">
            Compartilhe suas ideias e sugestões com a comunidade!
          </p>

          <div class="form-group">
            <label for="author-name">Nome para exibição *</label>
            <input
              id="author-name"
              v-model="postForm.author"
              type="text"
              placeholder="Seu nome ou como deseja aparecer"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="post-title">Título da Postagem *</label>
            <input
              id="post-title"
              v-model="postForm.title"
              type="text"
              placeholder="Digite o título da sua postagem..."
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="post-content">Conteúdo *</label>
            <textarea
              id="post-content"
              v-model="postForm.content"
              placeholder="Descreva sua ideia, sugestão ou pensamento..."
              class="form-textarea"
              rows="5"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="post-type">Categoria da Postagem</label>
            <select id="post-type" v-model="postForm.type" class="form-input">
              <option value="geral">💡 Geral</option>
              <option value="dashboard">📊 Dashboard</option>
              <option value="ranking">🏆 Ranking</option>
              <option value="auditoria">🔍 Auditoria</option>
              <option value="relatorios">📋 Relatórios</option>
              <option value="voting">🗳️ Melhoria para Votação</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closePostModal">Cancelar</button>
          <button
            class="btn-submit"
            @click="submitPost"
            :disabled="isSubmittingPost || !isPostFormValid"
          >
            <span class="btn-icon">📤</span>
            {{ isSubmittingPost ? "Criando..." : "Criar Postagem" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Novo Aviso -->
    <div v-if="showNoticeModal" class="modal-overlay" @click="closeNoticeModal">
      <div class="suggestion-modal" @click.stop>
        <div class="modal-header">
          <h2>💬 Criar Novo Aviso</h2>
          <button class="close-btn" @click="closeNoticeModal">×</button>
        </div>

        <div class="modal-content">
          <p class="modal-description">
            Crie um aviso importante para a comunidade.
          </p>

          <div class="form-group">
            <label for="notice-author">Nome do Autor *</label>
            <input
              id="notice-author"
              v-model="noticeForm.author"
              type="text"
              placeholder="Seu nome"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="notice-title">Título do Aviso *</label>
            <input
              id="notice-title"
              v-model="noticeForm.title"
              type="text"
              placeholder="Digite o título do aviso..."
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="notice-content">Conteúdo do Aviso *</label>
            <textarea
              id="notice-content"
              v-model="noticeForm.content"
              placeholder="Descreva o aviso importante..."
              class="form-textarea"
              rows="5"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="notice-priority">Prioridade</label>
            <select
              id="notice-priority"
              v-model="noticeForm.priority"
              class="form-input"
            >
              <option value="baixa">🟢 Baixa</option>
              <option value="media">🟡 Média</option>
              <option value="alta">🟠 Alta</option>
              <option value="critica">🔴 Crítica</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeNoticeModal">Cancelar</button>
          <button
            class="btn-submit"
            @click="submitNotice"
            :disabled="isSubmittingNotice || !isNoticeFormValid"
          >
            <span class="btn-icon">📤</span>
            {{ isSubmittingNotice ? "Criando..." : "Criar Aviso" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Nova Votação -->
    <div v-if="showVotingModal" class="modal-overlay" @click="closeVotingModal">
      <div class="suggestion-modal" @click.stop>
        <div class="modal-header">
          <h2>🚀 Nova Votação de Melhorias</h2>
          <button class="close-btn" @click="closeVotingModal">×</button>
        </div>

        <div class="modal-content">
          <p class="modal-description">
            Inicie uma votação para uma nova melhoria no sistema.
          </p>

          <div class="form-group">
            <label for="voting-author">Nome do Autor *</label>
            <input
              id="voting-author"
              v-model="votingForm.author"
              type="text"
              placeholder="Seu nome"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="voting-title">Título da Melhoria *</label>
            <input
              id="voting-title"
              v-model="votingForm.title"
              type="text"
              placeholder="Digite o título da melhoria..."
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="voting-description">Descrição da Melhoria *</label>
            <textarea
              id="voting-description"
              v-model="votingForm.description"
              placeholder="Descreva detalhadamente a melhoria proposta..."
              class="form-textarea"
              rows="5"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="voting-benefits">Benefícios Esperados</label>
            <textarea
              id="voting-benefits"
              v-model="votingForm.benefits"
              placeholder="Quais benefícios esta melhoria trará?"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeVotingModal">Cancelar</button>
          <button
            class="btn-submit"
            @click="submitVoting"
            :disabled="isSubmittingVoting || !isVotingFormValid"
          >
            <span class="btn-icon">📤</span>
            {{ isSubmittingVoting ? "Criando..." : "Iniciar Votação" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay de Sucesso -->
    <div v-if="showSuccessOverlay" class="success-overlay">
      <div class="success-content">
        <div class="success-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L10.5 13.19l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.5-4.5z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h3>{{ successOverlayTitle }}</h3>
        <p>{{ successOverlayMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

defineEmits([
  "start-audit",
  "post-created",
  "notice-created",
  "voting-created",
]);

// Estado do menu FAB
const fabMenuOpen = ref(false);

// Estados reativos para modal de sugestões
const showSuggestionModal = ref(false);
const suggestion = ref("");
const nome = ref("");
const isSubmitting = ref(false);

// Estados reativos para modal de postagem
const showPostModal = ref(false);
const postForm = ref({
  author: "",
  title: "",
  content: "",
  type: "geral",
});
const isSubmittingPost = ref(false);

// Estados reativos para modal de aviso
const showNoticeModal = ref(false);
const noticeForm = ref({
  author: "",
  title: "",
  content: "",
  priority: "media",
});
const isSubmittingNotice = ref(false);

// Estados reativos para modal de votação
const showVotingModal = ref(false);
const votingForm = ref({
  author: "",
  title: "",
  description: "",
  benefits: "",
});
const isSubmittingVoting = ref(false);

// Estado para o overlay de sucesso
const showSuccessOverlay = ref(false);
const successOverlayTitle = ref("");
const successOverlayMessage = ref("");

// Computed para validações dos formulários
const isPostFormValid = computed(() => {
  return (
    postForm.value.author.trim() &&
    postForm.value.title.trim() &&
    postForm.value.content.trim() &&
    postForm.value.title.length >= 5 &&
    postForm.value.content.length >= 10
  );
});

const isNoticeFormValid = computed(() => {
  return (
    noticeForm.value.author.trim() &&
    noticeForm.value.title.trim() &&
    noticeForm.value.content.trim() &&
    noticeForm.value.title.length >= 5 &&
    noticeForm.value.content.length >= 10
  );
});

const isVotingFormValid = computed(() => {
  return (
    votingForm.value.author.trim() &&
    votingForm.value.title.trim() &&
    votingForm.value.description.trim() &&
    votingForm.value.title.length >= 5 &&
    votingForm.value.description.length >= 20
  );
});

// Método para alternar o menu FAB
const toggleFabMenu = () => {
  fabMenuOpen.value = !fabMenuOpen.value;
};

// Métodos para modal de sugestões
const openSuggestionModal = () => {
  fabMenuOpen.value = false; // Fecha o menu FAB
  showSuggestionModal.value = true;
};

const closeSuggestionModal = () => {
  showSuggestionModal.value = false;
  suggestion.value = "";
  nome.value = "";
  isSubmitting.value = false;
};

// Métodos para modal de postagem
const openPostModal = () => {
  fabMenuOpen.value = false; // Fecha o menu FAB
  showPostModal.value = true;
};

const closePostModal = () => {
  showPostModal.value = false;
  postForm.value = {
    author: "",
    title: "",
    content: "",
    type: "geral",
  };
  isSubmittingPost.value = false;
};

// Métodos para modal de aviso
const openNoticeModal = () => {
  fabMenuOpen.value = false; // Fecha o menu FAB
  showNoticeModal.value = true;
};

const closeNoticeModal = () => {
  showNoticeModal.value = false;
  noticeForm.value = {
    author: "",
    title: "",
    content: "",
    priority: "media",
  };
  isSubmittingNotice.value = false;
};

// Métodos para modal de votação
const openVotingModal = () => {
  fabMenuOpen.value = false; // Fecha o menu FAB
  showVotingModal.value = true;
};

const closeVotingModal = () => {
  showVotingModal.value = false;
  votingForm.value = {
    author: "",
    title: "",
    description: "",
    benefits: "",
  };
  isSubmittingVoting.value = false;
};

const submitSuggestion = async () => {
  if (!suggestion.value.trim()) {
    alert("Por favor, digite sua sugestão");
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch("/api/api/sugestoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sugestao: suggestion.value,
        nome: nome.value || null,
        tipo: "geral",
      }),
    });

    if (response.ok) {
      closeSuggestionModal();
      successOverlayTitle.value = "Sugestão Enviada com Sucesso!";
      successOverlayMessage.value = "Obrigado pelo seu feedback.";
      showSuccessOverlay.value = true;
      setTimeout(() => {
        showSuccessOverlay.value = false;
      }, 3000);
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

// Submit para nova postagem
const submitPost = async () => {
  if (!isPostFormValid.value) {
    alert("Por favor, preencha todos os campos obrigatórios");
    return;
  }

  isSubmittingPost.value = true;

  try {
    const response = await fetch("/api/api/sugestoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-loja": "001",
      },
      body: JSON.stringify({
        sugestao: `${postForm.value.title}\n\n${postForm.value.content}`,
        nome: postForm.value.author,
        tipo: postForm.value.type,
      }),
    });

    if (response.ok) {
      closePostModal();
      successOverlayTitle.value = "Postagem Criada com Sucesso!";
      successOverlayMessage.value = "Sua postagem foi enviada para aprovação.";
      showSuccessOverlay.value = true;
      // Esconde o overlay após alguns segundos
      setTimeout(() => {
        showSuccessOverlay.value = false;
      }, 3000);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.erro || "Erro ao criar postagem");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao criar postagem: " + error.message);
  } finally {
    isSubmittingPost.value = false;
  }
};

// Submit para novo aviso
const submitNotice = async () => {
  if (!isNoticeFormValid.value) {
    alert("Por favor, preencha todos os campos obrigatórios");
    return;
  }

  isSubmittingNotice.value = true;

  try {
    const response = await fetch("/api/api/avisos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: noticeForm.value.title,
        conteudo: noticeForm.value.content,
        prioridade: noticeForm.value.priority,
        autor: noticeForm.value.author,
      }),
    });

    if (response.ok) {
      closeNoticeModal();
      successOverlayTitle.value = "Aviso Criado com Sucesso!";
      successOverlayMessage.value =
        "Seu aviso será enviado para aprovação no dashboard.";
      showSuccessOverlay.value = true;
      setTimeout(() => {
        showSuccessOverlay.value = false;
      }, 3000);
    } else {
      throw new Error("Erro ao criar aviso");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao criar aviso. Tente novamente.");
  } finally {
    isSubmittingNotice.value = false;
  }
};

// Submit para nova votação
const submitVoting = async () => {
  if (!isVotingFormValid.value) {
    alert("Por favor, preencha todos os campos obrigatórios");
    return;
  }

  isSubmittingVoting.value = true;

  try {
    const response = await fetch("/api/api/votacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: votingForm.value.title,
        descricao: votingForm.value.description,
        beneficios: votingForm.value.benefits,
        autor: votingForm.value.author,
        status: "pendente",
        data_criacao: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      closeVotingModal();
      successOverlayTitle.value = "Votação criada com sucesso!";
      successOverlayMessage.value = "Será enviada para aprovação no dashboard.";
      showSuccessOverlay.value = true;
      setTimeout(() => {
        showSuccessOverlay.value = false;
      }, 3000);
    } else {
      throw new Error("Erro ao criar votação");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao criar votação. Tente novamente.");
  } finally {
    isSubmittingVoting.value = false;
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
  max-width: auto;
  height: 20%;
}

.hero-content {
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 1;
  margin-top: -60px;
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

/* Botões Desktop - Estilo Tradicional */
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
  background: rgb(218, 163, 92);
  color: #000000;
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

/* Controle de visibilidade Desktop/Mobile */
.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
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
.hero-circle-7 {
  width: 90px;
  height: 90px;
  top: 45%;
  left: 35%;
  animation-delay: 5s;
}
.hero-circle-8 {
  width: 180px;
  height: 180px;
  top: 80%;
  left: 60%;
  animation-delay: 10s;
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
  .hero-section {
    padding: 3rem 0 2rem;
    min-height: auto;
  }

  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 0 1rem;
    padding-top: 1.5rem;
  }

  .hero-text h1 {
    font-size: 1.75rem;
    line-height: 1.2;
    margin-bottom: 0.75rem;
    margin-top: 0;
  }

  .hero-subtitle {
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .hero-subtitle br {
    display: none;
  }

  .hero-stats {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .stat-item {
    padding: 0.5rem 0.75rem;
    flex: 1;
    min-width: 90px;
    max-width: 120px;
  }

  .stat-number {
    font-size: 1.3rem;
  }

  .stat-label {
    font-size: 0.65rem;
    line-height: 1.2;
  }

  /* Esconder botões desktop e mostrar FAB no mobile */
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: flex !important;
  }

  /* Visual Hero - esconder no mobile para economizar espaço */
  .hero-visual {
    display: none;
  }

  /* Esconde algumas bolinhas decorativas em mobile */
  .hero-circle-3,
  .hero-circle-4,
  .hero-circle-5,
  .hero-circle-6,
  .hero-circle-7,
  .hero-circle-8 {
    display: none;
  }

  .hero-circle-1,
  .hero-circle-2 {
    opacity: 0.3;
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

/* Responsividade do Modal - Mobile First */
@media (max-width: 768px) {
  .modal-overlay {
    align-items: flex-end;
    padding: 0;
  }

  .suggestion-modal {
    width: 100%;
    max-width: 100%;
    max-height: 90vh;
    margin: 0;
    border-radius: 20px 20px 0 0;
    animation: modalSlideUp 0.3s ease-out;
  }

  @keyframes modalSlideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .modal-header {
    padding: 1.25rem 1rem;
    border-radius: 20px 20px 0 0;
    position: relative;
  }

  /* Indicador de arraste no topo do modal */
  .modal-header::before {
    content: "";
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
  }

  .modal-header h2 {
    font-size: 1.25rem;
    margin-top: 8px;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    font-size: 1.5rem;
  }

  .modal-content {
    padding: 1.25rem 1rem;
  }

  .modal-description {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    font-size: 0.85rem;
    margin-bottom: 6px;
  }

  .form-input,
  .form-textarea {
    padding: 12px 14px;
    font-size: 1rem; /* 16px para evitar zoom no iOS */
    border-radius: 10px;
  }

  .form-textarea {
    min-height: 120px;
  }

  .modal-footer {
    padding: 1rem;
    flex-direction: column-reverse;
    gap: 0.75rem;
    position: sticky;
    bottom: 0;
    background: white;
    border-top: 1px solid #e9ecef;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    border-radius: 12px;
  }

  .btn-cancel {
    background: #f1f5f9;
    color: #64748b;
  }
}

/* Estilos do Overlay de Sucesso */
.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001; /* Acima do outro modal */
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

.success-content {
  background: white;
  color: #1e293b;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
  max-width: 400px;
}

.success-icon {
  color: #22c55e; /* Verde sucesso */
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  animation: popIn 0.5s ease-out 0.2s backwards;
}

.success-content h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.success-content p {
  color: #64748b;
  font-size: 1rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Estilos do Floating Action Button (FAB) */
.fab-container {
  position: relative;
  display: none; /* Escondido por padrão no desktop */
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.fab-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.fab-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  animation: fabItemSlideIn 0.3s ease-out backwards;
}

.fab-menu-item:nth-child(1) {
  animation-delay: 0.05s;
}
.fab-menu-item:nth-child(2) {
  animation-delay: 0.1s;
}
.fab-menu-item:nth-child(3) {
  animation-delay: 0.15s;
}
.fab-menu-item:nth-child(4) {
  animation-delay: 0.2s;
}

.fab-menu-item:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
  transform: translateX(-4px) scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.fab-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.fab-label {
  font-size: 0.95rem;
}

.fab-main {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.fab-main i {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-main.active i {
  transform: rotate(45deg);
}

.fab-main:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.5);
}

.fab-main:active {
  transform: scale(0.95);
}

/* Animações */
@keyframes fabItemSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.fab-item-enter-active {
  animation: fabItemSlideIn 0.3s ease-out;
}

.fab-item-leave-active {
  animation: fabItemSlideOut 0.2s ease-in;
}

@keyframes fabItemSlideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(10px) scale(0.8);
  }
}

/* Mobile - FAB fixo no canto inferior direito */
@media (max-width: 768px) {
  .fab-container {
    position: fixed;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 100px);
    right: 20px;
    z-index: 1100;
  }

  .fab-menu {
    margin-bottom: 0.75rem;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding-right: 4px;
  }

  .fab-menu-item {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .fab-icon {
    font-size: 1.1rem;
  }

  .fab-label {
    font-size: 0.9rem;
  }

  .fab-main {
    width: 60px;
    height: 60px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
  }
}

@keyframes popIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
