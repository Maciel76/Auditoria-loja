<template>
  <div class="empty-state">
    <div class="empty-icon">
      <i class="fas fa-user-slash"></i>
    </div>
    <h3>Nenhum colaborador encontrado</h3>
    <p>Faça o upload de uma planilha para começar</p>
    <router-link to="/upload" class="btn btn-primary">
      <i class="fas fa-upload"></i> Fazer Upload
    </router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  color: #bdc3c7;
  margin-bottom: 20px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
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
