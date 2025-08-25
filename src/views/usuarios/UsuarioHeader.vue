<template>
  <div class="header">
    <h1><i class="fas fa-users"></i> Sistema de Auditoria</h1>
    <p>Gestão de colaboradores e auditorias</p>
  </div>
</template>

<script setup></script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  margin: 0 -20px 30px -20px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .header {
    padding: 20px;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>
