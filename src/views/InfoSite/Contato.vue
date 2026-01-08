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
      <div class="info-card">
        <h2>Informações de Contato</h2>
        <div class="info-item">
          <font-awesome-icon :icon="faUser" class="icon" />
          <div>
            <strong>Desenvolvedor</strong>
            <p>Maciel Ribeiro</p>
          </div>
        </div>
        <div class="info-item">
          <font-awesome-icon :icon="faPhone" class="icon" />
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
          <font-awesome-icon :icon="faEnvelope" class="icon" />
          <div>
            <strong>E-mail</strong>
            <p>
              <a href="mailto:stwcontato@hotmail.com">stwcontato@hotmail.com</a>
            </p>
          </div>
        </div>
      </div>

      <div class="form-card">
        <h2>Envie uma Mensagem</h2>
        <p v-if="successMessage" class="success-message">
          {{ successMessage }}
        </p>
        <form @submit.prevent="enviarMensagem">
          <div class="form-group">
            <label for="nome">Nome</label>
            <input
              type="text"
              id="nome"
              v-model="form.nome"
              :class="{ error: errors.nome }"
              required
              placeholder="Seu nome"
            />
            <p v-if="errors.nome" class="error-message">{{ errors.nome }}</p>
          </div>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              :class="{ error: errors.email }"
              required
              placeholder="seu@email.com"
            />
            <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
          </div>
          <div class="form-group">
            <label for="mensagem">Mensagem</label>
            <textarea
              id="mensagem"
              v-model="form.mensagem"
              :class="{ error: errors.mensagem }"
              rows="5"
              required
              placeholder="Como podemos ajudar?"
            ></textarea>
            <p v-if="errors.mensagem" class="error-message">
              {{ errors.mensagem }}
            </p>
          </div>
          <button type="submit" class="submit-btn">Enviar Mensagem</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUser, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "Contato",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      form: {
        nome: "",
        email: "",
        mensagem: "",
      },
      errors: {
        nome: "",
        email: "",
        mensagem: "",
      },
      successMessage: "",
    };
  },
  methods: {
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    enviarMensagem() {
      this.errors = { nome: "", email: "", mensagem: "" };
      this.successMessage = "";

      if (!this.form.nome.trim()) {
        this.errors.nome = "Nome é obrigatório";
      }
      if (!this.form.email.trim()) {
        this.errors.email = "E-mail é obrigatório";
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = "E-mail inválido";
      }
      if (!this.form.mensagem.trim()) {
        this.errors.mensagem = "Mensagem é obrigatória";
      }

      if (Object.values(this.errors).some((e) => e)) {
        return;
      }

      // Simular envio
      this.successMessage = "Mensagem enviada com sucesso!";
      this.form = { nome: "", email: "", mensagem: "" };

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        this.successMessage = "";
      }, 3000);
    },
  },
};
</script>

<style scoped>
.contato {
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
  line-height: 1.6;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: calc(2rem + 2vw);
  color: #2c3e50;
  font-weight: 600;
}

.header p {
  font-size: calc(1rem + 0.5vw);
  color: #6c757d;
  max-width: 600px;
  margin: 0.5rem auto 0;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.info-card,
.form-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover,
.form-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: calc(1.2rem + 1vw);
  color: #34495e;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  background-color: #eaf5fc;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
}

.info-item strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 0.2rem;
}

.info-item p,
.info-item a {
  color: #555;
  text-decoration: none;
  margin: 0;
}

.info-item a:hover {
  color: #3498db;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.submit-btn {
  width: 100%;
  background-color: #3498db;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.form-group input.error,
.form-group textarea.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.success-message {
  color: #27ae60;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .contato {
    padding: 1rem;
  }
  .content-grid {
    gap: 1rem;
  }
  .header h1 {
    font-size: 2rem;
  }
  .header p {
    font-size: 1rem;
  }
}
</style>
