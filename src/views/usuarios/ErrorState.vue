<template>
  <div class="error-container">
    <div class="error-icon">
      <i class="fas fa-exclamation-triangle"></i>
    </div>
    <h3>Ocorreu um erro</h3>
    <p>{{ erro }}</p>
    <button @click="$emit('tentar-novamente')" class="btn btn-primary">
      <i class="fas fa-redo"></i> Tentar Novamente
    </button>
  </div>
</template>

<script setup>
defineProps({
  erro: String,
});

defineEmits(["tentar-novamente"]);
</script>

<style scoped>
.error-container {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 20px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>
