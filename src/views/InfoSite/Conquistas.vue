<template>
  <div class="conquistas">
    <div class="header">
      <h1>Galeria de Conquistas</h1>
      <p>
        Explore todos os selos que você pode ganhar. Desafie-se a colecionar
        todos!
      </p>
    </div>

    <!-- Filtros por raridade -->
    <div class="filters">
      <button
        v-for="rarity in rarities"
        :key="rarity.value"
        class="filter-btn"
        :class="{ active: selectedRarity === rarity.value }"
        @click="selectedRarity = rarity.value"
      >
        {{ rarity.label }}
      </button>
    </div>

    <div class="achievements-grid">
      <div
        v-for="achievement in filteredAchievements"
        :key="achievement.title"
        class="achievement-card"
        :class="{ earned: achievement.earned }"
      >
        <div
          class="achievement-icon"
          :class="achievement.rarity.toLowerCase() + '-icon'"
        >
          <Icon :icon="achievement.icon" />
        </div>
        <div class="achievement-content">
          <h3
            class="achievement-title"
            :class="achievement.rarity.toLowerCase() + '-title'"
          >
            {{ achievement.title }}
          </h3>
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
import { Icon } from "@iconify/vue";

export default {
  name: "Conquistas",
  components: {
    Icon,
  },
  data() {
    return {
      selectedRarity: "todas",
      rarities: [
        { value: "todas", label: "Todas" },
        { value: "basica", label: "Básica" },
        { value: "comum", label: "Comum" },
        { value: "raro", label: "Raro" },
        { value: "épico", label: "Épico" },
        { value: "lendário", label: "Lendário" },
        { value: "diamante", label: "Diamante" },
        { value: "especial", label: "Especial" },
      ],
      // Exemplo de dados. Em um app real, isso viria do perfil do usuário.
      achievements: [
        {
          icon: "mdi:weather-sunset",
          title: "Pioneiro do Dia",
          description: "Fez a primeira leitura de uma auditoria no dia.",
          rarity: "Raro",
          earned: true,
        },
        {
          icon: "mdi:flag-checkered",
          title: "Finalizador Dourado",
          description: "Fez a última leitura que completou uma auditoria.",
          rarity: "Raro",
          earned: true,
        },
        {
          icon: "mdi:tag-multiple",
          title: "Caçador de Etiquetas",
          description: "Leu 500 itens em auditorias de etiqueta em uma semana.",
          rarity: "Comum",
          earned: true,
        },
        {
          icon: "mdi:magnify",
          title: "Detetive da Ruptura",
          description: "Identificou 30 itens em auditorias de ruptura.",
          rarity: "Comum",
          earned: true,
        },
        {
          icon: "mdi:target",
          title: "Mira Certa",
          description: "Concluiu uma auditoria de 200 itens sem erros.",
          rarity: "Épico",
          earned: true,
        },
        {
          icon: "mdi:lightning-bolt",
          title: "Scanner Infalível",
          description: "Realizou 100 leituras consecutivas sem correções.",
          rarity: "Épico",
          earned: true,
        },
        {
          icon: "mdi:account-multiple",
          title: "Dupla Dinâmica",
          description: "Você e um colega leram 250+ itens na mesma auditoria.",
          rarity: "Raro",
          earned: true,
        },
        {
          icon: "mdi:fire",
          title: "Fôlego de Aço",
          description: "Bateu a meta individual por 5 dias consecutivos.",
          rarity: "Épico",
          earned: true,
        },
        {
          icon: "mdi:trophy",
          title: "Lenda Viva",
          description: "Realizou auditorias em 100 dias diferentes.",
          rarity: "Lendário",
          earned: true,
        },
        {
          icon: "mdi:calendar-check",
          title: "Mês Perfeito",
          description: "Auditou em todos os dias úteis de um mês.",
          rarity: "Lendário",
          earned: true,
        },
        {
          icon: "mdi:check-circle",
          title: "Conquista basica ",
          description: "Auditou em todos os dias úteis de um mês.",
          rarity: "basica",
          earned: true,
        },
        {
          icon: "mdi:diamond-stone",
          title: "Diamante ",
          description: "Auditou em todos os dias úteis de um mês.",
          rarity: "diamante",
          earned: true,
        },
        {
          icon: "mdi:crown",
          title: "Lenda Suprema",
          description:
            "Conquista ultra rara reservada para os melhores auditores.",
          rarity: "especial",
          earned: true,
        },
      ],
    };
  },
  computed: {
    filteredAchievements() {
      if (this.selectedRarity === "todas") {
        return this.achievements;
      }
      return this.achievements.filter(
        (achievement) =>
          achievement.rarity.toLowerCase() ===
          this.selectedRarity.toLowerCase(),
      );
    },
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

/* Filtros */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin: 0 auto 2rem;
  max-width: 1400px;
  padding: 0 1rem;
}

.filter-btn {
  padding: 0.6rem 1.2rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-btn:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
  transform: translateY(-2px);
}

.filter-btn.active {
  background-color: #2c3e50;
  color: white;
  border-color: #2c3e50;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.3);
  transform: scale(1.05);
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
}

.achievement-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

/* Cores dos ícones por raridade */
.achievement-card.earned .basica-icon :deep(svg) {
  color: #6c757d;
}

.achievement-card.earned .comum-icon :deep(svg) {
  color: #2b944e;
}

.achievement-card.earned .raro-icon :deep(svg) {
  color: #2471a3;
}

.achievement-card.earned .épico-icon :deep(svg) {
  color: #7d3c98;
}

.achievement-card.earned .lendário-icon :deep(svg) {
  color: #f4d03f;
  filter: drop-shadow(0 2px 4px rgba(244, 208, 63, 0.3));
}

.achievement-card.earned .diamante-icon :deep(svg) {
  color: #29b6f6;
  filter: drop-shadow(0 2px 8px rgba(41, 182, 246, 0.5));
  animation: icon-glow 2s ease-in-out infinite alternate;
}

.achievement-card.earned .especial-icon :deep(svg) {
  color: #ff3b30;
  filter: drop-shadow(0 0 10px rgba(255, 59, 48, 0.8))
    drop-shadow(0 0 20px rgba(255, 99, 71, 0.6));
  animation: icon-rainbow 3s ease-in-out infinite;
}

@keyframes icon-glow {
  from {
    filter: drop-shadow(0 2px 8px rgba(41, 182, 246, 0.5));
  }
  to {
    filter: drop-shadow(0 4px 12px rgba(41, 182, 246, 0.8));
  }
}

@keyframes icon-rainbow {
  0%,
  100% {
    color: #ff3b30;
    filter: drop-shadow(0 0 10px rgba(255, 59, 48, 0.8))
      drop-shadow(0 0 20px rgba(255, 99, 71, 0.6));
  }
  25% {
    color: #ff6347;
    filter: drop-shadow(0 0 10px rgba(255, 99, 71, 0.8))
      drop-shadow(0 0 20px rgba(255, 69, 0, 0.6));
  }
  50% {
    color: #ff4500;
    filter: drop-shadow(0 0 10px rgba(255, 69, 0, 0.8))
      drop-shadow(0 0 20px rgba(220, 20, 60, 0.6));
  }
  75% {
    color: #dc143c;
    filter: drop-shadow(0 0 10px rgba(220, 20, 60, 0.8))
      drop-shadow(0 0 20px rgba(255, 59, 48, 0.6));
  }
}

.achievement-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #34495e;
  margin: 0 0 0.5rem 0;
  transition: color 0.3s ease;
}

/* Cores dos títulos por raridade */
.basica-title {
  color: #6c757d;
}

.comum-title {
  color: #1c502d;
  font-weight: 600;
}

.raro-title {
  color: #2471a3;
  font-weight: 600;
}

.épico-title {
  color: #7d3c98;
  font-weight: 700;
}

.lendário-title {
  background: linear-gradient(135deg, #f4d03f 0%, #d4ac0d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.diamante-title {
  background: linear-gradient(135deg, #29b6f6 0%, #4fc3f7 50%, #29b6f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  animation: diamond-title-shimmer 3s ease-in-out infinite;
}

.especial-title {
  background: linear-gradient(
    90deg,
    #ff3b30 0%,
    #ff6347 25%,
    #ff4500 50%,
    #dc143c 75%,
    #ff3b30 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  animation: rainbow-title 4s linear infinite;
  text-shadow: 0 0 20px rgba(255, 59, 48, 0.5);
}

@keyframes diamond-title-shimmer {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.3);
  }
}

@keyframes rainbow-title {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
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
  padding: 0.4rem 1.2rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  border-bottom-left-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  z-index: 2;
}

/* Cores de Raridade */
.basica {
  background: linear-gradient(135deg, #b8b8b8 0%, #8e8e8e 100%);
}

.comum {
  background: #43e97b;
}

.raro {
  background: linear-gradient(135deg, #5dade2 0%, #2471a3 100%);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
  animation: pulse-blue 2s ease-in-out infinite;
}

.épico {
  background: linear-gradient(135deg, #bb8fce 0%, #7d3c98 100%);
  box-shadow: 0 3px 12px rgba(155, 89, 182, 0.5);
  animation: pulse-purple 2s ease-in-out infinite;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.lendário {
  background: linear-gradient(135deg, #f4d03f 0%, #d4ac0d 50%, #f4d03f 100%);
  box-shadow:
    0 4px 15px rgba(241, 196, 15, 0.6),
    inset 0 -2px 5px rgba(0, 0, 0, 0.2),
    inset 0 2px 5px rgba(255, 255, 255, 0.4);
  border: 2px solid #f9e79f;
  animation: shine-gold 3s ease-in-out infinite;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.diamante {
  background: linear-gradient(
    135deg,
    #e3f2fd 0%,
    #b3e5fc 15%,
    #81d4fa 30%,
    #4fc3f7 45%,
    #29b6f6 50%,
    #4fc3f7 55%,
    #81d4fa 70%,
    #b3e5fc 85%,
    #e3f2fd 100%
  );
  background-size: 200% 200%;
  box-shadow:
    0 0 20px rgba(41, 182, 246, 0.8),
    0 0 40px rgba(3, 169, 244, 0.6),
    0 5px 25px rgba(0, 0, 0, 0.3),
    inset 0 1px 10px rgba(255, 255, 255, 0.8),
    inset 0 -1px 10px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.9);
  animation:
    diamond-shimmer 4s ease-in-out infinite,
    glow-diamond 2s ease-in-out infinite alternate;
  overflow: hidden;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow:
    0 1px 2px rgba(255, 255, 255, 0.8),
    0 -1px 2px rgba(0, 0, 0, 0.3);
}

.diamante::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: rotate(45deg);
  animation: diamond-reflection 3s linear infinite;
}

.especial {
  background: linear-gradient(
    135deg,
    #ff3b30 0%,
    #ff6347 15%,
    #ff4500 30%,
    #dc143c 45%,
    #ff0000 60%,
    #c0392b 75%,
    #e74c3c 90%,
    #ff3b30 100%
  );
  background-size: 300% 300%;
  box-shadow:
    0 0 25px rgba(255, 59, 48, 1),
    0 0 50px rgba(255, 99, 71, 0.8),
    0 0 75px rgba(255, 69, 0, 0.6),
    0 5px 30px rgba(0, 0, 0, 0.4),
    inset 0 1px 15px rgba(255, 255, 255, 0.9),
    inset 0 -1px 15px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(255, 255, 255, 1);
  animation:
    rainbow-shimmer 5s ease-in-out infinite,
    glow-rainbow 2.5s ease-in-out infinite alternate,
    pulse-scale 3s ease-in-out infinite;
  overflow: hidden;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow:
    0 0 5px rgba(255, 255, 255, 1),
    0 0 10px rgba(255, 59, 48, 0.8),
    0 1px 3px rgba(0, 0, 0, 0.5);
}

.especial::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 59, 48, 0.2),
    rgba(255, 255, 255, 0.6),
    rgba(255, 99, 71, 0.2),
    transparent
  );
  transform: rotate(45deg);
  animation: rainbow-reflection 2s linear infinite;
}

.especial::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shine-sweep 3s ease-in-out infinite;
}

/* Animações */
@keyframes pulse-blue {
  0%,
  100% {
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
  }
  50% {
    box-shadow: 0 2px 15px rgba(52, 152, 219, 0.7);
  }
}

@keyframes pulse-purple {
  0%,
  100% {
    box-shadow: 0 3px 12px rgba(155, 89, 182, 0.5);
  }
  50% {
    box-shadow: 0 3px 20px rgba(155, 89, 182, 0.8);
  }
}

@keyframes shine-gold {
  0%,
  100% {
    background-position: 0% 50%;
    box-shadow:
      0 4px 15px rgba(241, 196, 15, 0.6),
      inset 0 -2px 5px rgba(0, 0, 0, 0.2),
      inset 0 2px 5px rgba(255, 255, 255, 0.4);
  }
  50% {
    background-position: 100% 50%;
    box-shadow:
      0 4px 25px rgba(241, 196, 15, 0.9),
      0 0 30px rgba(244, 208, 63, 0.4),
      inset 0 -2px 5px rgba(0, 0, 0, 0.2),
      inset 0 2px 5px rgba(255, 255, 255, 0.6);
  }
}

@keyframes diamond-shimmer {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes glow-diamond {
  from {
    box-shadow:
      0 0 20px rgba(41, 182, 246, 0.8),
      0 0 40px rgba(3, 169, 244, 0.6),
      0 5px 25px rgba(0, 0, 0, 0.3),
      inset 0 1px 10px rgba(255, 255, 255, 0.8),
      inset 0 -1px 10px rgba(0, 0, 0, 0.2);
  }
  to {
    box-shadow:
      0 0 30px rgba(41, 182, 246, 1),
      0 0 60px rgba(3, 169, 244, 0.8),
      0 0 80px rgba(33, 150, 243, 0.4),
      0 5px 25px rgba(0, 0, 0, 0.3),
      inset 0 1px 10px rgba(255, 255, 255, 1),
      inset 0 -1px 10px rgba(0, 0, 0, 0.2);
  }
}

@keyframes diamond-reflection {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

@keyframes rainbow-shimmer {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes glow-rainbow {
  from {
    box-shadow:
      0 0 25px rgba(255, 59, 48, 1),
      0 0 50px rgba(255, 99, 71, 0.8),
      0 0 75px rgba(255, 69, 0, 0.6),
      0 5px 30px rgba(0, 0, 0, 0.4),
      inset 0 1px 15px rgba(255, 255, 255, 0.9),
      inset 0 -1px 15px rgba(0, 0, 0, 0.3);
  }
  to {
    box-shadow:
      0 0 35px rgba(255, 59, 48, 1),
      0 0 70px rgba(255, 99, 71, 1),
      0 0 100px rgba(255, 69, 0, 0.8),
      0 0 125px rgba(220, 20, 60, 0.6),
      0 5px 30px rgba(0, 0, 0, 0.4),
      inset 0 1px 15px rgba(255, 255, 255, 1),
      inset 0 -1px 15px rgba(0, 0, 0, 0.3);
  }
}

@keyframes pulse-scale {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

@keyframes rainbow-reflection {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

@keyframes shine-sweep {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Responsividade Mobile */
@media (max-width: 768px) {
  .conquistas {
    padding: 1rem;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .header p {
    font-size: 0.95rem;
    padding: 0 1rem;
  }

  .filters {
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    letter-spacing: 0.3px;
  }

  .achievements-grid {
    grid-template-columns: 1fr !important;
    gap: 1rem;
  }

  .achievement-card {
    padding: 1.25rem;
    gap: 1rem;
  }

  .achievement-icon {
    font-size: 2.5rem;
    width: 3rem;
    height: 3rem;
  }

  .achievement-title {
    font-size: 1.05rem;
  }

  .achievement-description {
    font-size: 0.85rem;
  }

  .achievement-rarity {
    padding: 0.35rem 1rem;
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .conquistas {
    padding: 0.75rem;
  }

  .header {
    margin-bottom: 2rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .header p {
    font-size: 0.9rem;
  }

  .filters {
    gap: 0.4rem;
  }

  .filter-btn {
    padding: 0.45rem 0.85rem;
    font-size: 0.75rem;
  }

  .achievements-grid {
    gap: 0.875rem;
  }

  .achievement-card {
    padding: 1rem;
    gap: 0.875rem;
    border-radius: 10px;
  }

  .achievement-icon {
    font-size: 2.25rem;
    width: 2.75rem;
    height: 2.75rem;
  }

  .achievement-title {
    font-size: 1rem;
  }

  .achievement-description {
    font-size: 0.8rem;
    line-height: 1.5;
  }

  .achievement-rarity {
    padding: 0.3rem 0.85rem;
    font-size: 0.65rem;
    border-bottom-left-radius: 10px;
  }

  /* Ajustes nas animações para mobile - reduzir intensidade */
  .achievement-card:hover {
    transform: translateY(-3px);
  }
}

/* Landscape mobile */
@media (max-width: 900px) and (orientation: landscape) {
  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .header h1 {
    font-size: 1.6rem;
  }

  .header {
    margin-bottom: 2rem;
  }
}

/* Tablets */
@media (min-width: 481px) and (max-width: 768px) {
  .achievements-grid {
    grid-template-columns: 1fr !important;
  }
}

/* Tablets landscape e small desktops */
@media (min-width: 769px) and (max-width: 1024px) {
  .achievements-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  .conquistas {
    padding: 1.5rem;
  }
}
</style>
