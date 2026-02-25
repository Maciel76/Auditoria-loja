<!-- views/uploadview/Etiqueta.vue - Versão Melhorada -->
<template>
  <div class="upload-container">
    <!-- Card de informações da loja -->
    <div class="loja-info-card">
      <!-- Elementos decorativos de fundo -->
      <div class="decoration-circle card-circle-1"></div>
      <div class="decoration-circle card-circle-2"></div>
      <div class="decoration-circle card-circle-3"></div>
      <div class="decoration-circle card-circle-4"></div>

      <div class="loja-header">
        <h2>Upload de Etiquetas</h2>
        <div class="loja-badge">
          <span class="loja-codigo">{{ lojaStore.codigoLojaAtual }}</span>
          <span class="loja-nome">{{
            extrairNomeSimples(lojaStore.nomeLojaAtual)
          }}</span>
        </div>
      </div>
      <p class="loja-descricao">
        Envie sua planilha da auditoria de etiquetas para a loja selecionada
      </p>
    </div>

    <!-- Upload Box -->
    <div class="upload-box" @dragover.prevent @drop="handleDrop">
      <div class="upload-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <path fill="#667eea" d="m21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42M13 20l-9-9V4h7l9 9M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5"/>
        </svg>
      </div>
      <p>Arraste sua planilha de etiquetas aqui ou selecione arquivo</p>
      <input
        type="file"
        @change="handleFile"
        accept=".xlsx, .xls, .csv"
        id="fileInput"
      />
      <label for="fileInput" class="file-label">Selecionar arquivo</label>
      <p v-if="arquivo" class="file-name">📎 {{ arquivo.name }}</p>
    </div>

    <!-- Botão de Upload -->
    <button
      @click="enviarArquivo"
      :disabled="!arquivo || enviando || !lojaStore.isLojaSelected"
      class="upload-btn"
      :class="{
        loading: enviando,
        disabled: !arquivo || !lojaStore.isLojaSelected,
      }"
    >
      <span v-if="enviando" class="loading-content">
        <span class="spinner"></span>
        Processando...
      </span>
      <span v-else-if="!lojaStore.isLojaSelected">
        ⚠️ Nenhuma loja selecionada
      </span>
      <span v-else-if="!arquivo"> 📎 Selecione um arquivo primeiro </span>
      <span v-else> 🚀 Processar Planilha de Etiquetas </span>
    </button>

    <!-- Resultado -->
    <div v-if="resposta" class="resposta-container">
      <div v-if="resposta.erro" class="error-card">
        <div class="error-header">
          <span class="error-icon">❌</span>
          <h3>Erro no Processamento</h3>
        </div>
        <p class="error-message">{{ resposta.erro }}</p>
        <p v-if="resposta.detalhes" class="error-details">
          {{ resposta.detalhes }}
        </p>
        <button @click="resposta = null" class="btn-fechar-erro">
          Tentar Novamente
        </button>
      </div>

      <div v-else class="success-card">
        <div class="success-header">
          <span class="success-icon">✅</span>
          <h3>Processamento Concluído</h3>
        </div>

        <div class="success-stats">
          <div class="stat-item">
            <span class="stat-number">{{ resposta.totalItens }}</span>
            <span class="stat-label">Total de Itens</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ resposta.totalProcessados }}</span>
            <span class="stat-label">Processados</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ resposta.totalUsuarios }}</span>
            <span class="stat-label">Usuários</span>
          </div>
        </div>

        <div class="success-actions">
          <button @click="irParaUsuarios" class="btn-action primary">
            👥 Ver Colaboradores
          </button>
          <button @click="novoUpload" class="btn-action secondary">
            📄 Novo Upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "@/config/api";
import { useRouter } from "vue-router";
import { useLojaStore } from "../../store/lojaStore";

const lojaStore = useLojaStore();
const arquivo = ref(null);
const resposta = ref(null);
const enviando = ref(false);
const router = useRouter();

function extrairNomeSimples(nomeCompleto) {
  if (!nomeCompleto) return "Carregando...";
  const partes = nomeCompleto.split(" - ");
  return partes.length > 1 ? partes[1] : nomeCompleto;
}

const handleFile = (e) => {
  arquivo.value = e.target.files[0];
  resposta.value = null;
};

const handleDrop = (e) => {
  e.preventDefault();
  if (e.dataTransfer.files.length) {
    arquivo.value = e.dataTransfer.files[0];
    resposta.value = null;
  }
};

const enviarArquivo = async () => {
  if (!arquivo.value || !lojaStore.isLojaSelected) return;

  try {
    enviando.value = true;
    resposta.value = null;

    const formData = new FormData();
    formData.append("file", arquivo.value);
    formData.append("tipoAuditoria", "etiqueta");

    console.log(`🏪 Enviando para loja: ${lojaStore.codigoLojaAtual}`);

    const { data } = await api.post(
      "/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // x-loja é adicionado automaticamente pelo store
        },
      }
    );

    resposta.value = data;
    console.log("✅ Upload realizado:", data);
  } catch (error) {
    console.error("❌ Erro no upload:", error);

    let mensagemErro = "Falha no upload";
    let detalhes = error.message;

    if (error.response?.status === 400) {
      const errorData = error.response.data;
      if (errorData?.erro === "LOJA_NAO_SELECIONADA") {
        mensagemErro = "Loja não selecionada";
        detalhes = "Por favor, selecione uma loja válida";
      } else if (errorData?.erro === "LOJA_INVALIDA") {
        mensagemErro = "Loja inválida";
        detalhes = errorData?.mensagem || "Código de loja não reconhecido";
      }
    }

    resposta.value = {
      erro: mensagemErro,
      detalhes: error.response?.data?.detalhes || detalhes,
    };
  } finally {
    enviando.value = false;
  }
};

const irParaUsuarios = () => {
  router.push("/usuarios");
};

const novoUpload = () => {
  arquivo.value = null;
  resposta.value = null;

  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.value = "";
  }
};
</script>

<style scoped>
.upload-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
}

.loja-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

/* Elementos decorativos de fundo no card */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.card-circle-1 {
  width: 80px;
  height: 80px;
  top: -20px;
  right: -20px;
  animation-delay: 0s;
}

.card-circle-2 {
  width: 60px;
  height: 60px;
  bottom: -15px;
  left: -15px;
  animation-delay: 1.5s;
}

.card-circle-3 {
  width: 40px;
  height: 40px;
  top: 30%;
  right: 15%;
  animation-delay: 3s;
}

.card-circle-4 {
  width: 50px;
  height: 50px;
  bottom: 25%;
  left: 20%;
  animation-delay: 4.5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(8deg);
  }
}

.loja-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}

.loja-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.loja-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.loja-codigo {
  font-weight: bold;
  font-size: 1rem;
}

.loja-nome {
  font-size: 0.9rem;
  opacity: 0.9;
}

.loja-descricao {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
  position: relative;
  z-index: 1;
}

.upload-box {
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
  background: #fafafa;
  transition: all 0.3s ease;
}

.upload-box:hover {
  border-color: #667eea;
  background: #f8faff;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.file-label {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.file-label:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

input[type="file"] {
  display: none;
}

.file-name {
  margin-top: 1rem;
  color: #4a5568;
  font-weight: 500;
}

.upload-btn {
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #48bb78;
  color: white;
}

.upload-btn:hover:not(:disabled) {
  background: #38a169;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.upload-btn.disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.upload-btn.loading {
  background: #667eea;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.resposta-container {
  margin-top: 2rem;
}

.error-card,
.success-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.error-card {
  border-left: 4px solid #f56565;
}

.success-card {
  border-left: 4px solid #48bb78;
}

.error-header,
.success-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.error-icon,
.success-icon {
  font-size: 1.5rem;
}

.error-header h3,
.success-header h3 {
  margin: 0;
  color: #2d3748;
}

.error-message {
  color: #e53e3e;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.error-details {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.btn-fechar-erro {
  background: #f56565;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.success-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
}

.success-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-action {
  flex: 1;
  min-width: 150px;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action.primary {
  background: #4299e1;
  color: white;
}

.btn-action.primary:hover {
  background: #3182ce;
}

.btn-action.secondary {
  background: #edf2f7;
  color: #4a5568;
}

.btn-action.secondary:hover {
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .upload-container {
    padding: 1rem;
  }

  .loja-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .success-actions {
    flex-direction: column;
  }

  /* Esconde algumas bolinhas em mobile para não poluir */
  .card-circle-3,
  .card-circle-4 {
    display: none;
  }
}
</style>
