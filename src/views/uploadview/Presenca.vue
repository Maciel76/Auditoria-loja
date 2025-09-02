<!-- uploadview/Presenca.vue -->
<template>
  <div class="upload-container">
    <h2>Enviar Planilha de Auditoria de Presença</h2>
    <div class="upload-box" @dragover.prevent @drop="handleDrop">
      <p>Arraste sua planilha de presença aqui ou</p>
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
      :disabled="!arquivo || enviando"
      class="upload-btn"
    >
      <span v-if="enviando">Enviando...</span>
      <span v-else>Processar Planilha de Presença</span>
    </button>

    <div v-if="resposta" class="resposta-container">
      <h3>Resultado do Processamento</h3>
      <div v-if="resposta.erro" class="error-message">
        <p>{{ resposta.erro }}</p>
        <p v-if="resposta.detalhes">Detalhes: {{ resposta.detalhes }}</p>
      </div>
      <div v-else>
        <p class="success-message">{{ resposta.mensagem }}</p>
        <p>Total de registros: {{ resposta.totalRegistros }}</p>

        <button @click="irParaPresenca" class="use-data-btn">
          Ver Registros de Presença
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const arquivo = ref(null);
const resposta = ref(null);
const enviando = ref(false);
const router = useRouter();

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

  try {
    enviando.value = true;
    const formData = new FormData();
    formData.append("file", arquivo.value);
    // ⬇️ ALTERAR PARA A NOVA ROTA ESPECÍFICA
    formData.append("tipoAuditoria", "presenca");

    const { data } = await axios.post(
      "http://localhost:3000/upload-presenca", // ⬅️ NOVA ROTA
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
      detalhes: error.response?.data?.erro || error.message,
    };
  } finally {
    enviando.value = false;
  }
};

const irParaPresenca = () => {
  // Você pode criar uma rota para visualizar presenças depois
  router.push("/presenca");
};
</script>

<style scoped>
.upload-container {
  margin: 0 auto;
  padding: 20px;
  font-family: "Poppins", sans-serif;
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
  background: #3372d1;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.upload-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
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
  margin-right: 10px;
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
  font-size: 12px;
}
</style>
