<template>
  <div class="full-ranking-section">
    <h2 class="section-title">
      {{ viewMode === "podium" ? "Demais Colaboradores" : "Ranking Completo" }}
    </h2>

    <div class="ranking-list">
      <div
        v-for="(usuario, index) in usuariosFiltradosOrdenados"
        :key="usuario.id"
        :class="[
          'ranking-item',
          getRankingClass(viewMode === 'podium' ? index + 3 : index),
        ]"
      >
        <div class="rank-number">
          <span class="normal-rank"
            >{{ viewMode === "podium" ? index + 4 : index + 1 }}º</span
          >
        </div>

        <div class="user-info">
          <div class="user-avatar">
            <div
              class="avatar-icon"
              :class="getAvatarClass(viewMode === 'podium' ? index + 3 : index)"
            >
              {{ getUserIcon(index) }}
            </div>
          </div>
          <div class="user-details">
            <h3 class="user-name">{{ usuario.nome }}</h3>
            <p class="user-id">Matrícula: {{ usuario.id }}</p>
          </div>
        </div>

        <div class="score-container">
          <div class="score-bar">
            <div
              class="score-progress"
              :style="{ width: calcularProgresso(usuario.contador) + '%' }"
            ></div>
          </div>
          <div class="score-value">
            {{ usuario.contador }} Produtos Atualizados
          </div>
        </div>

        <div
          class="ranking-badge"
          :class="getBadgeClass(viewMode === 'podium' ? index + 3 : index)"
        >
          <span>{{
            getBadgeIcon(viewMode === "podium" ? index + 3 : index)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RankingList",
  props: {
    usuariosFiltradosOrdenados: {
      type: Array,
      default: () => [],
    },
    viewMode: {
      type: String,
      default: "podium",
    },
    usuariosOrdenados: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    calcularProgresso(itens) {
      const maxItens = this.usuariosOrdenados[0]?.contador || 1;
      return (itens / maxItens) * 100;
    },
    detectarGenero(nome) {
      const nomeCompleto = nome.toLowerCase().trim();
      const primeiroNome = nomeCompleto.split(" ")[0];

      // Lista de nomes femininos comuns no Brasil
      const nomesFemininos = [
        "maria",
        "ana",
        "francisca",
        "antonia",
        "adriana",
        "juliana",
        "marcia",
        "fernanda",
        "patricia",
        "aline",
        "sandra",
        "monica",
        "andrea",
        "rosangela",
        "tatiane",
        "luciana",
        "simone",
        "claudia",
        "vanessa",
        "cristiane",
        "elisangela",
        "vera",
        "fatima",
        "rita",
        "roseli",
        "aparecida",
        "edna",
        "solange",
        "terezinha",
        "carla",
        "kelly",
        "debora",
        "amanda",
        "bruna",
        "jessica",
        "sabrina",
        "priscila",
        "eliane",
        "rosana",
        "marlene",
        "silvia",
        "regina",
        "sonia",
        "denise",
        "celia",
        "valdira",
        "iara",
        "luana",
        "karen",
        "renata",
        "viviane",
        "valeria",
        "roberta",
        "sueli",
        "gisele",
        "karine",
        "larissa",
      ];

      // Lista de nomes masculinos comuns no Brasil
      const nomesMasculinos = [
        "jose",
        "joao",
        "antonio",
        "francisco",
        "carlos",
        "paulo",
        "pedro",
        "lucas",
        "luiz",
        "marcos",
        "luis",
        "gabriel",
        "rafael",
        "daniel",
        "marcelo",
        "bruno",
        "eduardo",
        "felipe",
        "raimundo",
        "rodrigo",
        "manoel",
        "nelson",
        "roberto",
        "fabio",
        "alexandre",
        "sergio",
        "giovanni",
        "antonio",
        "fernando",
        "gustavo",
        "andre",
        "vicente",
        "sebastiao",
        "joao",
        "geraldo",
        "adriano",
        "angelino",
        "benedito",
        "benedito",
        "eder",
        "edson",
        "valdir",
        "wagner",
        "waldemar",
        "wesley",
        "william",
        "ronaldo",
        "richard",
        "reginaldo",
        "renato",
      ];

      if (nomesFemininos.includes(primeiroNome)) {
        return "feminino";
      } else if (nomesMasculinos.includes(primeiroNome)) {
        return "masculino";
      }

      // Heurísticas baseadas em terminações comuns
      if (primeiroNome.endsWith("a") && !primeiroNome.endsWith("ista")) {
        return "feminino";
      } else if (
        primeiroNome.endsWith("o") ||
        primeiroNome.endsWith("r") ||
        primeiroNome.endsWith("l")
      ) {
        return "masculino";
      }

      return "neutro";
    },
    gerarHashNome(nome) {
      // Gera um hash simples baseado no nome para garantir consistência
      let hash = 0;
      for (let i = 0; i < nome.length; i++) {
        const char = nome.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    },
    getRankingClass(index) {
      if (index === 0) return "first-place";
      if (index === 1) return "second-place";
      if (index === 2) return "third-place";
      if (index < 10) return "top-ten";
      return "";
    },
    getBadgeClass(index) {
      if (index === 0) return "gold-badge";
      if (index === 1) return "silver-badge";
      if (index === 2) return "bronze-badge";
      if (index < 10) return "top-ten-badge";
      return "normal-badge";
    },
    getBadgeIcon(index) {
      if (index === 0) return "👑";
      if (index === 1) return "🥈";
      if (index === 2) return "🥉";
      if (index < 10) return "⭐";
      return "📊";
    },
    getUserIcon(index) {
      const realIndex = this.viewMode === "podium" ? index + 3 : index;
      const usuario = this.usuariosFiltradosOrdenados[index];

      if (!usuario) return "👤";

      const genero = this.detectarGenero(usuario.nome);
      const hash = this.gerarHashNome(usuario.nome);

      // Ícones especiais para os primeiros 3 lugares
      if (realIndex === 0) {
        return genero === "feminino" ? "👸" : "🤴"; // Rainha ou Rei
      }
      if (realIndex === 1) {
        return genero === "feminino" ? "👩‍💼" : "👨‍💼"; // Executiva ou Executivo
      }
      if (realIndex === 2) {
        return genero === "feminino" ? "👩‍🎓" : "👨‍🎓"; // Graduada ou Graduado
      }

      // Ícones variados para top 10
      if (realIndex < 10) {
        const iconesFemininos = ["👩‍💻", "👩‍🔬", "👩‍🏫", "👩‍⚕️", "👩‍🎨", "👩‍💼", "👩‍🔧"];
        const iconesMasculinos = ["👨‍💻", "👨‍🔬", "👨‍🏫", "👨‍⚕️", "👨‍🎨", "👨‍💼", "👨‍🔧"];

        if (genero === "feminino") {
          return iconesFemininos[hash % iconesFemininos.length];
        } else {
          return iconesMasculinos[hash % iconesMasculinos.length];
        }
      }

      // Ícones para posições normais
      const iconesFemininosNormais = ["👩", "👵", "🙎‍♀️", "🙍‍♀️", "💁‍♀️", "🙋‍♀️"];
      const iconesMasculinosNormais = ["👨", "👴", "🙎‍♂️", "🙍‍♂️", "💁‍♂️", "🙋‍♂️"];

      if (genero === "feminino") {
        return iconesFemininosNormais[hash % iconesFemininosNormais.length];
      } else {
        return iconesMasculinosNormais[hash % iconesMasculinosNormais.length];
      }
    },
    getAvatarClass(index) {
      if (index === 0) return "avatar-gold";
      if (index === 1) return "avatar-silver";
      if (index === 2) return "avatar-bronze";
      if (index < 10) return "avatar-top-ten";
      return "avatar-normal";
    },
  },
};
</script>

<style scoped>
.full-ranking-section {
  margin-bottom: 40px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: #2c3e50;
  font-weight: 600;
}

.ranking-list {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.3s ease;
}

.ranking-item:hover {
  background-color: #f8f9fa;
}

.ranking-item.first-place {
  background: linear-gradient(135deg, #fff9db 0%, #ffec99 100%);
}

.ranking-item.second-place {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.ranking-item.third-place {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

.ranking-item.top-ten {
  background-color: #f8f9fa;
}

.rank-number {
  width: 60px;
  text-align: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.normal-rank {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  line-height: 40px;
  text-align: center;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 15px;
}

.user-details {
  flex: 1;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.2;
}

.user-id {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.user-avatar {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.avatar-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-color: #ffd700;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.avatar-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  border-color: #c0c0c0;
  box-shadow: 0 4px 15px rgba(192, 192, 192, 0.3);
}

.avatar-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #e6a052 100%);
  border-color: #cd7f32;
  box-shadow: 0 4px 15px rgba(205, 127, 50, 0.3);
}

.avatar-top-ten {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.avatar-normal {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-color: #dee2e6;
}

.score-container {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  max-width: 300px;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.score-progress {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 1s ease;
}

.score-value {
  font-weight: 600;
  color: #2c3e50;
  min-width: 80px;
  text-align: right;
}

.ranking-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.gold-badge {
  background: #fff9db;
}
.silver-badge {
  background: #f8f9fa;
}
.bronze-badge {
  background: #fff3e0;
}
.top-ten-badge {
  background: #e7f5ff;
}
.normal-badge {
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .ranking-item {
    padding: 15px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .rank-number {
    width: auto;
    order: 1;
  }

  .user-info {
    order: 2;
    flex: 1;
    min-width: 200px;
  }

  .score-container {
    order: 3;
    max-width: none;
    flex: 1;
    min-width: 200px;
  }

  .ranking-badge {
    order: 4;
    margin-left: auto;
  }

  .avatar-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .ranking-item {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .user-info {
    flex-direction: column;
    text-align: center;
    order: 1;
  }

  .rank-number {
    order: 2;
    align-self: center;
  }

  .score-container {
    order: 3;
    max-width: none;
  }

  .ranking-badge {
    order: 4;
    align-self: center;
    margin-left: 0;
  }

  .avatar-icon {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }

  .section-title {
    font-size: 1.3rem;
  }
}
</style>
