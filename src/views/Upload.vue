<!-- Upload.vue (agora será o menu principal) -->
<template>
  <div class="upload-menu-container">
    <h2>Selecionar Tipo de Auditoria</h2>
    
    <div class="audit-type-buttons">
      <button @click="navegarPara('etiqueta')" class="type-btn">
        📋 Auditoria de Etiquetas
      </button>
      
      <button @click="navegarPara('presenca')" class="type-btn">
        👥 Auditoria de Presença
      </button>
      
      <button @click="navegarPara('ruptura')" class="type-btn">
        📦 Auditoria de Ruptura
      </button>
    </div>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const navegarPara = (tipo) => {
  router.push(`/upload/${tipo}`);
};
</script>

<style scoped>
.upload-menu-container {
  margin: 0 auto;
  padding: 20px;
  font-family: "Poppins", sans-serif;
  text-align: center;
}

.audit-type-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.type-btn {
  background: #3372d1;
  color: white;
  border: none;
  padding: 20px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  min-width: 200px;
  transition: transform 0.2s, background 0.2s;
}

.type-btn:hover {
  background: #2858a8;
  transform: translateY(-2px);
}

.type-btn:active {
  transform: translateY(0);
}
</style>