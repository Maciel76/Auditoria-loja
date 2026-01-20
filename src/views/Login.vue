<template>
  <div class="login-container">
    <!-- Elementos de fundo decorativos - mais bolinhas -->
    <div class="decoration-circle circle-1"></div>
    <div class="decoration-circle circle-2"></div>
    <div class="decoration-circle circle-3"></div>
    <div class="decoration-circle circle-4"></div>
    <div class="decoration-circle circle-5"></div>
    <div class="decoration-circle circle-6"></div>

    <div class="login-card">
      <!-- Cabeçalho com ícone de perfil -->
      <div class="login-header">
        <div class="logo-container">
          <i
            class="fas fa-user-circle"
            style="font-size: 48px; color: white"
          ></i>
        </div>
        <h1>Meu Perfil</h1>
        <p>Digite sua matrícula para ver seu perfil</p>
      </div>

      <!-- Formulário -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <div class="input-icon">
            <i
              class="fas fa-id-badge"
              style="font-size: 20px; color: #667eea"
            ></i>
          </div>
          <input
            type="text"
            id="matricula"
            v-model="matricula"
            required
            placeholder="Digite sua matrícula"
            class="matricula-input"
            autocomplete="off"
          />
        </div>

        <button type="submit" class="login-btn">
          <span>Acessar Perfil</span>
          <i class="fas fa-arrow-right" style="font-size: 18px"></i>
        </button>
      </form>

      <!-- Rodapé -->
      <div class="login-footer">
        <p>
          <i
            class="fas fa-question-circle"
            style="margin-right: 6px; color: #667eea"
          ></i
          >Não sabe sua matrícula? <span>Contate seu superior.</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useUserSessionStore } from "@/store/userSessionStore";

export default {
  name: "LoginView",
  setup() {
    const router = useRouter();
    const userSessionStore = useUserSessionStore();
    return { router, userSessionStore };
  },
  data() {
    return {
      matricula: "",
    };
  },
  methods: {
    handleLogin() {
      if (!this.matricula.trim()) {
        return;
      }

      // Fazer login como usuário comum
      this.userSessionStore.loginUsuarioComum(this.matricula);

      // Redireciona diretamente para a rota /perfil/matricula
      this.router.push(`/perfil/${this.matricula}`);
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Elementos decorativos de fundo - mais bolinhas */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -80px;
  left: -80px;
  animation-delay: 1s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 20%;
  right: 10%;
  animation-delay: 2s;
}

.circle-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 10%;
  animation-delay: 3s;
}

.circle-5 {
  width: 80px;
  height: 80px;
  top: 60%;
  left: 5%;
  animation-delay: 4s;
}

.circle-6 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 20%;
  animation-delay: 5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 3rem 2.5rem;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  text-align: center;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
}

.login-header {
  margin-bottom: 2rem;
}

.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-header h1 {
  color: #2c3e50;
  margin-bottom: 0.8rem;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.login-header p {
  color: #7f8c8d;
  margin-bottom: 0;
  font-size: 1rem;
}

.input-group {
  margin-bottom: 2rem;
  text-align: left;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.matricula-input {
  width: 100%;
  padding: 15px 15px 15px 50px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
  font-weight: 500;
  color: #2c3e50;
  box-sizing: border-box;
}

.matricula-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.matricula-input::placeholder {
  color: #a0a0a0;
  font-weight: 400;
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  box-sizing: border-box;
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(102, 126, 234, 0.4);
}

.login-btn:active {
  transform: translateY(-1px);
}

.login-footer {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(236, 240, 241, 0.7);
}

.login-footer p {
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 0;
}

.login-footer span {
  color: #667eea;
  font-weight: 600;
}

/* Animações */
.login-card {
  animation: fadeIn 0.6s ease-out;
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

/* Responsividade */
@media (max-width: 480px) {
  .login-card {
    padding: 2.5rem 1.5rem;
    margin: 0 10px;
  }

  .login-header h1 {
    font-size: 1.6rem;
  }

  .logo-container {
    width: 70px;
    height: 70px;
    margin-bottom: 1.2rem;
  }

  .decoration-circle {
    display: none; /* Esconde algumas bolinhas em mobile para não poluir */
  }

  .circle-1,
  .circle-2 {
    display: block;
  }
}
</style>
