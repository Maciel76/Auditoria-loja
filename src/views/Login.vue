<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Sistema de Auditoria</h1>
        <p>Digite sua matrícula para acessar seu perfil</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="matricula">Número de Matrícula:</label>
          <input
            type="text"
            id="matricula"
            v-model="matricula"
            required
            placeholder="Ex: 6413358"
            class="matricula-input"
          />
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading">Carregando...</span>
          <span v-else>Acessar Perfil</span>
        </button>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>

      <div class="login-footer">
        <p>Não sabe sua matrícula? Contate seu superior.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "LoginView",
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      matricula: "",
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      if (!this.matricula.trim()) {
        this.errorMessage = "Por favor, digite sua matrícula";
        return;
      }

      this.loading = true;
      this.errorMessage = "";

      try {
        // Verifica se a matrícula existe no sistema
        const matriculaValida = await this.validarMatricula(this.matricula);

        if (matriculaValida) {
          // Redireciona para o perfil do usuário
          this.router.push(`/perfil/${this.matricula}`);
        } else {
          this.errorMessage = "Matrícula não encontrada no sistema";
        }
      } catch (error) {
        console.error("Erro ao validar matrícula:", error);
        this.errorMessage = "Erro ao acessar o sistema. Tente novamente.";
      } finally {
        this.loading = false;
      }
    },

    async validarMatricula(matricula) {
      try {
        // Busca a lista de usuários para verificar se a matrícula existe
        const response = await fetch("http://localhost:3000/usuarios");

        if (response.ok) {
          const usuarios = await response.json();

          // Verifica se a matrícula existe (busca por id ou _id)
          return usuarios.some(
            (usuario) => usuario.id === matricula || usuario._id === matricula
          );
        }
        return false;
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return false;
      }
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
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.login-header p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.matricula-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: border-color 0.3s ease;
}

.matricula-input:focus {
  outline: none;
  border-color: #667eea;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background: #ffeaa7;
  color: #d63031;
  padding: 10px;
  border-radius: 5px;
  margin-top: 1rem;
  border-left: 4px solid #d63031;
}

.login-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
}

.login-footer p {
  color: #95a5a6;
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
