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

    <button @click="enviarArquivo" :disabled="!arquivo" class="upload-btn">
      Enviar Planilha
    </button>

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
