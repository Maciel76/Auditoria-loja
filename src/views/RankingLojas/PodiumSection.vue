<template>
  <div class="podium-section" v-if="topLojas.length >= 3">
    <h2 class="section-title">
      <i class="fas fa-trophy"></i>
      Top 3 Lojas
    </h2>
    <div class="podium-container">
      <!-- 2º Lugar -->
      <div class="podium-card second-place">
        <div class="podium-position">2º</div>
        <div class="podium-medal">🥈</div>
        <div class="loja-avatar">
          <div class="avatar-container silver">
            <img
              v-if="getLojaImagePath(topLojas[1]?.codigo)"
              :src="getLojaImagePath(topLojas[1]?.codigo)"
              :alt="`Loja ${topLojas[1]?.codigo}`"
              class="loja-image"
              @error="handleImageError"
            />
            <div v-else class="loja-initials">
              {{ getLojaInitials(topLojas[1]) }}
            </div>
          </div>
        </div>
        <div class="loja-info">
          <div class="loja-codigo">{{ topLojas[1]?.codigo }}</div>
          <div class="loja-nome">{{ topLojas[1]?.nome || 'Loja ' + topLojas[1]?.codigo }}</div>
        </div>
        <div class="podium-stats">
          <div class="stat">
            <span class="stat-value">{{ topLojas[1]?.itensAuditados?.toLocaleString() || 0 }}</span>
            <span class="stat-label">Itens</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ topLojas[1]?.usuariosAtivos || 0 }}</span>
            <span class="stat-label">Usuários</span>
          </div>
        </div>
      </div>

      <!-- 1º Lugar -->
      <div class="podium-card first-place">
        <div class="podium-position">1º</div>
        <div class="podium-medal">🥇</div>
        <div class="loja-avatar">
          <div class="avatar-container gold">
            <img
              v-if="getLojaImagePath(topLojas[0]?.codigo)"
              :src="getLojaImagePath(topLojas[0]?.codigo)"
              :alt="`Loja ${topLojas[0]?.codigo}`"
              class="loja-image"
              @error="handleImageError"
            />
            <div v-else class="loja-initials">
              {{ getLojaInitials(topLojas[0]) }}
            </div>
          </div>
        </div>
        <div class="loja-info">
          <div class="loja-codigo">{{ topLojas[0]?.codigo }}</div>
          <div class="loja-nome">{{ topLojas[0]?.nome || 'Loja ' + topLojas[0]?.codigo }}</div>
        </div>
        <div class="podium-stats">
          <div class="stat">
            <span class="stat-value">{{ topLojas[0]?.itensAuditados?.toLocaleString() || 0 }}</span>
            <span class="stat-label">Itens</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ topLojas[0]?.usuariosAtivos || 0 }}</span>
            <span class="stat-label">Usuários</span>
          </div>
        </div>
        <div class="crown">👑</div>
      </div>

      <!-- 3º Lugar -->
      <div class="podium-card third-place">
        <div class="podium-position">3º</div>
        <div class="podium-medal">🥉</div>
        <div class="loja-avatar">
          <div class="avatar-container bronze">
            <img
              v-if="getLojaImagePath(topLojas[2]?.codigo)"
              :src="getLojaImagePath(topLojas[2]?.codigo)"
              :alt="`Loja ${topLojas[2]?.codigo}`"
              class="loja-image"
              @error="handleImageError"
            />
            <div v-else class="loja-initials">
              {{ getLojaInitials(topLojas[2]) }}
            </div>
          </div>
        </div>
        <div class="loja-info">
          <div class="loja-codigo">{{ topLojas[2]?.codigo }}</div>
          <div class="loja-nome">{{ topLojas[2]?.nome || 'Loja ' + topLojas[2]?.codigo }}</div>
        </div>
        <div class="podium-stats">
          <div class="stat">
            <span class="stat-value">{{ topLojas[2]?.itensAuditados?.toLocaleString() || 0 }}</span>
            <span class="stat-label">Itens</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ topLojas[2]?.usuariosAtivos || 0 }}</span>
            <span class="stat-label">Usuários</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLojaStore } from '@/store/lojaStore.js';

defineProps({
  topLojas: {
    type: Array,
    default: () => []
  }
});

const lojaStore = useLojaStore();

// Métodos para avatar das lojas (iguais ao RankingCards)
const getLojaImagePath = (codigo) => {
  if (!codigo) return null;

  // Buscar a loja no store
  const lojaDoStore = lojaStore.lojas.find(l => l.codigo === codigo);

  if (lojaDoStore && lojaDoStore.imagem) {
    return lojaDoStore.imagem;
  }

  // Fallback: tentar o padrão do store
  const codigoPadronizado = codigo.toString().padStart(3, "0");
  return `/images/lojas/${codigoPadronizado}.jpg`;
};

const getLojaInitials = (loja) => {
  if (!loja) return '??';

  // Primeiro tentar pegar o nome do store
  const lojaDoStore = lojaStore.lojas.find(l => l.codigo === loja.codigo);
  const nomeCompleto = lojaDoStore?.nome || loja.nome;

  if (nomeCompleto && nomeCompleto.trim()) {
    // Pegar iniciais do nome da loja
    const palavras = nomeCompleto.trim().split(' ');

    // Se tem "Loja" no início, pular ela
    const palavrasLimpas = palavras.filter(palavra =>
      palavra.toLowerCase() !== 'loja' &&
      !palavra.match(/^\d+$/) // Também pular números puros
    );

    if (palavrasLimpas.length > 0) {
      return palavrasLimpas
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join('');
    }
  }

  // Fallback para código da loja
  return loja.codigo.slice(0, 2).toUpperCase();
};

const handleImageError = (event) => {
  // Se a imagem falhar ao carregar, esconder ela para mostrar as iniciais
  event.target.style.display = 'none';
  const nextElement = event.target.nextElementSibling;
  if (nextElement) {
    nextElement.style.display = 'flex';
  }
};
</script>

<style scoped>
.podium-section {
  margin-bottom: 2rem;
  font-family: "Inter", sans-serif;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.podium-container {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 1rem;
  padding: 2rem 0;
}

.podium-card {
  background: white;
  border-radius: 24px;
  padding: 2rem 1.5rem;
  text-align: center;
  border: 2px solid #f1f5f9;
  position: relative;
  transition: all 0.3s ease;
  min-width: 200px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.podium-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #e0e7ff;
}

.first-place {
  order: 2;
  transform: scale(1.1);
  border: 2px solid #fbbf24;
  background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
}

.second-place {
  order: 1;
  border: 2px solid #9ca3af;
  background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
}

.third-place {
  order: 3;
  border: 2px solid #d97706;
  background: linear-gradient(135deg, #fed7aa 0%, #f59e0b 100%);
}

.podium-position {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.podium-medal {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.crown {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
}

/* Avatar da Loja no Pódio */
.loja-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border: 4px solid #e5e7eb;
  position: relative;
  transition: all 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.avatar-container.gold {
  border-color: #fbbf24;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4);
}

.avatar-container.silver {
  border-color: #9ca3af;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  box-shadow: 0 8px 20px rgba(156, 163, 175, 0.4);
}

.avatar-container.bronze {
  border-color: #d97706;
  background: linear-gradient(135deg, #fed7aa, #fdba74);
  box-shadow: 0 8px 20px rgba(217, 119, 6, 0.4);
}

.loja-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.loja-initials {
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.avatar-container.gold .loja-initials {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #92400e;
}

.avatar-container.silver .loja-initials {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  color: white;
}

.avatar-container.bronze .loja-initials {
  background: linear-gradient(135deg, #d97706, #c2410c);
  color: white;
}

.loja-info {
  margin-bottom: 1.5rem;
}

.loja-codigo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.loja-nome {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.podium-stats {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.podium-stats .stat {
  text-align: center;
}

.podium-stats .stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
}

.podium-stats .stat-label {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 1024px) {
  .podium-container {
    flex-direction: column;
    align-items: center;
  }

  .podium-card {
    order: unset !important;
    transform: none !important;
    max-width: 300px;
  }

  .first-place {
    transform: none !important;
  }
}

@media (max-width: 768px) {
  .podium-card {
    padding: 1.5rem 1rem;
    min-width: 160px;
  }

  .podium-medal {
    font-size: 2.5rem;
  }

  .loja-codigo {
    font-size: 1.3rem;
  }
}
</style>