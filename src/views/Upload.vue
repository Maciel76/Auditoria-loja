<template>
  <div class="upload-container">
    <h2>Upload da Planilha</h2>
    <div class="upload-box" @dragover.prevent @drop="handleDrop">
      <p>Arraste sua planilha aqui ou</p>
      <input
        type="file"
        @change="handleFile"
        accept=".xlsx, .xls, .csv"
        id="fileInput"
      />
      <label for="fileInput" class="file-label">Selecionar arquivo</label>
      <p v-if="arquivo" class="file-name">{{ arquivo.name }}</p>
    </div>

    <button
      @click="enviarArquivo"
      :disabled="!arquivo || carregando"
      class="upload-btn"
    >
      <span v-if="!carregando">Enviar Planilha</span>
      <div v-else class="loading-spinner"></div>
    </button>

    <!-- Overlay e spinner durante o carregamento -->
    <div v-if="carregando" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Processando sua planilha...</p>
      </div>
    </div>

    <div v-if="resposta" class="resposta-container">
      <h3>Resultado do Processamento</h3>
      <div v-if="resposta.erro" class="error-message">
        <p>{{ resposta.erro }}</p>
        <p v-if="resposta.detalhes">Detalhes: {{ resposta.detalhes }}</p>
      </div>
      <div v-else>
        <p class="success-message">{{ resposta.mensagem }}</p>
        <p>Total de registros processados: {{ resposta.totalRegistros }}</p>
        <button @click="armazenarDados" class="use-data-btn">
          Usar estes dados
        </button>

        <div class="preview-toggle" @click="mostrarPrevia = !mostrarPrevia">
          <span
            >{{ mostrarPrevia ? "Ocultar" : "Mostrar" }} prévia dos dados</span
          >
        </div>

        <div v-if="mostrarPrevia" class="data-preview">
          <pre>{{ JSON.stringify(resposta.dados, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const arquivo = ref(null);
const resposta = ref(null);
const mostrarPrevia = ref(false);
const carregando = ref(false);

const handleFile = (e) => {
  arquivo.value = e.target.files[0];
};

const handleDrop = (e) => {
  e.preventDefault();
  if (e.dataTransfer.files.length) {
    arquivo.value = e.dataTransfer.files[0];
  }
};

const enviarArquivo = async () => {
  if (!arquivo.value) return;

  carregando.value = true;
  resposta.value = null;

  try {
    const formData = new FormData();
    formData.append("file", arquivo.value);

    const { data } = await axios.post(
      "http://localhost:3000/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    resposta.value = data;
  } catch (error) {
    console.error("Erro ao enviar arquivo:", error);
    resposta.value = {
      erro: "Falha no upload",
      detalhes: error.message,
    };
  } finally {
    carregando.value = false;
  }
};

const armazenarDados = () => {
  if (resposta.value && resposta.value.dados) {
    try {
      // Verificar a estrutura dos dados
      console.log("Dados recebidos:", resposta.value.dados);

      // Armazenar no localStorage
      localStorage.setItem(
        "dadosPlanilha",
        JSON.stringify(resposta.value.dados)
      );
      alert(
        "Dados armazenados com sucesso! Agora você pode visualizar os usuários."
      );

      // Opcional: redirecionar para a página de usuários
      // router.push('/usuarios');
    } catch (error) {
      console.error("Erro ao armazenar dados:", error);
      alert("Erro ao armazenar dados. Verifique o console para mais detalhes.");
    }
  }
};
</script>

<style scoped>
.upload-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.upload-box {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
  transition: border-color 0.3s;
}

.upload-box:hover {
  border-color: #42b883;
}

.file-label {
  display: inline-block;
  background: #42b883;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

input[type="file"] {
  display: none;
}

.file-name {
  margin-top: 10px;
  font-style: italic;
}

.upload-btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.loading-content .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

.resposta-container {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background: #f9f9f9;
}

.error-message {
  color: #d32f2f;
  padding: 10px;
  background: #ffebee;
  border-radius: 4px;
}

.success-message {
  color: #2e7d32;
  font-weight: bold;
}

.use-data-btn {
  background: #1976d2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.preview-toggle {
  margin-top: 15px;
  color: #1976d2;
  cursor: pointer;
  text-decoration: underline;
}

.data-preview {
  margin-top: 15px;
  max-height: 300px;
  overflow: auto;
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>
