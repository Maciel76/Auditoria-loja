<template>
  <header class="main-header">
    <div class="header-content">
      <div class="logo-section">
        <h1>AuditPro</h1>
        <span class="slogan">Audite. Colabore. Melhore.</span>
      </div>
      <nav class="main-nav">
        <a href="#" class="nav-item active">🏠 Início</a>
        <a href="#" class="nav-item">🧭 Auditorias</a>
        <a href="#" class="nav-item">💬 Comunidade</a>
        <a href="#" class="nav-item">🚀 Melhorias</a>
        <a href="#" class="nav-item">📰 Novidades</a>
        <a href="#" class="nav-item">🙋‍♂️ Perfil</a>
      </nav>
    </div>
  </header>
</template>

<script setup>
// Lógica específica do header pode ser adicionada aqui
</script>

<style scoped>
.main-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section h1 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0;
}

.slogan {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.main-nav {
  display: flex;
  gap: 2rem;
}

.nav-item {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.2s;
  border-bottom: 2px solid transparent;
}

.nav-item:hover,
.nav-item.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

@media (max-width: 768px) {
  .main-nav {
    display: none;
  }
}
</style>
