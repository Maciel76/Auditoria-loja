<template>
  <div class="navegacao-rankings">
    <h2>
      <i class="fas fa-compass"></i>
      Explorar
    </h2>

    <div class="rankings-cards">
      <router-link to="/ranking" class="ranking-card usuarios-card">
        <div class="card-icon">
          <img src="/src/assets/svg/ranking.svg" alt="Ranking" />
        </div>
        <div class="card-content">
          <h3>Ranking Colaboradores</h3>
          <p>Veja a classificação de todos os colaboradores</p>
        </div>
        <div class="card-arrow">
          <i class="fas fa-arrow-right"></i>
        </div>
      </router-link>

      <router-link to="/ranking-lojas" class="ranking-card lojas-card">
        <div class="card-icon">
          <img src="/src/assets/svg/ranking.png" alt="Ranking Lojas" />
        </div>
        <div class="card-content">
          <h3>Ranking Lojas</h3>
          <p>Compare o desempenho entre as unidades</p>
        </div>
        <div class="card-arrow">
          <i class="fas fa-arrow-right"></i>
        </div>
      </router-link>

      <router-link
        v-if="lojaLink"
        :to="lojaLink"
        class="ranking-card minha-loja-card"
      >
        <div class="card-icon">
          <i class="fas fa-store-alt"></i>
        </div>
        <div class="card-content">
          <h3>Minha Loja</h3>
          <p>Veja o desempenho da sua unidade</p>
        </div>
        <div class="card-arrow">
          <i class="fas fa-arrow-right"></i>
        </div>
      </router-link>

      <router-link to="/lojas" class="ranking-card todas-lojas-card">
        <div class="card-icon">
          <i class="fas fa-building"></i>
        </div>
        <div class="card-content">
          <h3>Todas as Lojas</h3>
          <p>Explore e visite outras unidades</p>
        </div>
        <div class="card-arrow">
          <i class="fas fa-arrow-right"></i>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavegacaoRankings",
  props: {
    lojaLink: {
      type: String,
      default: null,
    },
  },
};
</script>

<style scoped>
.navegacao-rankings {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.navegacao-rankings h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 12px;
}

.navegacao-rankings h2 i {
  color: #667eea;
  font-size: 1.5rem;
}

.rankings-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.ranking-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-decoration: none;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ranking-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.ranking-card:hover::before {
  opacity: 1;
}

.ranking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
  background: white;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.card-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.ranking-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.usuarios-card .card-icon {
  background: transparent;
  color: white;
  box-shadow: none;
}

.lojas-card .card-icon {
  background: transparent;
  color: white;
  box-shadow: none;
}

.minha-loja-card .card-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.todas-lojas-card .card-icon {
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.card-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.card-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  transition: color 0.3s ease;
}

.ranking-card:hover .card-content h3 {
  color: #667eea;
}

.card-content p {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.4;
}

.card-arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 1.2rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.ranking-card:hover .card-arrow {
  background: #667eea;
  color: white;
  transform: translateX(5px);
}

/* Mobile */
@media (max-width: 768px) {
  .navegacao-rankings {
    border-radius: 20px;
    padding: 1.5rem 1rem;
    margin-bottom: 1rem;
  }

  .navegacao-rankings h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .navegacao-rankings h2 i {
    font-size: 1.3rem;
  }

  .rankings-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .ranking-card {
    padding: 1.2rem;
    gap: 1rem;
  }

  .card-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .card-content h3 {
    font-size: 1rem;
  }

  .card-content p {
    font-size: 0.85rem;
  }

  .card-arrow {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .card-icon {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }

  .card-content h3 {
    font-size: 0.95rem;
  }

  .card-content p {
    font-size: 0.8rem;
  }

  .card-arrow {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}
</style>
