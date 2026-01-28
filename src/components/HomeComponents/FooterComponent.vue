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
        <h4>Produto</h4>
        <a href="/info/roadmap">Roadmap</a>
        <a href="/info/changelog">Changelog</a>
        <a href="/info/documentacao">Documentação</a>
        <a href="/info/tutorias">Tutoriais</a>
      </div>

      <div class="footer-section">
        <h4>Suporte</h4>
        <a href="/central-ajuda">Central de Ajuda</a>
        <a href="/info/contato">Contato</a>
        <a href="#">Perguntas Frequentes</a>
        <a href="#">Status do Sistema</a>
      </div>

      <div class="footer-section">
        <h4>Contato</h4>
        <div class="contact-info">
          <div class="contact-item">
            <font-awesome-icon :icon="['fab', 'whatsapp']" />
            <a href="https://wa.me/5562982809010" target="_blank"
              >(62) 98280-9010</a
            >
          </div>
          <div class="contact-item">
            <font-awesome-icon :icon="['fas', 'envelope']" />
            <a href="mailto:stwcontato@hotmail.com">stwcontato@hotmail.com</a>
          </div>
          <div class="contact-item">
            <font-awesome-icon :icon="['fas', 'user']" />
            <span>Maciel Ribeiro</span>
          </div>
        </div>
      </div>

      <div class="footer-section">
        <h4>Redes Sociais</h4>
        <div class="social-links">
          <a
            href="https://www.linkedin.com/in/maciel-ribeiro-850835229/"
            target="_blank"
            class="social-link"
          >
            <font-awesome-icon :icon="['fab', 'linkedin']" />
            LinkedIn
          </a>
          <a
            href="https://github.com/Maciel76"
            target="_blank"
            class="social-link"
          >
            <font-awesome-icon :icon="['fab', 'github']" />
            GitHub
          </a>
          <a
            href="https://instagram.com/maciel_ribeiro005"
            target="_blank"
            class="social-link"
          >
            <font-awesome-icon :icon="['fab', 'instagram']" />
            Instagram
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>
        &copy; {{ new Date().getFullYear() }} Sistema de Auditoria de Lojas.
        Todos os direitos reservados.
      </p>
    </div>
  </footer>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faWhatsapp,
  faLinkedin,
  faGithub,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";

// Registrar os ícones globalmente
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faWhatsapp, faEnvelope, faUser, faLinkedin, faGithub, faInstagram);
</script>

<style scoped>
.main-footer {
  background: #1a202c;
  color: white;
  padding: 3rem 2rem 1rem;
  margin-top: 4rem;
  position: relative;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  position: relative;
  z-index: 1;
  margin-bottom: 2rem;
}

.footer-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #e2e8f0;
  position: relative;
  display: inline-block;
}

.footer-section h4::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.footer-section a {
  display: block;
  color: #cbd5e0;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition:
    color 0.2s,
    transform 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-section a:hover {
  color: #667eea;
  transform: translateX(3px);
}

.contact-info .contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
}

.contact-info .contact-item svg {
  color: #667eea;
  width: 16px;
  height: 16px;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateX(5px);
  color: #667eea;
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #2d3748;
  color: #a0aec0;
  font-size: 0.9rem;
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

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  /* Esconde algumas bolinhas em mobile para não poluir */
  .footer-circle-3,
  .footer-circle-4,
  .footer-circle-5 {
    display: none;
  }

  .main-footer {
    padding: 2rem 1rem 1rem;
  }
}

@media (max-width: 480px) {
  .footer-content {
    padding: 0 0.5rem;
  }

  .footer-section a {
    font-size: 0.9rem;
  }

  .footer-bottom {
    font-size: 0.8rem;
    padding: 1rem 0.5rem;
  }
}
</style>
