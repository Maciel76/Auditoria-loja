<template>
  <div class="votacao">
    <div class="header">
      <h1>Votação de Novas Funcionalidades</h1>
      <p>
        Ajude-nos a decidir qual funcionalidade devemos desenvolver a seguir.
        Sua opinião é fundamental para o futuro do nosso sistema!
      </p>
    </div>

    <transition name="fade" mode="out-in">
      <!-- Seção de Votação -->
      <div v-if="!votoRegistrado" key="voting" class="voting-section">
        <h2>Qual destas funcionalidades você gostaria de ver no sistema?</h2>
        <div class="options-grid">
          <div
            v-for="opcao in opcoes"
            :key="opcao.id"
            class="option-card"
            :class="{ selected: opcaoSelecionada === opcao.id }"
            @click="opcaoSelecionada = opcao.id"
          >
            <div class="option-icon">{{ opcao.icon }}</div>
            <div class="option-text">{{ opcao.texto }}</div>
            <div class="checkmark-icon" v-if="opcaoSelecionada === opcao.id">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
        <button @click="registrarVoto" :disabled="!opcaoSelecionada">
          Votar Agora
        </button>
      </div>

      <!-- Seção de Resultados -->
      <div v-else key="results" class="results-section">
        <h2>Obrigado por votar!</h2>
        <p>Confira como está a votação até o momento:</p>
        <div class="results-list">
          <div v-for="opcao in opcoes" :key="opcao.id" class="result-card">
            <div class="result-info">
              <span class="result-text">{{ opcao.texto }}</span>
              <span class="result-votes"
                >{{ calcularPorcentagem(opcao.votos) }}% ({{
                  opcao.votos
                }}
                votos)</span
              >
            </div>
            <div class="progress-bar">
              <div
                class="progress"
                :style="{ width: calcularPorcentagem(opcao.votos) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Votacao",
  data() {
    return {
      opcaoSelecionada: null,
      votoRegistrado: false,
      opcoes: [
        {
          id: 1,
          texto: "Aplicativo Móvel para auditoria em campo",
          votos: 25,
          icon: "📱",
        },
        {
          id: 2,
          texto: "Relatórios Personalizados com gráficos",
          votos: 18,
          icon: "📊",
        },
        {
          id: 3,
          texto: "Inteligência Artificial para prever tendências",
          votos: 12,
          icon: "🤖",
        },
        {
          id: 4,
          texto: "Gamificação para engajar colaboradores",
          votos: 8,
          icon: "🏆",
        },
      ],
    };
  },
  computed: {
    totalVotos() {
      return this.opcoes.reduce((total, opcao) => total + opcao.votos, 0);
    },
  },
  methods: {
    registrarVoto() {
      if (this.opcaoSelecionada) {
        const opcao = this.opcoes.find((o) => o.id === this.opcaoSelecionada);
        if (opcao) {
          opcao.votos++;
          this.votoRegistrado = true;
          // Aqui você poderia enviar o voto para o backend
        }
      }
    },
    calcularPorcentagem(votos) {
      if (this.totalVotos === 0) {
        return 0;
      }
      return ((votos / this.totalVotos) * 100).toFixed(1);
    },
  },
};
</script>

<style scoped>
.votacao {
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.header p {
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0.5rem auto 0;
}

.voting-section,
.results-section {
  max-width: 900px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.voting-section h2,
.results-section h2 {
  text-align: center;
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.results-section p {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 2.5rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2.5rem 0;
}

.option-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
  border-color: #ced4da;
}

.option-card.selected {
  border-color: #3498db;
  background-color: #eaf5fc;
  box-shadow: 0 4px 20px rgba(52, 152, 219, 0.2);
}

.option-icon {
  font-size: 2rem;
  background-color: #e9ecef;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.option-card.selected .option-icon {
  background-color: #cce7f7;
}

.option-text {
  font-weight: 500;
  color: #34495e;
  line-height: 1.4;
}

.checkmark-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #3498db;
  background-color: #ffffff;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 1rem auto 0;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  box-shadow: none;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-card {
  background-color: #f8f9fa;
  padding: 1rem 1.5rem;
  border-radius: 8px;
}

.result-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.result-text {
  font-weight: 500;
  color: #34495e;
}

.result-votes {
  font-size: 0.9rem;
  font-weight: 600;
  color: #7f8c8d;
}

.progress-bar {
  background-color: #e9ecef;
  border-radius: 8px;
  height: 12px;
  overflow: hidden;
}

.progress {
  background: linear-gradient(90deg, #3498db, #5dade2);
  height: 100%;
  border-radius: 8px;
  transition: width 0.8s ease-in-out;
}

/* Animação de transição */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
