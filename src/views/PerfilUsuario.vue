<template>
  <div>
    <div class="perfil-usuario-container">
      <div v-if="carregando" class="loading-container">
        <div class="spinner"></div>
        <p>Carregando perfil...</p>
      </div>

      <div v-else-if="!usuario.id" class="error-container">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Usuário não encontrado</h3>
        <p>O colaborador solicitado não foi encontrado no sistema.</p>
      </div>

      <div v-else>
        <!-- Header do Perfil -->
        <div class="perfil-header">
          <div class="perfil-cover" :style="coverStyle">
            <div class="cover-pattern"></div>
            <div class="cover-overlay">
              <button
                class="btn-edit-cover"
                @click="showCoverSelector = true"
                v-if="
                  !userSessionStore.isUsuarioComum ||
                  (userSessionStore.isUsuarioComum &&
                    usuario.id === userSessionStore.getUsuarioId)
                "
              >
                <i class="fas fa-pencil-alt"></i>
                <span class="btn-tooltip">Personalizar Perfil</span>
              </button>

              <!-- Badge de Usuário Comum -->
              <!-- <div
                v-if="
                  userSessionStore.isUsuarioComum &&
                  usuario.id === userSessionStore.getUsuarioId
                "
                class="usuario-comum-badge"
              >
                <i class="fas fa-user"></i> -->
              <!-- <span>Modo Visualização</span> -->
              <!-- </div>  -->

              <div class="header-actions">
                <button
                  v-if="usuario.loja"
                  class="user-status"
                  @click="irParaPerfilLoja"
                >
                  <img
                    src="@/assets/svg/StorePerfil.svg"
                    alt="Loja"
                    class="store-icon"
                  />
                  {{ usuario.loja.nome }}
                </button>

                <!-- Botão de Logout para Usuário Comum -->
                <button
                  v-if="userSessionStore.isUsuarioComum"
                  class="btn-logout"
                  @click="fazerLogout"
                  title="Sair"
                >
                  <i class="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal de Seleção de Cover -->
          <UserCoverSelector
            v-model="showCoverSelector"
            :current-cover="usuario.coverId"
            :user-id="usuario.id"
            @cover-selected="handleCoverSelected"
            @go-to-avatar-customizer="goToAvatarCustomizerFromSelector"
          />

          <div class="perfil-info">
            <div class="avatar-container">
              <div class="avatar-wrapper">
                <img
                  :src="usuario.foto"
                  :alt="usuario.nome"
                  class="avatar-img"
                />
                <div class="level-badge">
                  <span class="level-icon">⭐</span>
                  Nível {{ usuario.nivel }}
                </div>
              </div>
            </div>

            <div class="perfil-details">
              <div class="user-header">
                <h1 class="nome-usuario">{{ usuario.nome }}</h1>
              </div>
              <p class="titulo-usuario">
                <i class="fas fa-award"></i>
                {{ usuario.titulo }}
              </p>
              <div class="xp-container">
                <span class="xp-text">
                  {{ usuario.xpAtual }} XP | Faltam
                  {{ usuario.xpParaProximoNivel }} XP para o próximo nível
                </span>
              </div>
            </div>

            <div class="perfil-stats">
              <div class="stat-item">
                <div class="stat-number">
                  {{
                    usuario.totaisAcumulados?.itensLidosTotal ||
                    usuario.contador ||
                    0
                  }}
                </div>
                <div class="stat-label">Itens Auditados</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">
                  #{{ usuario.ranking?.posicaoLoja || posicaoRanking }}
                </div>
                <div class="stat-label">Ranking</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">
                  {{ usuario.totalAuditorias || 0 }}
                </div>
                <div class="stat-label">Auditorias</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navegação para Rankings - Visível para Usuário Comum -->
        <NavegacaoRankings
          v-if="userSessionStore.isUsuarioComum"
          :loja-link="
            usuario.loja ? `/perfil-loja/${usuario.loja.codigo}` : null
          "
        />

        <!-- Navegação por Abas -->
        <PerfilNavegacao :aba-ativa="abaAtiva" @mudar-aba="abaAtiva = $event" />

        <!-- Progresso -->
        <ProgressoUsuario
          v-if="abaAtiva === 'progresso'"
          :usuario="usuario"
          :posicao-ranking="posicaoRanking"
          :total-conquistas="conquistasDesbloqueadas.length"
          :conquistas-pendentes="conquistasBloqueadas.length"
        />

        <!-- Minha Auditoria -->
        <MinhaAuditoria v-if="abaAtiva === 'auditoria'" :usuario="usuario" />

        <!-- Colegas da Mesma Loja -->
        <ColegasLoja
          v-if="abaAtiva === 'colegas' && usuario.loja && usuario.loja.nome"
          :loja="usuario.loja.nome"
          :usuario-atual-id="usuario.id"
        />

        <!-- Galeria de Conquistas -->
        <div v-if="abaAtiva === 'conquistas'" class="conquistas-gallery">
          <div class="gallery-header">
            <div class="header-title">
              <h2>
                <i class="fas fa-trophy"></i>
                Galeria de Conquistas
              </h2>
              <p class="subtitle">Desbloqueie conquistas e ganhe XP extra!</p>
            </div>

            <div class="progresso-geral">
              <div class="progresso-info">
                <span class="progresso-label">Progresso Geral</span>
                <span class="progresso-numeros">
                  {{ conquistasDesbloqueadas.length }} /
                  {{ todasConquistas.length }}
                </span>
              </div>
              <div class="progresso-bar">
                <div
                  class="progresso-fill"
                  :style="{ width: progressoPercentual + '%' }"
                >
                  <span class="progresso-text">{{ progressoPercentual }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Filtros e Ordenação -->
          <div class="conquistas-controls">
            <div class="filtros-tabs">
              <button
                class="tab-btn"
                :class="{ active: filtroAtivo === 'todas' }"
                @click="filtroAtivo = 'todas'"
              >
                <i class="fas fa-list"></i>
                Todas ({{ todasConquistas.length }})
              </button>
              <button
                class="tab-btn"
                :class="{ active: filtroAtivo === 'desbloqueadas' }"
                @click="filtroAtivo = 'desbloqueadas'"
              >
                <i class="fas fa-check-circle"></i>
                Desbloqueadas ({{ conquistasDesbloqueadas.length }})
              </button>
              <button
                class="tab-btn"
                :class="{ active: filtroAtivo === 'bloqueadas' }"
                @click="filtroAtivo = 'bloqueadas'"
              >
                <i class="fas fa-lock"></i>
                Bloqueadas ({{ conquistasBloqueadas.length }})
              </button>
            </div>

            <div class="ordenacao">
              <label>
                <i class="fas fa-filter"></i>
                Filtrar por Raridade:
              </label>
              <select v-model="filtroRaridade" class="ordenacao-select">
                <option value="">Todas as Raridades</option>
                <option value="Basica">Básica</option>
                <option value="Comum">Comum</option>
                <option value="Raro">Raro</option>
                <option value="Epico">Épico</option>
                <option value="Lendario">Lendário</option>
                <option value="Diamante">Diamante</option>
                <option value="Especial">Especial</option>
              </select>
            </div>
          </div>

          <!-- Grid de Conquistas -->
          <div v-if="conquistasFiltradas.length === 0" class="conquistas-empty">
            <i class="fas fa-medal"></i>
            <p>Nenhuma conquista encontrada nesta categoria.</p>
          </div>

          <div v-else class="conquistas-grid">
            <div
              v-for="conquista in conquistasFiltradas"
              :key="conquista.achievementId"
              class="achievement-card"
              :class="{
                earned: conquista.desbloqueada,
                [conquista.rarity.toLowerCase()]: true,
              }"
              @click="abrirModalDetalhes(conquista)"
              style="cursor: pointer"
            >
              <div
                class="achievement-icon"
                :class="conquista.rarity.toLowerCase() + '-icon'"
              >
                {{ conquista.icon }}
              </div>

              <div class="achievement-content">
                <h4
                  class="achievement-title"
                  :class="conquista.rarity.toLowerCase() + '-title'"
                >
                  {{ conquista.title }}
                </h4>
                <p class="achievement-description">
                  {{ conquista.description }}
                </p>
              </div>

              <div
                class="achievement-rarity"
                :class="conquista.rarity.toLowerCase()"
              >
                {{ conquista.rarity }}
              </div>
            </div>
          </div>

          <!-- Estatísticas Adicionais -->
          <div class="conquistas-stats">
            <div class="stat-box">
              <i class="fas fa-fire"></i>
              <div class="stat-info">
                <span class="stat-value">{{ xpTotal }}</span>
                <span class="stat-label">XP Total</span>
              </div>
            </div>
            <div class="stat-box">
              <i class="fas fa-star"></i>
              <div class="stat-info">
                <span class="stat-value">{{ xpConquistas }}</span>
                <span class="stat-label">XP de Conquistas</span>
              </div>
            </div>
            <div class="stat-box">
              <i class="fas fa-gem"></i>
              <div class="stat-info">
                <span class="stat-value">{{ xpAuditoria }}</span>
                <span class="stat-label">XP de Auditoria</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Fecha conquistas-gallery -->
      </div>
      <!-- Fecha v-else -->
    </div>
    <!-- Fecha perfil-usuario-container -->

    <!-- Modal de Detalhes da Conquista -->
    <div
      v-if="mostrarModalDetalhes"
      class="modal-overlay"
      @click="fecharModalDetalhes"
    >
      <div class="modal-conquista-detalhes" @click.stop>
        <div class="modal-header">
          <div class="modal-icon-rarity">
            <span class="modal-icon">{{ conquistaSelecionada?.icon }}</span>
            <span
              v-if="conquistaSelecionada?.rarity"
              class="badge-raridade-modal"
              :class="conquistaSelecionada?.rarity.toLowerCase()"
            >
              {{ conquistaSelecionada?.rarity }}
            </span>
          </div>
          <h3 class="modal-title">{{ conquistaSelecionada?.title }}</h3>
          <button class="modal-close" @click="fecharModalDetalhes">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <p class="modal-description">
            {{ conquistaSelecionada?.description }}
          </p>

          <div class="modal-info-grid">
            <div class="info-item">
              <i class="fas fa-star"></i>
              <span class="info-label">XP:</span>
              <span class="info-value">{{ conquistaSelecionada?.points }}</span>
            </div>

            <div class="info-item">
              <i class="fas fa-trophy"></i>
              <span class="info-label">Status:</span>
              <span
                class="info-value"
                :class="{
                  'status-desbloqueada': conquistaSelecionada?.desbloqueada,
                  'status-bloqueada': !conquistaSelecionada?.desbloqueada,
                }"
              >
                {{
                  conquistaSelecionada?.desbloqueada
                    ? "Desbloqueada"
                    : "Bloqueada"
                }}
              </span>
            </div>

            <div
              v-if="
                conquistaSelecionada?.desbloqueada &&
                conquistaSelecionada?.unlockedAt
              "
              class="info-item"
            >
              <i class="fas fa-calendar-check"></i>
              <span class="info-label">Desbloqueada em:</span>
              <span class="info-value">{{
                formatarData(conquistaSelecionada?.unlockedAt)
              }}</span>
            </div>

            <div
              v-if="
                !conquistaSelecionada?.desbloqueada &&
                conquistaSelecionada?.progress
              "
              class="info-item"
            >
              <i class="fas fa-chart-line"></i>
              <span class="info-label">Progresso:</span>
              <span class="info-value"
                >{{ conquistaSelecionada?.progress.current }} /
                {{ conquistaSelecionada?.progress.target }}</span
              >
            </div>

            <div
              v-if="
                !conquistaSelecionada?.desbloqueada &&
                conquistaSelecionada?.progress
              "
              class="info-item"
            >
              <i class="fas fa-percentage"></i>
              <span class="info-label">Porcentagem:</span>
              <span class="info-value"
                >{{ conquistaSelecionada?.progress.percentage }}%</span
              >
            </div>

            <div
              v-if="
                !conquistaSelecionada?.desbloqueada &&
                conquistaSelecionada?.progress
              "
              class="info-item-full"
            >
              <span class="info-label">Barra de Progresso:</span>
              <div class="modal-progress-container">
                <div class="modal-progress-bar">
                  <div
                    class="modal-progress-fill"
                    :style="{
                      width: conquistaSelecionada?.progress.percentage + '%',
                    }"
                  ></div>
                </div>
                <div class="modal-progress-text">
                  {{ conquistaSelecionada?.progress.percentage }}% completo
                </div>
              </div>
            </div>

            <!-- Informações detalhadas de progresso -->
            <div
              v-if="
                !conquistaSelecionada?.desbloqueada &&
                conquistaSelecionada?.progress
              "
              class="progress-details-grid"
            >
              <div class="progress-detail-item">
                <i class="fas fa-play-circle"></i>
                <span class="detail-label">Atual:</span>
                <span class="detail-value">{{
                  conquistaSelecionada?.progress.current
                }}</span>
              </div>
              <div class="progress-detail-item">
                <i class="fas fa-flag-checkered"></i>
                <span class="detail-label">Meta:</span>
                <span class="detail-value">{{
                  conquistaSelecionada?.progress.target
                }}</span>
              </div>
              <div class="progress-detail-item">
                <i class="fas fa-calculator"></i>
                <span class="detail-label">Faltam:</span>
                <span class="detail-value">{{
                  conquistaSelecionada?.progress.target -
                  conquistaSelecionada?.progress.current
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

/* Estilos existentes mantidos... */

/* Estilos para a barra de progresso das conquistas */
.conquista-progress-bar {
  width: 100%;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin: 8px 0;
  position: relative;
  opacity: 0.8;
}

.conquista-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.5s ease;
  min-width: 0;
}

.conquista-percentual {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 600;
  display: inline-block;
  margin-top: 4px;
}

/* Ajuste para o layout do footer da conquista */
.conquista-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.8rem;
  border-top: 1px solid #e9ecef;
  flex-wrap: wrap;
  width: 100%;
}

.conquista-progresso {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f8f9fa;
  color: #495057;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #e9ecef;
}

/* Estilos específicos para conquistas bloqueadas */
.conquista-card:not(.desbloqueada) .conquista-progress-bar {
  opacity: 0.7;
}

.conquista-card:not(.desbloqueada) .conquista-progress-fill {
  background: linear-gradient(90deg, #a8a8a8, #6b7280);
}

/* Estilos para o modal de detalhes da conquista */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-conquista-detalhes {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px 24px;
  border-bottom: 2px solid #e9ecef;
  position: relative;
}

.modal-icon-rarity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  font-size: 2rem;
}

.badge-raridade-modal {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.badge-raridade-modal.basica {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.badge-raridade-modal.comum {
  background: linear-gradient(135deg, #10b981, #059669);
}

.badge-raridade-modal.raro {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.badge-raridade-modal.epico {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.badge-raridade-modal.lendario {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.badge-raridade-modal.diamante {
  background: linear-gradient(135deg, #06b6d4, #0e7490);
}

.badge-raridade-modal.especial {
  background: linear-gradient(135deg, #ec4899, #db2777);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  flex: 1;
  padding-left: 16px;
}

.modal-close {
  background: #e9ecef;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  color: #6c757d;
}

.modal-close:hover {
  background: #dc3545;
  color: white;
  transform: scale(1.1);
}

.modal-body {
  padding: 24px;
}

.modal-description {
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.modal-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-item-full {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.85rem;
}

.info-value {
  font-weight: 700;
  color: #2c3e50;
}

.status-desbloqueada {
  color: #28a745;
}

.status-bloqueada {
  color: #dc3545;
}

.modal-progress-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.modal-progress-bar {
  width: 100%;
  height: 16px;
  background: #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  margin: 8px 0;
  position: relative;
}

.modal-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 8px;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.modal-progress-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}

.modal-progress-text {
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
  width: fit-content;
  margin: 0 auto;
}

/* Estilos para os detalhes de progresso */
.progress-details-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  border: 1px solid #dee2e6;
}

.progress-detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.progress-detail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.progress-detail-item i {
  font-size: 1.2rem;
  color: #667eea;
  margin-bottom: 4px;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6c757d;
  text-align: center;
  display: block;
}

.detail-value {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
}

/* Estilos para conquistas baseados no modelo Conquistas.vue */
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

/* Cores dos ícones por raridade */
.achievement-card.earned .basica-icon {
  color: #6c757d;
}

.achievement-card.earned .comum-icon {
  color: #2b944e;
}

.achievement-card.earned .raro-icon {
  color: #2471a3;
}

.achievement-card.earned .epico-icon {
  color: #7d3c98;
}

.achievement-card.earned .lendario-icon {
  color: #f4d03f;
  filter: drop-shadow(0 2px 4px rgba(244, 208, 63, 0.3));
}

.achievement-card.earned .diamante-icon {
  color: #29b6f6;
  filter: drop-shadow(0 2px 8px rgba(41, 182, 246, 0.5));
  animation: icon-glow 2s ease-in-out infinite alternate;
}

.achievement-card.earned .especial-icon {
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
  color: #555555;
}

.comum-title {
  color: #525252;
  font-weight: 600;
}

.raro-title {
  color: #f3f3f3;
  font-weight: 600;
}

.epico-title {
  color: #7d3c98;
  font-weight: 700;
}

.lendario-title {
  background: linear-gradient(135deg, #f4d03f 0%, #d4ac0d 100%);
  color: #b8860b;
  text-shadow:
    0 1px 6px #fffbe6,
    0 2px 8px #b8860b,
    0 1px 0 #fffbe6;
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
  background: linear-gradient(135deg, #b8b8b8 0%, #e6e3e3 100%);
}

.comum {
  background: linear-gradient(135deg, #73db6f 0%, #41b973 100%);
}

.raro {
  background: linear-gradient(135deg, #5dade2 0%, #2471a3 100%);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
  animation: pulse-blue 2s ease-in-out infinite;
}

.epico {
  background: linear-gradient(135deg, #bb8fce 0%, #7d3c98 100%);
  box-shadow: 0 3px 12px rgba(155, 89, 182, 0.5);
  animation: pulse-purple 2s ease-in-out infinite;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.lendario {
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

/* Ajuste para dispositivos móveis */
@media (max-width: 768px) {
  .conquista-footer {
    align-items: center;
  }

  .conquista-progresso {
    font-size: 0.7rem;
    padding: 2px 6px;
  }

  .conquista-percentual {
    font-size: 0.7rem;
  }

  .modal-conquista-detalhes {
    width: 95%;
    margin: 20px;
  }

  .modal-info-grid {
    grid-template-columns: 1fr;
  }

  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .modal-title {
    padding-left: 0;
  }

  /* Ajustes para o novo estilo de conquistas */
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

  /* Layout de 2 colunas para mobile */
  .conquistas-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

/* Ajuste para telas muito pequenas */
@media (max-width: 480px) {
  .conquistas-grid {
    grid-template-columns: 1fr !important;
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
}
</style>

<script>
import { useRouter } from "vue-router";
import { useNivelStore } from "@/store/nivelStore";
import { useLojaStore } from "@/store/lojaStore";
import { useUserSessionStore } from "@/store/userSessionStore";
import UserCoverSelector from "@/components/UserCoverSelector.vue";
import ColegasLoja from "@/components/ColegasLoja.vue";
import NavegacaoRankings from "@/components/NavegacaoRankings.vue";
import PerfilNavegacao from "@/views/Perfiltemplate/PerfilNavegacao.vue";
import MinhaAuditoria from "@/views/Perfiltemplate/MinhaAuditoria.vue";
import ProgressoUsuario from "@/views/Perfiltemplate/ProgressoUsuario.vue";
import api from "@/config/api";
import axios from "axios";

export default {
  name: "PerfilUsuario",
  components: {
    UserCoverSelector,
    ColegasLoja,
    NavegacaoRankings,
    PerfilNavegacao,
    MinhaAuditoria,
    ProgressoUsuario,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const router = useRouter();
    const lojaStore = useLojaStore();
    const nivelStore = useNivelStore();
    const userSessionStore = useUserSessionStore();

    const voltarParaLista = () => {
      // Verificar se veio de uma rota específica ou usar rota padrão
      if (router.options.history.state.back) {
        router.back();
      } else {
        router.push("/usuarios");
      }
    };

    return {
      voltarParaLista,
      lojaStore,
      nivelStore,
      userSessionStore,
    };
  },
  data() {
    return {
      usuario: {
        id: "",
        nome: "",
        contador: 0,
        foto: "",
        iniciais: "",
        xpConquistas: 0,
        totalAuditorias: 0,
        nivel: 0,
        titulo: "",
        xpAtual: 0,
        xpParaProximoNivel: 100,
        progressoXp: 0,
        conquistas: [], // IDs das conquistas desbloqueadas
        coverId: "gradient-1",
        selectedBadges: [],
        loja: null, // Informação da loja do usuário
      },
      carregando: true,
      todasConquistas: [],
      showCoverSelector: false,
      filtroAtivo: "desbloqueadas", // Alterado de "todas" para "desbloqueadas"
      filtroRaridade: "", // Filtro por raridade específico
      ordenacaoAtiva: "padrao",
      abaAtiva: "conquistas",
      mostrarModalDetalhes: false,
      conquistaSelecionada: null,
    };
  },
  watch: {
    // Monitorar mudanças no ID da rota para recarregar o perfil
    id: {
      handler(novoId, antigoId) {
        if (novoId !== antigoId) {
          // Resetar dados para evitar exibição de dados antigos durante o carregamento
          this.usuario = {
            id: "",
            nome: "",
            contador: 0,
            foto: "",
            iniciais: "",
            xpConquistas: 0,
            totalAuditorias: 0,
            nivel: 0,
            titulo: "",
            xpAtual: 0,
            xpParaProximoNivel: 100,
            progressoXp: 0,
            conquistas: [],
            coverId: "gradient-1",
            selectedBadges: [],
            loja: null,
          };
          this.todasConquistas = [];
          this.carregando = true;
          
          this.carregarUsuarioPorId(novoId).then(() => {
            return this.carregarConquistasUsuario();
          }).finally(() => {
            this.carregando = false;
          });
        }
      },
      immediate: true
    },
  },
  async mounted() {
    // A lógica de carregamento será tratada pelo watcher do ID
    // Isso evita duplicação de chamadas e garante consistência
  },
  computed: {
    xpProgressoPercentual() {
      // Primeiro tenta usar o progresso do modelo MetricasUsuario
      if (
        this.usuario.achievements &&
        this.usuario.achievements.level &&
        this.usuario.achievements.level.progressPercentage !== undefined
      ) {
        return this.usuario.achievements.level.progressPercentage;
      }

      // Caso contrário, calcula manualmente com base no XP para o próximo nível
      // A barra de progresso deve representar o progresso até o próximo nível
      // Regras:
      // xpTotal = XP total acumulado do usuário (this.usuario.xpAtual)
      // xpFaltando = XP que falta para o próximo nível (this.usuario.xpParaProximoNivel)
      // xpProximoNivel = xpTotal + xpFaltando
      // Cálculo da barra: progresso = xpTotal / xpProximoNivel, porcentagem = progresso * 100
      if (
        this.usuario.xpAtual !== undefined &&
        this.usuario.xpParaProximoNivel !== undefined
      ) {
        // Calcular o XP total necessário para o próximo nível
        const xpTotalProximoNivel =
          this.usuario.xpAtual + this.usuario.xpParaProximoNivel;

        // Calcular o progresso como porcentagem do caminho até o próximo nível
        if (xpTotalProximoNivel > 0) {
          const progresso = this.usuario.xpAtual / xpTotalProximoNivel;
          const porcentagem = progresso * 100;

          // Limitar entre 0 e 100
          return Math.max(0, Math.min(100, porcentagem));
        }
      }

      // Caso contrário, usa o valor existente no objeto do usuário
      return this.usuario.progressoXp || 0;
    },

    posicaoRanking() {
      if (!this.usuario.id) return "-";
      // Primeiro tenta usar o ranking do modelo MetricasUsuario
      if (
        this.usuario.ranking &&
        this.usuario.ranking.posicaoLoja !== undefined
      ) {
        return this.usuario.ranking.posicaoLoja;
      }
      // Caso contrário, calcula pela store (fallback)
      try {
        return this.nivelStore.calcularPosicaoRanking(this.usuario.id);
      } catch (error) {
        console.warn("Erro ao calcular posição ranking:", error);
        return "-";
      }
    },

    conquistasDesbloqueadas() {
      return this.todasConquistas.filter((c) => c.desbloqueada);
    },

    conquistasBloqueadas() {
      return this.todasConquistas.filter((c) => !c.desbloqueada);
    },

    progressoPercentual() {
      if (this.todasConquistas.length === 0) return 0;
      return Math.round(
        (this.conquistasDesbloqueadas.length / this.todasConquistas.length) *
          100,
      );
    },

    conquistasFiltradas() {
      let conquistas = [];

      // Aplicar filtro principal (Todas, Desbloqueadas, Bloqueadas)
      switch (this.filtroAtivo) {
        case "desbloqueadas":
          conquistas = this.conquistasDesbloqueadas;
          break;
        case "bloqueadas":
          conquistas = this.conquistasBloqueadas;
          break;
        default:
          conquistas = [...this.todasConquistas];
      }

      // Aplicar filtro por raridade
      if (this.filtroRaridade) {
        conquistas = conquistas.filter((c) => c.rarity === this.filtroRaridade);
      }

      // Aplicar ordenação
      switch (this.ordenacaoAtiva) {
        case "xp-desc":
          return conquistas.sort((a, b) => b.points - a.points);
        case "xp-asc":
          return conquistas.sort((a, b) => a.points - b.points);
        case "nome":
          return conquistas.sort((a, b) => a.title.localeCompare(b.title));
        case "raridade":
          // Definir ordem de raridade (do mais raro para o menos raro)
          const ordemRaridade = {
            Especial: 7,
            Diamante: 6,
            Lendario: 5,
            Epico: 4,
            Raro: 3,
            Comum: 2,
            Basica: 1,
          };

          return conquistas.sort((a, b) => {
            const raridadeA = ordemRaridade[a.rarity] || 0;
            const raridadeB = ordemRaridade[b.rarity] || 0;
            return raridadeB - raridadeA; // Ordem decrescente (mais raro primeiro)
          });
        default:
          return conquistas;
      }
    },

    xpTotal() {
      // Usando o campo xp.total do usuário
      return this.usuario.achievements?.xp?.total || 0;
    },

    xpConquistas() {
      // Usando o campo xp.fromAchievements do usuário
      return this.usuario.achievements?.xp?.fromAchievements || 0;
    },

    xpAuditoria() {
      // Usando o campo xp.fromActivities do usuário
      return this.usuario.achievements?.xp?.fromActivities || 0;
    },

    conquistasRarasCount() {
      // Contar conquistas raras (Raro, Épico, Lendário, Diamante, Especial)
      return this.todasConquistas.filter(
        (c) =>
          c.rarity === "Raro" ||
          c.rarity === "Epico" ||
          c.rarity === "Lendario" ||
          c.rarity === "Diamante" ||
          c.rarity === "Especial",
      ).length;
    },

    conquistasEpicasCount() {
      // Contar conquistas épicas (Épico, Lendário, Diamante, Especial)
      return this.todasConquistas.filter(
        (c) =>
          c.rarity === "Epico" ||
          c.rarity === "Lendario" ||
          c.rarity === "Diamante" ||
          c.rarity === "Especial",
      ).length;
    },

    coverStyle() {
      const coverId = this.usuario.coverId || "gradient-1";

      // Check if coverId is a URL (starts with http)
      if (coverId.startsWith("http")) {
        return {
          backgroundImage: `url('${coverId}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      }

      // Check if coverId is a pattern
      if (coverId.startsWith("pattern-")) {
        const patterns = {
          "pattern-1": {
            backgroundImage:
              "repeating-linear-gradient(45deg, #667eea, #667eea 20px, #764ba2 20px, #764ba2 40px)",
          },
          "pattern-2": {
            backgroundImage:
              "repeating-linear-gradient(0deg, #15b638, #15b638 20px, #0575E6 20px, #0575E6 40px)",
          },
          "pattern-3": {
            backgroundImage:
              "linear-gradient(45deg, #fa709a 25%, transparent 25%, transparent 75%, #fa709a 75%), linear-gradient(45deg, #fa709a 25%, transparent 25%, transparent 75%, #fa709a 75%) 40px 40px, linear-gradient(to bottom, #fee140, #fee140)",
            backgroundSize: "80px 80px",
          },
          "pattern-4": {
            backgroundImage:
              "radial-gradient(circle, #4facfe 3px, transparent 3px)",
            backgroundSize: "30px 30px",
            backgroundColor: "#f0f9ff",
          },
          "pattern-5": {
            backgroundImage:
              "repeating-linear-gradient(90deg, #43e97b 0px, #43e97b 20px, #38f9d7 20px, #38f9d7 40px)",
          },
          "pattern-6": {
            backgroundImage:
              "repeating-linear-gradient(60deg, #4e54c8 0px, #4e54c8 20px, #8f94fb 20px, #8f94fb 40px)",
          },
        };

        return patterns[coverId] || patterns["pattern-1"];
      }

      // Otherwise, treat as gradient
      const coverMap = {
        "gradient-1": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-2": "linear-gradient(135deg, #15b638 0%, #0575E6 100%)",
        "gradient-3": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        "gradient-4": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        "gradient-5": "linear-gradient(135deg, #f83600 0%, #f9d423 100%)",
        "gradient-6": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "gradient-7": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        "gradient-8": "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)",
        "gradient-9": "linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)",
        "gradient-10": "linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%)",
        "gradient-11": "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
        "gradient-12": "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
      };

      return {
        background: coverMap[coverId] || coverMap["gradient-1"],
      };
    },
  },
  methods: {
    async carregarUsuarioPorId(usuarioId) {
      try {
        this.carregando = true;

        // Fetch user data from the metricas endpoint
        const config = {
          headers: {
            "x-loja": this.lojaStore.codigoLojaAtual || "056",
          },
        };

        // Primeiro, buscar as métricas do usuário específico
        const response = await api.get(
          `/metricas/usuarios/${usuarioId}`,
          config,
        );
        let usuarioMetricas = response.data; // Agora pegamos diretamente os dados do usuário específico

        if (usuarioMetricas) {
          // Calculate XP total based on the achievements data if available
          const xpTotal =
            usuarioMetricas.achievements?.xp?.total ||
            (usuarioMetricas.contadores?.totalGeral || 0) +
              (usuarioMetricas.xpConquistas || 0);

          // Use XP values from achievements if available, otherwise calculate
          const nivel =
            usuarioMetricas.achievements?.level?.current ||
            this.nivelStore.calcularNivel(xpTotal);
          const xpParaProximoNivel =
            usuarioMetricas.achievements?.level?.xpForNextLevel ||
            this.nivelStore.calcularXpRestante(xpTotal);
          const progressoXp =
            usuarioMetricas.achievements?.level?.progressPercentage ||
            ((xpTotal % 100) / 100) * 100; // Percentage of current XP toward next level

          // Get additional user data from the original API if needed
          let usuarioCompleto = {};
          try {
            const lojaSelecionada = JSON.parse(
              localStorage.getItem("lojaSelecionada") || '{"codigo":"056"}',
            );

            const usuarioResponse = await axios.get(
              `http://localhost:3000/api/usuarios/${usuarioId}`,
              {
                headers: {
                  "x-loja": lojaSelecionada.codigo,
                },
              },
            );

            usuarioCompleto = usuarioResponse.data || {};
          } catch (fetchError) {
            console.warn("Could not fetch additional user data:", fetchError);
          }

          this.usuario = {
            ...usuarioCompleto, // Original user data
            id: usuarioMetricas.id,
            nome: usuarioMetricas.nome,
            contador: usuarioMetricas.contador || 0, // Itens auditados from metricas
            totalAuditorias: usuarioMetricas.contadores?.totalGeral || 0, // Total auditorias from metricas usando o campo correto do endpoint
            ranking: usuarioMetricas.ranking || {}, // Adicionando informações de ranking do modelo MetricasUsuario
            totaisAcumulados: usuarioMetricas.totaisAcumulados || {}, // Adicionando totais acumulados do modelo MetricasUsuario
            foto: this.getFotoUrl(usuarioCompleto),
            iniciais: this.obterIniciais(usuarioMetricas.nome),
            nivel: usuarioMetricas.achievements?.level?.current || nivel,
            titulo:
              usuarioMetricas.achievements?.level?.title ||
              this.nivelStore.obterTitulo(
                nivel || usuarioMetricas.achievements?.level?.current,
              ),
            xpAtual: usuarioMetricas.achievements?.xp?.total || xpTotal,
            xpParaProximoNivel:
              usuarioMetricas.achievements?.level?.xpForNextLevel ||
              xpParaProximoNivel,
            progressoXp:
              usuarioMetricas.achievements?.level?.progressPercentage ||
              progressoXp,
            conquistas: usuarioCompleto.conquistas || [],
            achievements: usuarioMetricas.achievements || {}, // Adicionando as conquistas do modelo MetricasUsuario
            coverId: usuarioCompleto.coverId || "gradient-1",
            selectedBadges: usuarioCompleto.selectedBadges || [],
            loja: usuarioCompleto.loja || null,
          };

          // Update the user in nivelStore to keep it consistent
          const indexInStore = this.nivelStore.usuarios.findIndex(
            (u) => u.id === usuarioId,
          );
          if (indexInStore !== -1) {
            this.nivelStore.usuarios[indexInStore] = { ...usuarioMetricas };
          } else {
            // If user doesn't exist in store, add it
            this.nivelStore.usuarios.push({ ...usuarioMetricas });
          }
        } else {
          console.error(
            "Usuário não encontrado nos dados de métricas:",
            usuarioId,
          );
          this.usuario = {}; // Clear user to show error screen
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        this.carregando = false;
      }
    },

    async carregarConquistasUsuario() {
      try {
        // Buscar conquistas do usuário diretamente do modelo MetricasUsuario via endpoint específico
        const config = {
          headers: {
            "x-loja": this.lojaStore.codigoLojaAtual || "056",
          },
        };

        // Buscar as conquistas específicas do usuário
        const response = await api.get(
          `/metricas/conquistas/${this.usuario.id}`,
          config,
        );

        if (
          response.data &&
          response.data.achievements &&
          response.data.achievements.achievements
        ) {
          // Processar as conquistas do modelo MetricasUsuario
          const conquistasUsuario =
            response.data.achievements.achievements || [];

          // Mapear as conquistas do usuário para o formato esperado pelo template
          this.todasConquistas = conquistasUsuario.map((conquista) => {
            return {
              achievementId: conquista.achievementId,
              title:
                conquista.achievementData?.title ||
                conquista.title ||
                "Conquista Desconhecida",
              description:
                conquista.achievementData?.description ||
                conquista.description ||
                "Descrição não disponível",
              icon: conquista.achievementData?.icon || conquista.icon || "🏆",
              rarity:
                conquista.rarity ||
                conquista.achievementData?.rarity ||
                "Comum",
              points:
                conquista.fixedXpValue ||
                conquista.achievementData?.points ||
                0,
              desbloqueada: conquista.unlocked || false,
              unlockedAt: conquista.unlockedAt,
              progress: conquista.progress || {}, // Manter o objeto completo de progresso
              progresso: conquista.progress?.percentage || 0, // Manter para compatibilidade
              criteria:
                conquista.achievementData?.criteria || conquista.criteria || {},
            };
          });

          // Atualizar também os dados de achievements no objeto do usuário para garantir consistência
          if (response.data.achievements) {
            this.usuario.achievements = {
              ...this.usuario.achievements,
              ...response.data.achievements,
            };
          }
        } else {
          // Se não encontrar conquistas específicas, usar as do modelo MetricasUsuario como fallback
          this.processarConquistasUsuario();
        }
      } catch (error) {
        console.warn(
          "Erro ao carregar conquistas específicas do usuário, usando fallback:",
          error,
        );
        // Em caso de erro, usar as conquistas do modelo MetricasUsuario como fallback
        this.processarConquistasUsuario();
      }
    },

    processarConquistasUsuario() {
      // Processar as conquistas diretamente do modelo MetricasUsuario (fallback)
      const conquistasUsuario = this.usuario.achievements?.achievements || [];

      // Mapear as conquistas do usuário para o formato esperado pelo template
      this.todasConquistas = conquistasUsuario.map((conquista) => {
        return {
          achievementId: conquista.achievementId,
          title:
            conquista.achievementData?.title ||
            conquista.title ||
            "Conquista Desconhecida",
          description:
            conquista.achievementData?.description ||
            conquista.description ||
            "Descrição não disponível",
          icon: conquista.achievementData?.icon || conquista.icon || "🏆",
          rarity:
            conquista.rarity || conquista.achievementData?.rarity || "Comum",
          points:
            conquista.fixedXpValue || conquista.achievementData?.points || 0,
          desbloqueada: conquista.unlocked || false,
          unlockedAt: conquista.unlockedAt,
          progress: conquista.progress || {}, // Manter o objeto completo de progresso
          progresso: conquista.progress?.percentage || 0, // Manter para compatibilidade
          criteria:
            conquista.achievementData?.criteria || conquista.criteria || {},
        };
      });
    },

    obterIniciais(nome) {
      if (!nome) return "??";
      return nome
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    },

    getFotoUrl(usuario) {
      if (usuario.foto) {
        // If the photo is already a URL (either uploaded or avatar), return it directly
        return usuario.foto;
      }
      // Generate a default avatar using DiceBear if no photo is set
      const seed = usuario.nome
        ? encodeURIComponent(usuario.nome.toLowerCase())
        : "default";
      return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede&radius=50&size=128`;
    },

    compartilharPerfil() {
      if (navigator.share) {
        navigator
          .share({
            title: `Perfil de ${this.usuario.nome}`,
            text: `Confira o desempenho de ${this.usuario.nome} no sistema de auditoria! ${this.usuario.contador} itens verificados.`,
            url: window.location.href,
          })
          .catch(console.error);
      } else {
        alert(
          "Seu navegador não suporta a funcionalidade de compartilhamento.",
        );
      }
    },

    irParaPerfilLoja() {
      if (this.usuario.loja && this.usuario.loja.codigo) {
        this.$router.push(`/perfil-loja/${this.usuario.loja.codigo}`);
      }
    },

    voltarParaLista() {
      // Garante navegação para rota correta
      if (this.$router) {
        this.$router.push("/usuarios");
      } else {
        window.location.href = "/usuarios";
      }
    },

    formatarData(data) {
      if (!data) return "";
      const date = new Date(data);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      });
    },

    fazerLogout() {
      // Fazer logout do usuário comum
      this.userSessionStore.logoutUsuarioComum();

      // Redirecionar para a página de login
      this.$router.push("/login");
    },

    mudarAba(aba) {
      this.abaAtiva = aba;
    },

    goToAvatarCustomizer() {
      // Navegar para a página de personalização de avatar, passando o ID do usuário
      this.$router.push(`/personalizar-avatar/${this.usuario.id}`);
    },

    goToAvatarCustomizerFromSelector() {
      // Navegar para a página de personalização de avatar
      this.$router.push(`/personalizar-avatar/${this.usuario.id}`);
    },

    async handleCoverSelected(payload) {
      console.log("Cover selecionado:", payload);

      try {
        const response = await this.updateCoverOnBackend(payload);

        if (response.success) {
          // If avatar was selected, update it immediately in the local user object
          if (payload.selectedAvatar) {
            this.usuario.foto = payload.selectedAvatar;

            // Force re-render of the avatar by updating the key or forcing Vue to update
            this.$forceUpdate();
          }

          console.log("Perfil atualizado com sucesso:", payload);

          // Reload the user data to ensure everything is updated
          await this.carregarUsuarioPorId(this.usuario.id);
        } else {
          console.error(
            "Erro ao atualizar perfil no backend:",
            response.message,
          );
          alert("Erro ao atualizar perfil. Por favor, tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        alert("Erro ao atualizar perfil. Por favor, tente novamente.");
      }
    },

    async updateCoverOnBackend(payload) {
      try {
        const updateData = {};

        // Include coverId if provided in the payload
        if (payload.coverId !== undefined) {
          updateData.coverId = payload.coverId;
        }

        // Include selectedBadges if provided in the payload
        if (payload.selectedBadges !== undefined) {
          updateData.selectedBadges = payload.selectedBadges;
        }

        // Include selectedAvatar if provided in the payload
        if (payload.selectedAvatar !== undefined) {
          updateData.selectedAvatar = payload.selectedAvatar;
        }

        const response = await axios.patch(
          `http://localhost:3000/api/usuarios/${this.usuario.id}/cover`,
          updateData,
        );

        return { success: true, data: response.data };
      } catch (error) {
        console.error("Erro ao atualizar perfil no backend:", error);
        return {
          success: false,
          message: error.response?.data?.erro || error.message,
        };
      }
    },

    // Método para abrir o modal de detalhes da conquista
    abrirModalDetalhes(conquista) {
      this.conquistaSelecionada = conquista;
      this.mostrarModalDetalhes = true;
    },

    // Método para fechar o modal de detalhes
    fecharModalDetalhes() {
      this.mostrarModalDetalhes = false;
      this.conquistaSelecionada = null;
    },
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

.perfil-usuario-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  background: #f8f9fa;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 60px 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-container .spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.error-container .error-icon {
  font-size: 3rem;
  color: #ff6b6b;
  margin-bottom: 20px;
}

.error-container h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.error-container p {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.error-container .btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

/* Novo Header - Estilo das Lojas */
.perfil-header {
  background: rgb(255, 255, 255);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
  position: relative;
}

.perfil-cover {
  height: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  transition: background 0.5s ease;
}

.cover-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0px,
    rgba(255, 255, 255, 0.1) 16px,
    transparent 16px,
    transparent 32px
  );
  opacity: 0.7;
  pointer-events: none;
}

.cover-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.usuario-comum-badge {
  background: rgba(52, 152, 219, 0.95);
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.95rem;
  color: white;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.usuario-comum-badge i {
  font-size: 1rem;
}

.btn-logout {
  background: rgba(231, 76, 60, 0.95);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.95rem;
  color: white;
  flex-shrink: 0;
}

.btn-logout:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
  background: rgba(192, 57, 43, 0.95);
}

.btn-edit-cover {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.95rem;
  color: #667eea;
  opacity: 1;
  flex-shrink: 0;
  position: relative;
}

.btn-edit-cover:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  background: white;
  color: #764ba2;
}

.btn-edit-cover i {
  transition: transform 0.3s ease;
}

.btn-edit-cover:hover i {
  transform: scale(1.15);
}

.btn-tooltip {
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%) translateX(-10px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  z-index: 1000;
  letter-spacing: 0.3px;
}

.btn-tooltip::before {
  content: "";
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-right-color: #667eea;
}

.btn-edit-cover:hover .btn-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
  animation: tooltipSlideIn 0.5s ease-out;
}

@keyframes tooltipSlideIn {
  0% {
    transform: translateY(-50%) translateX(-10px) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translateY(-50%) translateX(5px) scale(1.05);
  }
  100% {
    transform: translateY(-50%) translateX(0) scale(1);
    opacity: 1;
  }
}

.user-status {
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: #2859c5;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-status:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  background: white;
}

.store-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.perfil-info {
  padding: 0 30px 30px;
  margin-top: -40px;
  display: flex;
  align-items: flex-end;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.avatar-container {
  position: relative;
}

.avatar-wrapper {
  position: relative;
}

.avatar-img {
  width: 160px;
  height: 160px;
  border-radius: 20px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.avatar-img:hover {
  transform: scale(1.05);
}

.level-badge {
  position: absolute;
  bottom: -10px;
  right: -10px;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 3px solid white;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  display: flex;
  align-items: center;
  gap: 6px;
}

.level-icon {
  font-size: 1.1rem;
}

.perfil-details {
  flex: 1;
  min-width: 300px;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.nome-usuario {
  font-size: 2.5rem;
  margin: 0;
  margin-top: -20px;
  font-weight: 800;
  position: relative;
  z-index: 10;
  background: linear-gradient(90deg, #667eea 10%, #764ba2 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
  padding: 2px 12px 2px 6px;
  transition: color 0.2s;
}

.loja-badge {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 3px 12px rgba(16, 185, 129, 0.3);
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.loja-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 18px rgba(16, 185, 129, 0.4);
}

.loja-badge i {
  font-size: 0.9rem;
}

.titulo-usuario {
  font-size: 1.2rem;
  font-weight: 500;
  color: #667eea;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.xp-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.xp-bar {
  width: 100%;
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.xp-text {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 600;
}

.perfil-stats {
  display: flex;
  gap: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 15px;
  min-width: 280px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Galeria de Conquistas */
.conquistas-gallery {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.gallery-header {
  margin-bottom: 2rem;
}

.header-title {
  margin-bottom: 1.5rem;
}

.gallery-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.gallery-header h2 i {
  color: #f59e0b;
  font-size: 1.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 0;
}

.progresso-geral {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
}

.progresso-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.progresso-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.progresso-numeros {
  font-weight: 700;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.progresso-bar {
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progresso-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 10px;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
}

.progresso-text {
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Controles de Filtros */
.conquistas-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
  flex-wrap: wrap;
}

.filtros-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.6rem 1.2rem;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.tab-btn i {
  font-size: 0.85rem;
}

.ordenacao {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ordenacao label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ordenacao-select {
  padding: 0.6rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ordenacao-select:hover,
.ordenacao-select:focus {
  border-color: #667eea;
  outline: none;
}

/* Empty State */
.conquistas-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
}

.conquistas-empty i {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.conquistas-empty p {
  font-size: 1.1rem;
  margin: 0;
}

/* Grid de Conquistas */
.conquistas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.conquista-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  opacity: 0.6;
  filter: grayscale(70%);
  position: relative;
  overflow: hidden;
}

.conquista-card:hover {
  transform: translateY(-3px);
}

.conquista-card.desbloqueada {
  opacity: 1;
  filter: grayscale(0%);
  background: white;
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
}

.conquista-card.rara.desbloqueada {
  border-color: #8b5cf6;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
}

.conquista-card.epica.desbloqueada {
  border-color: #f59e0b;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
  animation: pulse-epic 2s ease-in-out infinite;
}

@keyframes pulse-epic {
  0%,
  100% {
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
  }
  50% {
    box-shadow: 0 6px 30px rgba(245, 158, 11, 0.5);
  }
}

.badge-raridade {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
}

.badge-raridade.basica {
  background: linear-gradient(135deg, #80858f, #7d848d);
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
}

.badge-raridade.comum {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.badge-raridade.raro {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.badge-raridade.epico {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.badge-raridade.lendario {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
}

.badge-raridade.diamante {
  background: linear-gradient(135deg, #06b6d4, #0e7490);
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4);
}

.badge-raridade.especial {
  background: linear-gradient(135deg, #ec4899, #db2777);
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);
}

.conquista-card.epica .badge-raridade {
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
}

.conquista-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.conquista-card.desbloqueada:hover .conquista-icon {
  transform: scale(1.15) rotate(5deg);
}

.conquista-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.conquista-titulo {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.conquista-descricao {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
  min-height: 40px;
  line-height: 1.4;
}

.conquista-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.8rem;
  border-top: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.conquista-xp {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.conquista-data {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 600;
}

.conquista-data i {
  font-size: 0.7rem;
}

.conquista-progresso {
  display: inline-block;
  background: #fef3c7;
  color: #f59e0b;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Estatísticas de Conquistas */
.conquistas-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
}

.stat-box {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.stat-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.stat-box i {
  font-size: 2rem;
  color: #667eea;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.3rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
}

/* ============================================
   RESPONSIVIDADE MOBILE - APP-LIKE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .perfil-usuario-container {
    padding: 0;
    background: #f8f9fa;
  }

  /* Header estilo app mobile */
  .perfil-header {
    border-radius: 0 0 25px 25px;
    margin-bottom: 1rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .perfil-cover {
    height: 180px;
    border-radius: 0;
  }

  .cover-overlay {
    top: 10px;
    left: 10px;
    right: 10px;
  }

  .usuario-comum-badge {
    padding: 6px 12px;
    font-size: 0.75rem;
    border-radius: 8px;
  }

  .usuario-comum-badge i {
    font-size: 0.8rem;
  }

  .header-actions {
    gap: 8px;
  }

  .btn-logout {
    width: 36px;
    height: 36px;
    font-size: 0.85rem;
  }

  .btn-edit-cover {
    width: 36px;
    height: 36px;
    font-size: 0.85rem;
  }

  .btn-tooltip {
    display: none;
  }

  .user-status {
    padding: 6px 12px;
    font-size: 0.75rem;
    border-radius: 15px;
  }

  .user-status i {
    font-size: 0.7rem;
  }

  /* Layout em coluna para mobile */
  .perfil-info {
    flex-direction: column;
    padding: 0 15px 20px;
    margin-top: -50px;
    gap: 15px;
    align-items: center;
  }

  /* Avatar centralizado */
  .avatar-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .avatar-img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 5px solid white;
  }

  .level-badge {
    bottom: -5px;
    right: -5px;
    padding: 6px 12px;
    font-size: 0.75rem;
    border: 2px solid white;
  }

  .level-icon {
    font-size: 1rem;
  }

  /* Detalhes centralizados */
  .perfil-details {
    width: 100%;
    text-align: center;
    min-width: auto;
  }

  .user-header {
    justify-content: center;
    margin-bottom: 5px;
  }

  .nome-usuario {
    font-size: 1.8rem;
    margin-top: -10px;
    padding: 2px 8px;
  }

  .loja-badge {
    font-size: 0.75rem;
    padding: 5px 12px;
    border-radius: 15px;
  }

  .loja-badge i {
    font-size: 0.8rem;
  }

  .titulo-usuario {
    font-size: 0.9rem;
    margin: 0 0 0.8rem 0;
    justify-content: center;
  }

  .xp-container {
    width: 100%;
  }

  .xp-bar {
    height: 10px;
  }

  .xp-text {
    font-size: 0.8rem;
    text-align: center;
    display: block;
    margin-top: 8px;
  }

  /* Stats em linha horizontal */
  .perfil-stats {
    width: 100%;
    min-width: auto;
    padding: 15px;
    gap: 15px;
    border-radius: 15px;
  }

  .stat-item {
    flex: 1;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.7rem;
    letter-spacing: 0.3px;
  }

  /* Galeria de conquistas */
  .conquistas-gallery {
    border-radius: 25px 25px 0 0;
    padding: 1.5rem 1rem;
    margin: 0 0 0 0;
  }

  .gallery-header h2 {
    font-size: 1.4rem;
  }

  .gallery-header h2 i {
    font-size: 1.2rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .progresso-geral {
    padding: 1rem;
  }

  .progresso-label,
  .progresso-numeros {
    font-size: 0.85rem;
  }

  .conquistas-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .filtros-tabs {
    justify-content: center;
  }

  .tab-btn {
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
  }

  .ordenacao {
    justify-content: space-between;
  }

  .ordenacao label {
    font-size: 0.85rem;
  }

  .ordenacao-select {
    font-size: 0.8rem;
  }

  .conquistas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .conquista-card {
    padding: 0.8rem;
    border-radius: 12px;
  }

  .conquista-icon {
    font-size: 2.5rem;
    margin-bottom: 0.8rem;
  }

  .conquista-titulo {
    font-size: 0.95rem;
  }

  .conquista-descricao {
    font-size: 0.7rem;
    min-height: 35px;
  }

  .tab-btn {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }

  .ordenacao-select {
    font-size: 0.8rem;
  }

  .conquistas-stats {
    gap: 0.6rem;
  }

  .stat-box {
    padding: 0.8rem;
  }

  .stat-value {
    font-size: 1.3rem;
  }
}

/* Mobile pequeno (iPhone SE, etc) */
@media (max-width: 375px) {
  .perfil-cover {
    height: 160px;
  }

  .perfil-info {
    margin-top: -45px;
  }

  .avatar-img {
    width: 100px;
    height: 100px;
    border: 4px solid white;
  }

  .level-badge {
    padding: 5px 10px;
    font-size: 0.75rem;
  }

  .nome-usuario {
    font-size: 1.5rem;
  }

  .titulo-usuario {
    font-size: 0.9rem;
  }

  .perfil-stats {
    padding: 12px;
    gap: 10px;
  }

  .stat-number {
    font-size: 1.3rem;
  }

  .stat-label {
    font-size: 0.65rem;
  }

  .conquistas-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.8rem;
  }

  .conquista-card {
    padding: 0.8rem;
  }

  .conquista-icon {
    font-size: 2rem;
  }

  .conquista-titulo {
    font-size: 0.85rem;
  }

  .conquista-descricao {
    font-size: 0.7rem;
    min-height: 30px;
  }

  .tab-btn {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }

  .ordenacao-select {
    font-size: 0.8rem;
  }

  .conquistas-stats {
    gap: 0.6rem;
  }

  .stat-box {
    padding: 0.8rem;
  }

  .stat-value {
    font-size: 1.3rem;
  }
}

/* Landscape mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .perfil-cover {
    height: 150px;
  }

  .perfil-info {
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: -30px;
    justify-content: center;
  }

  .avatar-container {
    width: auto;
  }

  .avatar-img {
    width: 90px;
    height: 90px;
  }

  .perfil-details {
    flex: 1;
    min-width: 250px;
    text-align: left;
  }

  .user-header {
    justify-content: flex-start;
  }

  .titulo-usuario {
    justify-content: flex-start;
  }

  .perfil-stats {
    width: 100%;
    margin-top: 10px;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .perfil-header {
    border-radius: 20px;
  }

  .perfil-cover {
    height: 220px;
  }

  .perfil-info {
    padding: 0 25px 25px;
    margin-top: -35px;
    gap: 25px;
  }

  .avatar-img {
    width: 140px;
    height: 140px;
  }

  .nome-usuario {
    font-size: 2.2rem;
  }

  .perfil-stats {
    min-width: 250px;
    padding: 18px;
  }

  .conquistas-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.2rem;
  }
}
</style>
