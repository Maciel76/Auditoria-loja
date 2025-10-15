<template>
  <footer class="main-footer">
    <!-- Elementos decorativos de fundo -->
    <div class="decoration-circle footer-circle-1"></div>
    <div class="decoration-circle footer-circle-2"></div>
    <div class="decoration-circle footer-circle-3"></div>
    <div class="decoration-circle footer-circle-4"></div>
    <div class="decoration-circle footer-circle-5"></div>

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
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  position: relative;
  z-index: 1;
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

/* Elementos decorativos de fundo */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  animation: floatFooter 8s ease-in-out infinite;
}

.footer-circle-1 {
  width: 120px;
  height: 120px;
  top: -60px;
  right: 10%;
  animation-delay: 0s;
}

.footer-circle-2 {
  width: 80px;
  height: 80px;
  bottom: -40px;
  left: 5%;
  animation-delay: 2s;
}

.footer-circle-3 {
  width: 60px;
  height: 60px;
  top: 30%;
  left: 15%;
  animation-delay: 4s;
}

.footer-circle-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  right: 5%;
  animation-delay: 6s;
}

.footer-circle-5 {
  width: 40px;
  height: 40px;
  top: 60%;
  right: 25%;
  animation-delay: 1s;
}

@keyframes floatFooter {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }

  /* Esconde algumas bolinhas em mobile para não poluir */
  .footer-circle-3,
  .footer-circle-4,
  .footer-circle-5 {
    display: none;
  }
}
</style>
