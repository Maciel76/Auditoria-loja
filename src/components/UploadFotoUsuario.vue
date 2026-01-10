<template>
  <div class="upload-foto-container">
    <div class="avatar-preview" @click="triggerFileInput">
      <!-- Exibe a foto se existir, senão mostra as iniciais -->
      <img
        v-if="fotoAtual"
        :src="getImageUrl(fotoAtual)"
        alt="Foto do usuário"
        class="avatar-img"
        @error="handleImageError"
      />
      <div v-else class="avatar-placeholder">
        {{ iniciais }}
      </div>

      <!-- Overlay com ícone de câmera ao passar o mouse -->
      <div class="upload-overlay">
        <i class="fas fa-camera"></i>
        <span>{{ fotoAtual ? "Alterar foto" : "Adicionar foto" }}</span>
      </div>
    </div>

    <!-- Input escondido -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      style="display: none"
    />

    <!-- Loading spinner -->
    <div v-if="uploading" class="loading-spinner">
      <div class="spinner"></div>
      <span>Enviando...</span>
    </div>

    <!-- Mensagem de erro -->
    <div v-if="erro" class="erro-mensagem">
      <i class="fas fa-exclamation-circle"></i>
      {{ erro }}
    </div>

    <!-- Mensagem de sucesso -->
    <div v-if="sucesso" class="sucesso-mensagem">
      <i class="fas fa-check-circle"></i>
      {{ sucesso }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useUsuarioStore } from "@/store/usuarioStore";

const usuarioStore = useUsuarioStore();

const props = defineProps({
  usuarioId: {
    type: String,
    required: true,
  },
  usuarioNome: {
    type: String,
    required: true,
  },
  fotoInicial: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["foto-atualizada"]);

const fileInput = ref(null);
const fotoAtual = ref(props.fotoInicial);
const uploading = ref(false);
const erro = ref(null);
const sucesso = ref(null);

// Watch para atualizar foto quando mudar externamente
watch(
  () => props.fotoInicial,
  (novaFoto) => {
    fotoAtual.value = novaFoto;
  }
);

// Calcular iniciais do nome
const iniciais = computed(() => {
  return usuarioStore.getIniciais(props.usuarioNome);
});

// Obter URL completa da imagem
const getImageUrl = (foto) => {
  return usuarioStore.getImageUrl(foto);
};

// Tratar erro de carregamento de imagem
const handleImageError = (e) => {
  console.error("Erro ao carregar imagem:", e);
  fotoAtual.value = null;
};

// Abrir seletor de arquivo
const triggerFileInput = () => {
  if (!uploading.value) {
    fileInput.value.click();
  }
};

// Quando um arquivo é selecionado
const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar tipo de arquivo
  if (!file.type.startsWith("image/")) {
    erro.value = "Por favor, selecione uma imagem válida";
    setTimeout(() => (erro.value = null), 3000);
    return;
  }

  // Validar tamanho (máx 5MB)
  if (file.size > 5 * 1024 * 1024) {
    erro.value = "A imagem deve ter no máximo 5MB";
    setTimeout(() => (erro.value = null), 3000);
    return;
  }

  await uploadFoto(file);
};

// Fazer upload da foto
const uploadFoto = async (file) => {
  uploading.value = true;
  erro.value = null;
  sucesso.value = null;

  try {
    const novaFoto = await usuarioStore.atualizarFoto(props.usuarioId, file);

    fotoAtual.value = novaFoto;
    sucesso.value = "Foto atualizada com sucesso!";

    // Emitir evento para o componente pai
    emit("foto-atualizada", novaFoto);

    // Limpar mensagem de sucesso após 3 segundos
    setTimeout(() => (sucesso.value = null), 3000);
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    erro.value = error.message || "Erro ao fazer upload da foto";
    setTimeout(() => (erro.value = null), 3000);
  } finally {
    uploading.value = false;
    // Limpar input
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }
};
</script>

<style scoped>
.upload-foto-container {
  position: relative;
  display: inline-block;
}

.avatar-preview {
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.avatar-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  gap: 8px;
}

.avatar-preview:hover .upload-overlay {
  opacity: 1;
}

.upload-overlay i {
  font-size: 2rem;
}

.upload-overlay span {
  font-size: 0.9rem;
  font-weight: 600;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner span {
  font-size: 0.9rem;
  color: #667eea;
  font-weight: 600;
}

.erro-mensagem,
.sucesso-mensagem {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 10px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease;
}

.erro-mensagem {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.sucesso-mensagem {
  background: #d1fae5;
  color: #059669;
  border: 1px solid #6ee7b7;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .avatar-preview {
    width: 100px;
    height: 100px;
  }

  .avatar-placeholder {
    font-size: 2rem;
  }

  .upload-overlay i {
    font-size: 1.5rem;
  }

  .upload-overlay span {
    font-size: 0.8rem;
  }
}
</style>
