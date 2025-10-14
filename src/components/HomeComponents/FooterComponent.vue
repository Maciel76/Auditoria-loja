<template>
  <footer class="main-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>Product</h4>
        <a href="#">Roadmap</a>
        <a href="#">Changelog</a>
        <a href="#">Documentação</a>
      </div>
      <div class="footer-section">
        <h4>Comunidade</h4>
        <a href="#">Sugestões</a>
        <a href="#">Votações</a>
        <a href="#">Ranking</a>
      </div>
      <div class="footer-section">
        <h4>Suporte</h4>
        <a href="#">Central de Ajuda</a>
        <a href="#">Contato</a>
        <a href="#">Tutoriais</a>
      </div>
      <div class="footer-section">
        <h4>Desenvolvido com 💚 pela equipe AuditPro</h4>
        <p>Transformando auditorias em colaboração</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Lógica específica do footer pode ser adicionada aqui
</script>

<style scoped>
.main-footer {
  background: #1a202c;
  color: white;
  padding: 3rem 2rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.footer-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-section a {
  display: block;
  color: #cbd5e0;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.2s;
}

.footer-section a:hover {
  color: white;
}

.footer-section p {
  color: #cbd5e0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
