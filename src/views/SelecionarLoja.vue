<template>
  <div class="selecionar-loja-container">
    <div class="header">
      <h1>🏪 Sistema de Auditorias</h1>
      <p class="subtitulo">Controle de Estoque e Presença de Produtos</p>
    </div>

    <div class="explicacao">
      <h2>Bem-vindo ao Sistema de Auditorias</h2>
      <p>
        Este sistema permite realizar auditorias de etiquetas, presença e
        ruptura de produtos em suas lojas. Selecione sua loja abaixo para
        iniciar o processo de auditoria.
      </p>
    </div>

    <div class="etapa-info">
      <div class="etapa ativa">
        <span class="numero">1</span>
        <span class="texto">Selecionar Loja</span>
      </div>
      <div class="etapa">
        <span class="numero">2</span>
        <span class="texto">Tipo de Auditoria</span>
      </div>
    </div>

    <h3>Selecione sua loja</h3>

    <div class="lojas-grid">
      <div
        v-for="loja in lojas"
        :key="loja.codigo"
        class="loja-card"
        :class="{ selecionada: lojaSelecionada?.codigo === loja.codigo }"
        @click="selecionarLoja(loja)"
      >
        <div class="imagem-loja">
          <img
            :src="getImagemLoja(loja.codigo)"
            :alt="'Imagem da ' + loja.nome"
          />
        </div>
        <div class="info-loja">
          <h4>{{ loja.nome }}</h4>
          <p>Código: {{ loja.codigo }}</p>
        </div>
        <div
          v-if="lojaSelecionada?.codigo === loja.codigo"
          class="selecionado-indicador"
        >
          ✓
        </div>
      </div>
    </div>

    <button
      class="btn-continuar"
      :disabled="!lojaSelecionada"
      @click="continuar"
    >
      Continuar para Etapa 2
    </button>

    <div class="info-rodape">
      <p>
        💡 Dica: Esta seleção determinará onde os dados das auditorias serão
        registrados.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLojaStore } from "../store/lojaStore";
import { useRouter } from "vue-router";

const router = useRouter();
const lojaStore = useLojaStore();

// Imagens locais - substitua pelos caminhos reais das suas imagens
const imagensLojas = {
  "056": "/images/lojas/56.jpg",
  "084": "/images/lojas/84.jpg",
  105: "/images/lojas/105.jpg",
  111: "/images/lojas/111.jpg",
  140: "/images/lojas/140.jpg",
  214: "/images/lojas/214.jpg",
  176: "/images/lojas/176.jpg",
  194: "/images/lojas/194.jpg",
  310: "/images/lojas/310.jpg",
  320: "/images/lojas/320.jpg",
};

// Fallback para imagens padrão caso as locais não existam
const imagemPadrao = "/images/lojas/default.jpg";

const lojas = ref([
  {
    codigo: "56",
    nome: "Goiania Buritis",
    cidade: "Goiânia",
  },
  {
    codigo: "84",
    nome: "Goiania Independência",
    cidade: "Goiânia",
  },
  {
    codigo: "105",
    nome: "T9",
    cidade: "Goiânia",
  },
  {
    codigo: "111",
    nome: "Rio Verde",
    cidade: "Rio Verde",
  },
  {
    codigo: "140",
    nome: "Perimetral",
    cidade: "Goiânia",
  },
  {
    codigo: "214",
    nome: "Caldas Novas",
    cidade: "Caldas Novas",
  },
  {
    codigo: "176",
    nome: "Palmas Teotônio",
    cidade: "Palmas",
  },
  {
    codigo: "194",
    nome: "Anápolis",
    cidade: "Anápolis",
  },
  {
    codigo: "310",
    nome: "Portugal",
    cidade: "Goiânia",
  },
  {
    codigo: "320",
    nome: "Palmas Cesamar",
    cidade: "Palmas",
  },
]);

const lojaSelecionada = ref(null);

function getImagemLoja(codigo) {
  // Retorna a imagem local se existir, senão usa a padrão
  return imagensLojas[codigo] || imagemPadrao;
}

function selecionarLoja(loja) {
  lojaSelecionada.value = loja;
}

function continuar() {
  if (lojaSelecionada.value) {
    lojaStore.selecionarLoja(lojaSelecionada.value);
    router.push("/selecionar-auditoria");
  }
}

onMounted(() => {
  // Carregar loja salva se existir
  lojaStore.carregarLoja();
  if (lojaStore.lojaSelecionada) {
    lojaSelecionada.value = lojaStore.lojaSelecionada;
  }
});
</script>

<style scoped>
.selecionar-loja-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 5px;
  font-size: 2.5rem;
}

.subtitulo {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.explicacao {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.explicacao h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.explicacao p {
  color: #555;
  line-height: 1.6;
}

.etapa-info {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 50px;
}

.etapa {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.5;
}

.etapa.ativa {
  opacity: 1;
}

.etapa .numero {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3372d1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 5px;
}

.etapa .texto {
  font-size: 14px;
  color: #333;
}

h3 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.lojas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.loja-card {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.loja-card:hover {
  border-color: #3372d1;
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.loja-card.selecionada {
  border-color: #3372d1;
  background-color: #f0f5ff;
}

.imagem-loja {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  border: 3px solid #e0e0e0;
}

.loja-card.selecionada .imagem-loja {
  border-color: #3372d1;
}

.imagem-loja img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-loja {
  flex: 1;
  text-align: left;
}

.info-loja h4 {
  font-size: 16px;
  margin-bottom: 5px;
  color: #2c3e50;
}

.info-loja p {
  font-size: 14px;
  color: #7f8c8d;
}

.selecionado-indicador {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #4caf50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.btn-continuar {
  background: #3372d1;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 30px;
}

.btn-continuar:hover:not(:disabled) {
  background: #2858a8;
  transform: translateY(-2px);
}

.btn-continuar:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.info-rodape {
  background: white;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #3372d1;
}

.info-rodape p {
  color: #555;
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .lojas-grid {
    grid-template-columns: 1fr;
  }

  .etapa-info {
    gap: 20px;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>
