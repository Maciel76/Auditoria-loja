<template>
  <transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>
            <i class="fas fa-palette"></i>
            Personalize seu Perfil
          </h2>
          <button class="btn-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- Tab navigation -->
          <div class="tabs-nav">
            <button
              :class="['tab-button', { active: activeTab === 'gradients' }]"
              @click="activeTab = 'gradients'"
            >
              <i class="fas fa-palette"></i>
              Gradientes
            </button>
            <button
              :class="['tab-button', { active: activeTab === 'patterns' }]"
              @click="activeTab = 'patterns'"
            >
              <i class="fas fa-border-style"></i>
              Padrões
            </button>
            <button
              :class="['tab-button', { active: activeTab === 'images' }]"
              @click="activeTab = 'images'"
            >
              <i class="fas fa-image"></i>
              Imagens
            </button>
            <button
              :class="['tab-button', { active: activeTab === 'badges' }]"
              @click="activeTab = 'badges'"
            >
              <i class="fas fa-certificate"></i>
              Selos
            </button>
            <button
              :class="['tab-button', { active: activeTab === 'avatars' }]"
              @click="activeTab = 'avatars'"
            >
              <i class="fas fa-user-circle"></i>
              Avatares
            </button>
          </div>

          <!-- Tab content -->
          <div class="tab-content">
            <!-- Gradients tab -->
            <div v-show="activeTab === 'gradients'" class="covers-grid">
              <div
                v-for="cover in gradients"
                :key="cover.id"
                class="cover-item"
                :class="{ selected: selectedCover === cover.id }"
                @click="selectCover(cover.id)"
              >
                <div class="cover-preview" :style="getCoverStyle(cover)">
                  <div class="cover-overlay"></div>
                </div>
                <p class="cover-name">{{ cover.name }}</p>
              </div>
            </div>

            <!-- Patterns tab -->
            <div v-show="activeTab === 'patterns'" class="covers-grid">
              <div
                v-for="cover in patterns"
                :key="cover.id"
                class="cover-item"
                :class="{ selected: selectedCover === cover.id }"
                @click="selectCover(cover.id)"
              >
                <div class="cover-preview" :style="getCoverStyle(cover)">
                  <div class="cover-overlay"></div>
                </div>
                <p class="cover-name">{{ cover.name }}</p>
              </div>
            </div>

            <!-- Images tab -->
            <div v-show="activeTab === 'images'">
              <div class="custom-image-input">
                <div class="input-group">
                  <input
                    v-model="customImageUrl"
                    type="url"
                    placeholder="Cole o link da sua imagem aqui (ex: https://...)"
                    class="form-control"
                    @keyup.enter="addCustomImage"
                  />
                  <button
                    class="btn btn-add"
                    @click="addCustomImage"
                    :disabled="!customImageUrl"
                  >
                    <i class="fas fa-plus"></i>
                    Adicionar
                  </button>
                </div>
                <p class="input-hint">
                  <i class="fas fa-info-circle"></i>
                  Cole o link de uma imagem da internet para usar como capa
                  personalizada
                </p>
              </div>

              <div class="covers-grid">
                <div
                  v-for="cover in images"
                  :key="cover.id"
                  class="cover-item"
                  :class="{ selected: selectedCover === cover.id }"
                  @click="selectCover(cover.id)"
                >
                  <div class="cover-preview" :style="getCoverStyle(cover)">
                    <div class="cover-overlay"></div>
                  </div>
                  <p class="cover-name">{{ cover.name }}</p>
                </div>
              </div>
            </div>

            <!-- Badges tab -->
            <div v-show="activeTab === 'badges'" class="badges-tab">
              <p class="tab-description">
                Selecione até {{ maxBadges }} selos para seu perfil:
              </p>
              <div class="badges-grid">
                <div
                  v-for="badge in badges"
                  :key="badge.id"
                  class="badge-item"
                  :class="{
                    selected: isSelected(badge.id),
                    disabled: isDisabled(badge.id),
                  }"
                  @click="toggleBadge(badge.id)"
                >
                  <div class="badge-content">
                    <i class="fas badge-icon" :class="badge.icon"></i>
                    <h4 class="badge-name">{{ badge.name }}</h4>
                    <p class="badge-description">{{ badge.description }}</p>
                  </div>
                  <div class="badge-selection">
                    <i
                      v-if="isSelected(badge.id)"
                      class="fas fa-check-circle selected-icon"
                    ></i>
                    <i v-else class="fas fa-plus-circle unselected-icon"></i>
                  </div>
                </div>
              </div>
              <div class="selected-badges-summary">
                <p>
                  Selos selecionados:
                  <strong>{{ selectedBadges.length }}/{{ maxBadges }}</strong>
                </p>
              </div>
            </div>

            <!-- Avatars tab -->
            <div v-show="activeTab === 'avatars'" class="avatars-tab">
              <AvatarSelector
                v-model="selectedAvatar"
                @update:model-value="handleAvatarChange"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">
            Cancelar
          </button>
          <button class="btn btn-primary" @click="confirmSelection">
            <i class="fas fa-check"></i>
            Aplicar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import AvatarSelector from "./AvatarSelector.vue";

export default {
  name: "UserCoverSelector",
  components: {
    AvatarSelector,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    currentCover: {
      type: String,
      default: "gradient-1",
    },
    userId: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue", "cover-selected"],
  data() {
    return {
      activeTab: "gradients",
      selectedCover: this.currentCover,
      customImageUrl: "",
      selectedBadges: [], // Selected badges
      maxBadges: 3, // Maximum number of badges that can be selected
      selectedAvatar: null, // Selected avatar
      badges: [
        {
          id: "badge-destaque",
          name: "Destaque",
          icon: "fa-trophy",
          description: "Colaborador em destaque",
        },
        {
          id: "badge-ouro",
          name: "Ouro",
          icon: "fa-medal",
          description: "Nível ouro",
        },
        {
          id: "badge-prata",
          name: "Prata",
          icon: "fa-award",
          description: "Nível prata",
        },
        {
          id: "badge-bronze",
          name: "Bronze",
          icon: "fa-certificate",
          description: "Nível bronze",
        },
        {
          id: "badge-qualidade",
          name: "Qualidade",
          icon: "fa-star",
          description: "Excelência em qualidade",
        },
        {
          id: "badge-desempenho",
          name: "Desempenho",
          icon: "fa-bolt",
          description: "Alto desempenho",
        },
        {
          id: "badge-inovacao",
          name: "Inovação",
          icon: "fa-lightbulb",
          description: "Inovação contínua",
        },
        {
          id: "badge-sustentavel",
          name: "Sustentável",
          icon: "fa-leaf",
          description: "Práticas sustentáveis",
        },
        {
          id: "badge-cliente",
          name: "Cliente",
          icon: "fa-heart",
          description: "Excelência no atendimento",
        },
        {
          id: "badge-seguranca",
          name: "Segurança",
          icon: "fa-shield-alt",
          description: "Alta segurança",
        },
      ],
      gradients: [
        {
          id: "gradient-1",
          name: "Roxo Místico",
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
          id: "gradient-2",
          name: "Verde Oceano",
          gradient: "linear-gradient(135deg, #15b638 0%, #0575E6 100%)",
        },
        {
          id: "gradient-3",
          name: "Rosa Aurora",
          gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        },
        {
          id: "gradient-4",
          name: "Azul Suave",
          gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        },
        {
          id: "gradient-5",
          name: "Fogo Ardente",
          gradient: "linear-gradient(135deg, #f83600 0%, #f9d423 100%)",
        },
        {
          id: "gradient-6",
          name: "Céu Límpido",
          gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        },
        {
          id: "gradient-7",
          name: "Menta Fresca",
          gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        },
        {
          id: "gradient-8",
          name: "Noite Estrelada",
          gradient: "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)",
        },
        {
          id: "gradient-9",
          name: "Cinza Elegante",
          gradient: "linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)",
        },
        {
          id: "gradient-10",
          name: "Azul Profundo",
          gradient: "linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%)",
        },
        {
          id: "gradient-11",
          name: "Rosa Pastel",
          gradient: "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
        },
        {
          id: "gradient-12",
          name: "Floresta Tropical",
          gradient: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
        },
      ],
      patterns: [
        {
          id: "pattern-1",
          name: "Listras Diagonais",
          pattern:
            "repeating-linear-gradient(45deg, #667eea, #667eea 20px, #764ba2 20px, #764ba2 40px)",
        },
        {
          id: "pattern-2",
          name: "Listras Verticais",
          pattern:
            "repeating-linear-gradient(0deg, #15b638, #15b638 20px, #0575E6 20px, #0575E6 40px)",
        },
        {
          id: "pattern-3",
          name: "Xadrez Rosa",
          pattern:
            "linear-gradient(45deg, #fa709a 25%, transparent 25%, transparent 75%, #fa709a 75%), linear-gradient(45deg, #fa709a 25%, transparent 25%, transparent 75%, #fa709a 75%) 40px 40px, linear-gradient(to bottom, #fee140, #fee140)",
          size: "80px 80px",
        },
        {
          id: "pattern-4",
          name: "Bolinhas Azuis",
          pattern: "radial-gradient(circle, #4facfe 3px, transparent 3px)",
          size: "30px 30px",
          background: "#f0f9ff",
        },
        {
          id: "pattern-5",
          name: "Listras Menta",
          pattern:
            "repeating-linear-gradient(90deg, #43e97b 0px, #43e97b 20px, #38f9d7 20px, #38f9d7 40px)",
        },
        {
          id: "pattern-6",
          name: "Listras Roxas",
          pattern:
            "repeating-linear-gradient(60deg, #4e54c8 0px, #4e54c8 20px, #8f94fb 20px, #8f94fb 40px)",
        },
      ],
      images: [
        {
          id: "https://images.unsplash.com/photo-1557683316-973673baf926",
          name: "Gradiente Abstrato",
        },
        {
          id: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d",
          name: "Espaço Sideral",
        },
        {
          id: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
          name: "Gradiente Azul",
        },
      ],
    };
  },
  watch: {
    currentCover(newVal) {
      this.selectedCover = newVal;
    },
  },
  methods: {
    closeModal() {
      this.$emit("update:modelValue", false);
    },
    selectCover(coverId) {
      this.selectedCover = coverId;
    },
    confirmSelection() {
      let payload = {
        coverType: this.activeTab,
        selectedBadges: [],
        selectedAvatar: null,
      };

      if (
        this.activeTab === "gradients" ||
        this.activeTab === "patterns" ||
        this.activeTab === "images"
      ) {
        payload.coverId = this.selectedCover;
      } else if (this.activeTab === "badges") {
        // Handle badge selection
        payload.selectedBadges = [...this.selectedBadges]; // Copy the array
      } else if (this.activeTab === "avatars") {
        // Handle avatar selection
        payload.selectedAvatar = this.selectedAvatar;
      }

      this.$emit("cover-selected", payload);
      this.closeModal();
    },
    getCoverStyle(cover) {
      if (cover.gradient) {
        return { background: cover.gradient };
      } else if (cover.pattern) {
        const style = { backgroundImage: cover.pattern };
        if (cover.size) style.backgroundSize = cover.size;
        if (cover.background) style.backgroundColor = cover.background;
        return style;
      } else if (cover.id.startsWith("http")) {
        return {
          backgroundImage: `url('${cover.id}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      }
      return {};
    },
    addCustomImage() {
      if (this.customImageUrl && this.customImageUrl.startsWith("http")) {
        const newImage = {
          id: this.customImageUrl,
          name: "Imagem Personalizada",
        };
        this.images.unshift(newImage);
        this.selectedCover = this.customImageUrl;
        this.customImageUrl = "";
      }
    },

    // Badge selection methods
    isSelected(badgeId) {
      return this.selectedBadges.includes(badgeId);
    },

    isDisabled(badgeId) {
      return (
        !this.isSelected(badgeId) &&
        this.selectedBadges.length >= this.maxBadges
      );
    },

    toggleBadge(badgeId) {
      if (this.isSelected(badgeId)) {
        // Remove badge if already selected
        this.selectedBadges = this.selectedBadges.filter(
          (id) => id !== badgeId,
        );
      } else if (this.selectedBadges.length < this.maxBadges) {
        // Add badge if not selected and we haven't reached the limit
        this.selectedBadges.push(badgeId);
      }
    },

    handleAvatarChange(value) {
      // Atualiza o selectedAvatar quando o AvatarSelector emitir um novo valor
      this.selectedAvatar = value;
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 2rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-header h2 i {
  color: #667eea;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.btn-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #2c3e50;
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.tabs-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e9ecef;
  overflow-x: auto;
}

.tab-button {
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-button:hover {
  color: #667eea;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  min-height: 400px;
}

.covers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.cover-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid transparent;
}

.cover-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.cover-item.selected {
  border-color: #667eea;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.cover-preview {
  height: 120px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.cover-overlay {
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
}

.cover-name {
  text-align: center;
  margin-top: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
}

.custom-image-input {
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.form-control {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-add:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-hint {
  font-size: 0.85rem;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 6px;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f8f9fa;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: #e9ecef;
  color: #6c757d;
}

.btn-secondary:hover {
  background: #dee2e6;
  color: #495057;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

/* Animações */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* Badges tab styles */
.badges-tab {
  padding: 20px 0;
}

.tab-description {
  margin-bottom: 15px;
  color: #7f8c8d;
  font-size: 0.95rem;
  text-align: center;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.badge-item {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
}

.badge-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.badge-item.selected {
  border-color: #667eea;
  background: #f8f9ff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.badge-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f8f9fa;
}

.badge-content {
  flex: 1;
}

.badge-icon {
  font-size: 2.5rem;
  display: block;
  text-align: center;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: transform 0.3s ease;
}

/* Cores específicas para cada badge */
.badge-item .fa-trophy {
  background: linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.badge-item .fa-medal {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.badge-item .fa-award {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.badge-item .fa-certificate {
  background: linear-gradient(135deg, #cd7f32 0%, #d4a574 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.badge-item .fa-star {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.badge-item .fa-bolt {
  background: linear-gradient(135deg, #f83600 0%, #f9d423 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.badge-item .fa-lightbulb {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.badge-item .fa-leaf {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.badge-item .fa-heart {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.badge-item .fa-shield-alt {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.badge-item:hover .badge-icon {
  transform: scale(1.15);
}

.badge-item.selected .badge-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.badge-name {
  margin: 0 0 5px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.badge-description {
  margin: 0;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.badge-selection {
  margin-left: 10px;
}

.selected-icon {
  color: #667eea;
  font-size: 1.5rem;
}

.unselected-icon {
  color: #bdc3c7;
  font-size: 1.5rem;
}

.selected-badges-summary {
  margin-top: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  color: #2c3e50;
}

/* Avatars tab styles */
.avatars-tab {
  padding: 20px 0;
}

.avatars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
}

.avatar-item {
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible;
}

.avatar-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.avatar-item.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

.avatar-preview {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
}

.avatar-item.selected .avatar-preview {
  border-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
}
</style>
