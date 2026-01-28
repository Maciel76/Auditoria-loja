<template>
  <div class="contato">
    <div class="header">
      <h1>Entre em Contato</h1>
      <p>
        Se você tiver dúvidas, sugestões ou precisar de suporte, não hesite em
        nos contatar.
      </p>
    </div>

    <div class="content-grid">
      <div class="info-card contact-card">
        <h2 class="section-title contact-title">
          <font-awesome-icon :icon="faEnvelope" /> Informações de Contato
        </h2>
        <div class="info-item">
          <font-awesome-icon :icon="faUser" class="icon icon-user" />
          <div>
            <strong>Desenvolvedor</strong>
            <p>Maciel Ribeiro</p>
          </div>
        </div>
        <div class="info-item">
          <font-awesome-icon :icon="faPhone" class="icon icon-phone" />
          <div>
            <strong>WhatsApp</strong>
            <p>
              <a href="https://wa.me/5562982809010" target="_blank"
                >(62) 98280-9010</a
              >
            </p>
          </div>
        </div>
        <div class="info-item">
          <font-awesome-icon :icon="faEnvelope" class="icon icon-email" />
          <div>
            <strong>E-mail</strong>
            <p>
              <a href="mailto:stwcontato@hotmail.com">stwcontato@hotmail.com</a>
            </p>
          </div>
        </div>

        <!-- Social Media Links -->
        <div class="social-links">
          <h3 class="section-subtitle">
            <font-awesome-icon :icon="faLinkedin" /> Redes Sociais
          </h3>
          <div class="social-item">
            <font-awesome-icon :icon="faLinkedin" class="icon icon-linkedin" />
            <div>
              <strong>LinkedIn</strong>
              <p>
                <a
                  href="https://www.linkedin.com/in/maciel-ribeiro-850835229/"
                  target="_blank"
                  >linkedin.com/in/maciel-ribeiro-850835229</a
                >
              </p>
            </div>
          </div>
          <div class="social-item">
            <font-awesome-icon :icon="faGithub" class="icon icon-github" />
            <div>
              <strong>GitHub</strong>
              <p>
                <a href="https://github.com/Maciel76" target="_blank"
                  >github.com/Maciel76</a
                >
              </p>
            </div>
          </div>
          <div class="social-item">
            <font-awesome-icon
              :icon="faInstagram"
              class="icon icon-instagram"
            />
            <div>
              <strong>Instagram</strong>
              <p>
                <a
                  href="https://instagram.com/maciel_ribeiro005"
                  target="_blank"
                  >@maciel_ribeiro005</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUser, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faGithub,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

export default {
  name: "Contato",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      faUser,
      faPhone,
      faEnvelope,
      faLinkedin,
      faGithub,
      faInstagram,
    };
  },
};
</script>

<style scoped>
.contato {
  padding: 2rem;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  min-height: 100vh;
  line-height: 1.6;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  text-align: center;
  margin-bottom: 4rem;
}

.header h1 {
  font-size: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  margin-bottom: 1rem;
}

.header p {
  font-size: 1.2rem;
  color: #5a6c7d;
  max-width: 700px;
  margin: 0.5rem auto 0;
  line-height: 1.6;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.info-card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-top: 5px solid;
  position: relative;
  overflow: hidden;
}

.contact-card {
  border-top-color: #667eea;
}

.info-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(102, 126, 234, 0.03) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.info-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
}

.info-card:hover::before {
  opacity: 1;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  color: white;
}

.contact-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.section-subtitle {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 2rem 0 1.5rem 0;
  padding: 0.8rem 1rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 10px;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
}

.info-item,
.social-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.8rem;
  padding: 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: transparent;
}

.info-item:hover,
.social-item:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateX(5px);
}

.icon {
  font-size: 1.8rem;
  margin-right: 1.2rem;
  padding: 0.8rem;
  border-radius: 12px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon:hover {
  transform: scale(1.1) rotate(5deg);
}

.icon-user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.icon-phone {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.icon-email {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.icon-linkedin {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.icon-github {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
  color: white;
}

.icon-instagram {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.info-item strong,
.social-item strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 0.3rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.info-item p,
.info-item a,
.social-item p,
.social-item a {
  color: #5a6c7d;
  text-decoration: none;
  margin: 0;
  font-size: 1.05rem;
  transition: color 0.3s ease;
}

.info-item a:hover,
.social-item a:hover {
  color: #667eea;
  text-decoration: none;
}

.social-links {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

@media (max-width: 768px) {
  .contato {
    padding: 1rem;
  }

  .content-grid {
    gap: 1.5rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .header p {
    font-size: 1rem;
    padding: 0 1rem;
  }

  .info-card {
    padding: 1.8rem;
  }

  .section-title {
    font-size: 1.6rem;
    padding: 0.8rem 1.2rem;
  }

  .section-subtitle {
    font-size: 1.3rem;
    padding: 0.6rem 0.8rem;
  }

  .info-item,
  .social-item {
    margin-bottom: 1.4rem;
    padding: 0.8rem;
  }

  .icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    width: 45px;
    height: 45px;
    padding: 0.6rem;
  }
}

@media (max-width: 480px) {
  .contato {
    padding: 0.8rem;
  }

  .info-card {
    padding: 1.5rem;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .header p {
    font-size: 0.95rem;
  }

  .section-title {
    font-size: 1.4rem;
    padding: 0.6rem 1rem;
  }

  .section-subtitle {
    font-size: 1.2rem;
    padding: 0.5rem 0.7rem;
  }

  .icon {
    font-size: 1.3rem;
    width: 40px;
    height: 40px;
    padding: 0.5rem;
  }

  .info-item strong,
  .social-item strong {
    font-size: 1rem;
  }

  .info-item p,
  .info-item a,
  .social-item p,
  .social-item a {
    font-size: 0.95rem;
  }
}
</style>
