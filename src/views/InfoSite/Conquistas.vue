<template>
  <div class="conquistas">
    <div class="header">
      <h1>Galeria de Conquistas</h1>
      <p>
        Explore todos os selos que você pode ganhar. Desafie-se a colecionar
        todos!
      </p>
    </div>

    <div class="achievements-grid">
      <div
        v-for="achievement in achievements"
        :key="achievement.title"
        class="achievement-card"
        :class="{ earned: achievement.earned }"
      >
        <div class="achievement-icon">{{ achievement.icon }}</div>
        <div class="achievement-content">
          <h3 class="achievement-title">{{ achievement.title }}</h3>
          <p class="achievement-description">{{ achievement.description }}</p>
        </div>
        <div
          class="achievement-rarity"
          :class="achievement.rarity.toLowerCase()"
        >
          {{ achievement.rarity }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Conquistas",
  data() {
    return {
      // Exemplo de dados. Em um app real, isso viria do perfil do usuário.
      achievements: [
        {
          icon: "🌅",
          title: "Pioneiro do Dia",
          description: "Fez a primeira leitura de uma auditoria no dia.",
          rarity: "Raro",
          earned: true,
        },
        {
          icon: "🏁",
          title: "Finalizador Dourado",
          description: "Fez a última leitura que completou uma auditoria.",
          rarity: "Raro",
          earned: true,
        },
        {
          icon: "🏷️",
          title: "Caçador de Etiquetas",
          description: "Leu 500 itens em auditorias de etiqueta em uma semana.",
          rarity: "Comum",
          earned: true,
        },
        {
          icon: "🕵️",
          title: "Detetive da Ruptura",
          description: "Identificou 30 itens em auditorias de ruptura.",
          rarity: "Comum",
          earned: true,
        },
        {
          icon: "🎯",
          title: "Mira Certa",
          description: "Concluiu uma auditoria de 200 itens sem erros.",
          rarity: "Épico",
          earned: true,
        },
        {
          icon: "⚡",
          title: "Scanner Infalível",
          description: "Realizou 100 leituras consecutivas sem correções.",
          rarity: "Épico",
          earned: true,
        },
        {
          icon: "🤝",
          title: "Dupla Dinâmica",
          description: "Você e um colega leram 250+ itens na mesma auditoria.",
          rarity: "Raro",
          earned: true,
        },
        {
          icon: "🔥",
          title: "Fôlego de Aço",
          description: "Bateu a meta individual por 5 dias consecutivos.",
          rarity: "Épico",
          earned: true,
        },
        {
          icon: "🏆",
          title: "Lenda Viva",
          description: "Realizou auditorias em 100 dias diferentes.",
          rarity: "Lendário",
          earned: true,
        },
        {
          icon: "🗓️",
          title: "Mês Perfeito",
          description: "Auditou em todos os dias úteis de um mês.",
          rarity: "Lendário",
          earned: true,
        },
        {
          icon: "💚",
          title: "Conquista basica ",
          description: "Auditou em todos os dias úteis de um mês.",
          rarity: "basica",
          earned: true,
        },
        {
          icon: "💎",
          title: "Diamante ",
          description: "Auditou em todos os dias úteis de um mês.",
          rarity: "diamante",
          earned: true,
        },
      ],
    };
  },
};
</script>

<style scoped>
.conquistas {
  padding: 2rem;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
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

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.achievement-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  overflow: hidden;

  /* Estilo para conquistas não ganhas */
  filter: grayscale(100%);
  opacity: 0.6;
}

.achievement-card.earned {
  filter: grayscale(0%);
  opacity: 1;
}

.achievement-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.achievement-icon {
  font-size: 3rem;
  line-height: 1;
}

.achievement-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #34495e;
  margin: 0 0 0.5rem 0;
}

.achievement-description {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.achievement-rarity {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.3rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  border-bottom-left-radius: 12px;
}

/* Cores de Raridade */
.basica {
  background-color: #adadad;
} /* Cinza clara */
.comum {
  background-color: #95a5a6;
} /* Cinza */
.raro {
  background-color: #3498db;
} /* Azul */
.épico {
  background-color: #9b59b6;
} /* Roxo */
.lendário {
  background-color: #f1c40f;
} /* Dourado */
.diamante {
  background-color: #2b3b53;
} /* Dourado */
</style>
