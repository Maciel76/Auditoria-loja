<template>
  <transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>
            <i class="fas fa-images"></i>
            Escolha o background da sua loja e edite suas informações
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
              :class="['tab-button', { active: activeTab === 'edit-info' }]"
              @click="openEditInfoTab"
            >
              <i class="fas fa-edit"></i>
              Editar Info
            </button>
            <button
              :class="['tab-button', { active: activeTab === 'avatar-customizer' }]"
              @click="goToAvatarCustomizer"
            >
              <i class="fas fa-user-cog"></i>
              Personalizar Avatar
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
              <!-- Custom image URL input -->
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
          </div>

          <!-- Image adjustment controls (only shown when image is selected) -->
          <div
            v-if="
              activeTab === 'images' &&
              selectedCover &&
              selectedCover.startsWith('http')
            "
            class="image-controls"
          >
            <div class="control-group">
              <label>Posição:</label>
              <select v-model="imagePosition" @change="updateImagePosition">
                <option value="center">Centro</option>
                <option value="top">Topo</option>
                <option value="bottom">Base</option>
                <option value="left">Esquerda</option>
                <option value="right">Direita</option>
              </select>
            </div>
            <div class="control-group">
              <label>Escala:</label>
              <select v-model="imageScale" @change="updateImageScale">
                <option value="cover">Cobrir</option>
                <option value="contain">Contido</option>
                <option value="stretch">Esticar</option>
              </select>
            </div>
          </div>


          <!-- Edit Info tab -->
          <div v-show="activeTab === 'edit-info'" class="edit-info-tab">
            <div class="form-group">
              <label for="storeName">Nome da Loja:</label>
              <input
                type="text"
                id="storeName"
                v-model="editInfo.nome"
                placeholder="Digite o nome da loja"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="storeAddress">Endereço:</label>
              <input
                type="text"
                id="storeAddress"
                v-model="editInfo.endereco"
                placeholder="Digite o endereço da loja"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="storeCity">Cidade:</label>
              <input
                type="text"
                id="storeCity"
                v-model="editInfo.cidade"
                placeholder="Digite a cidade da loja"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="storePhone">Telefone:</label>
              <input
                type="text"
                id="storePhone"
                v-model="editInfo.telefone"
                placeholder="Digite o telefone da loja"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="storeManager">Gerente:</label>
              <input
                type="text"
                id="storeManager"
                v-model="editInfo.gerente"
                placeholder="Digite o nome do gerente"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="storeRegion">Região:</label>
              <input
                type="text"
                id="storeRegion"
                v-model="editInfo.regiao"
                placeholder="Digite a região da loja"
                class="form-control"
              />
            </div>
            <div class="form-actions">
              <button class="btn btn-secondary" @click="cancelEdit">
                Cancelar
              </button>
              <button class="btn btn-primary" @click="saveStoreInfo">
                Salvar Informações
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">
            Cancelar
          </button>
          <button
            class="btn btn-primary"
            @click="saveSelection"
            :disabled="(activeTab !== 'badges' && !selectedCover) || saving"
          >
            <i class="fas fa-check"></i>
            {{
              saving
                ? "Salvando..."
                : activeTab === "badges"
                ? "Salvar Selos"
                : "Salvar"
            }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "CoverSelector",
  components: {
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    currentCover: {
      type: String,
      default: null,
    },
    lojaCodigo: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue", "cover-selected", "go-to-avatar-customizer"],
  data() {
    return {
      selectedCover: null,
      selectedAvatar: null,
      saving: false,
      activeTab: "gradients", // Default to gradients tab
      imagePosition: "center", // Default image position
      imageScale: "cover", // Default image scale
      customImageUrl: "", // Custom image URL input
      // Editable store info
      editInfo: {
        nome: "",
        endereco: "",
        cidade: "",
        telefone: "",
        gerente: "",
        regiao: "",
      },
      isEditing: false, // Flag to track if we're in edit mode
      selectedBadges: [], // Selected badges
      maxBadges: 3, // Maximum number of badges that can be selected
      badges: [
        {
          id: "badge-destaque",
          name: "Destaque",
          icon: "fa-trophy",
          description: "Loja em destaque",
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
          name: "Azul Roxo (Padrão)",
          type: "gradient",
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
          id: "gradient-2",
          name: "Verde Azul",
          type: "gradient",
          gradient: "linear-gradient(135deg, #15b638 0%, #0575E6 100%)",
        },
        {
          id: "gradient-3",
          name: "Laranja Rosa",
          type: "gradient",
          gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        },
        {
          id: "gradient-4",
          name: "Roxo Pink",
          type: "gradient",
          gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        },
        {
          id: "gradient-5",
          name: "Vermelho Laranja",
          type: "gradient",
          gradient: "linear-gradient(135deg, #f83600 0%, #f9d423 100%)",
        },
        {
          id: "gradient-6",
          name: "Azul Profundo",
          type: "gradient",
          gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        },
        {
          id: "gradient-7",
          name: "Verde Limão",
          type: "gradient",
          gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        },
        {
          id: "gradient-8",
          name: "Roxo Noturno",
          type: "gradient",
          gradient: "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)",
        },
        {
          id: "gradient-9",
          name: "Cinza Minimalista",
          type: "gradient",
          gradient: "linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)",
        },
        {
          id: "gradient-10",
          name: "Turquesa",
          type: "gradient",
          gradient: "linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%)",
        },
        {
          id: "gradient-11",
          name: "Pôr do Sol",
          type: "gradient",
          gradient: "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
        },
        {
          id: "gradient-12",
          name: "Floresta",
          type: "gradient",
          gradient: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
        },
      ],
      patterns: [
        {
          id: "pattern-1",
          name: "Listrado Diagonal",
          type: "pattern",
          pattern:
            "repeating-linear-gradient(45deg, #667eea, #667eea 20px, #764ba2 20px, #764ba2 40px)",
        },
        {
          id: "pattern-2",
          name: "Listrado Horizontal",
          type: "pattern",
          pattern:
            "repeating-linear-gradient(0deg, #15b638, #15b638 20px, #0575E6 20px, #0575E6 40px)",
        },
        {
          id: "pattern-3",
          name: "Xadrez Moderno",
          type: "pattern",
          pattern:
            "linear-gradient(45deg, #fa709a 25%, transparent 25%, transparent 75%, #fa709a 75%), linear-gradient(45deg, #fa709a 25%, transparent 25%, transparent 75%, #fa709a 75%) 40px 40px, linear-gradient(to bottom, #fee140, #fee140)",
          backgroundSize: "80px 80px",
        },
        {
          id: "pattern-4",
          name: "Pontilhado",
          type: "pattern",
          pattern: "radial-gradient(circle, #4facfe 3px, transparent 3px)",
          backgroundSize: "30px 30px",
          backgroundColor: "#f0f9ff",
        },
        {
          id: "pattern-5",
          name: "Ondas Suaves",
          type: "pattern",
          pattern:
            "repeating-linear-gradient(90deg, #43e97b 0px, #43e97b 20px, #38f9d7 20px, #38f9d7 40px)",
        },
        {
          id: "pattern-6",
          name: "Listras Angulares",
          type: "pattern",
          pattern:
            "repeating-linear-gradient(60deg, #4e54c8 0px, #4e54c8 20px, #8f94fb 20px, #8f94fb 40px)",
        },
      ],
      images: [
        {
          id: "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1450&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          name: "Galaxia Azul",
          type: "image",
          url: "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1450&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: "https://www.assai.com.br/sites/default/files/styles/otimizado/public/assai-50-anos-novo-logo-2024-capa.jpg?itok=Rb4ugNi9",
          name: "Assaí Atacadista",
          type: "image",
          url: "https://www.assai.com.br/sites/default/files/styles/otimizado/public/assai-50-anos-novo-logo-2024-capa.jpg?itok=Rb4ugNi9",
        },
        {
          id: "https://images.unsplash.com/photo-1672752970077-cd1c92934183?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          name: "Arranha-céu Noturno",
          type: "image",
          url: "https://images.unsplash.com/photo-1672752970077-cd1c92934183?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
          name: "Montanhas Neblina",
          type: "image",
          url: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
          name: "Selva Tropical",
          type: "image",
          url: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
          name: "Paisagem Abstrata",
          type: "image",
          url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1450&auto=format&fit=crop",
          name: "Ondas Coloridas",
          type: "image",
          url: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1450&auto=format&fit=crop",
        },
        {
          id: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1472&auto=format&fit=crop",
          name: "Terra do Espaço",
          type: "image",
          url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1472&auto=format&fit=crop",
        },
        {
          id: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1470&auto=format&fit=crop",
          name: "Via Láctea",
          type: "image",
          url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1470&auto=format&fit=crop",
        },
        {
          id: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1470&auto=format&fit=crop",
          name: "Gradiente Roxo",
          type: "image",
          url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1470&auto=format&fit=crop",
        },
        {
          id: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1470&auto=format&fit=crop",
          name: "Cidade Moderna",
          type: "image",
          url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1470&auto=format&fit=crop",
        },
        {
          id: "https://cdn.80.lv/api/upload/meta/14046/images/5f627dc3d4ae6/contain_1200x630.png",
          name: "Tema exclusivo loja 347",
          type: "image",
          url: "https://cdn.80.lv/api/upload/meta/14046/images/5f627dc3d4ae6/contain_1200x630.png",
        },
        {
          id: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1471&auto=format&fit=crop",
          name: "Floresta Verde",
          type: "image",
          url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1471&auto=format&fit=crop",
        },
        {
          id: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1632&auto=format&fit=crop",
          name: "Praia Tropical",
          type: "image",
          url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1632&auto=format&fit=crop",
        },
        {
          id: "https://plus.unsplash.com/premium_photo-1661886226212-7389947aaaa7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          name: "Avião nas Nuvens",
          type: "image",
          url: "https://plus.unsplash.com/premium_photo-1661886226212-7389947aaaa7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          name: "Por do Sol Águas Turquesa",
          type: "image",
          url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1470&auto=format&fit=crop",
          name: "Tech Azul",
          type: "image",
          url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1470&auto=format&fit=crop",
        },
        {
          id: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1423&auto=format&fit=crop",
          name: "Aurora Boreal",
          type: "image",
          url: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1423&auto=format&fit=crop",
        },
        {
          id: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1473&auto=format&fit=crop",
          name: "Oceano Azul",
          type: "image",
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1473&auto=format&fit=crop",
        },
        {
          id: "https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?q=80&w=1528&auto=format&fit=crop",
          name: "Deserto Dourado",
          type: "image",
          url: "https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?q=80&w=1528&auto=format&fit=crop",
        },
        {
          id: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1470&auto=format&fit=crop",
          name: "Arte Geométrica",
          type: "image",
          url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1470&auto=format&fit=crop",
        },
      ],
    };
  },
  watch: {
    currentCover: {
      immediate: true,
      handler(val) {
        this.selectedCover = val || "gradient-1";
      },
    },
  },
  methods: {
    getCoverStyle(cover) {
      if (cover.type === "gradient") {
        return {
          background: cover.gradient,
        };
      } else if (cover.type === "pattern") {
        const style = {
          backgroundImage: cover.pattern,
        };

        // Adicionar propriedades opcionais se existirem
        if (cover.backgroundSize) {
          style.backgroundSize = cover.backgroundSize;
        }
        if (cover.backgroundColor) {
          style.backgroundColor = cover.backgroundColor;
        }
        if (cover.backgroundPosition) {
          style.backgroundPosition = cover.backgroundPosition;
        }

        return style;
      } else if (cover.type === "image") {
        return {
          backgroundImage: `url(${cover.url})`,
          backgroundSize: this.imageScale,
          backgroundPosition: this.imagePosition,
        };
      }
      return {};
    },

    updateImagePosition() {
      // Update the preview when position changes
      this.$forceUpdate();
    },

    updateImageScale() {
      // Update the preview when scale changes
      this.$forceUpdate();
    },

    async openEditInfoTab() {
      // Load current store info into the edit form
      if (this.lojaCodigo) {
        await this.initializeEditForm();
      }
      this.activeTab = "edit-info";
    },

    selectCover(coverId) {
      this.selectedCover = coverId;
    },

    goToAvatarCustomizer() {
      // Fecha o modal atual e redireciona para a página de personalização de avatar
      this.$emit("update:modelValue", false);
      // Emite um evento para indicar que deve ir para a página de personalização de avatar
      this.$emit("go-to-avatar-customizer");
    },

    closeModal() {
      this.$emit("update:modelValue", false);
    },
    saveSelection() {
      if (!this.selectedCover && this.activeTab !== "avatar-customizer") return;

      this.saving = true;
      try {
        let payload = {
          coverType: this.activeTab,
          imagePosition: null,
          imageScale: null,
          selectedAvatar: null,
        };

        if (
          this.activeTab === "gradients" ||
          this.activeTab === "patterns" ||
          this.activeTab === "images"
        ) {
          // Prepare cover data based on the selected tab
          let coverData;
          if (this.activeTab === "gradients") {
            coverData = this.gradients.find((c) => c.id === this.selectedCover);
          } else if (this.activeTab === "patterns") {
            coverData = this.patterns.find((c) => c.id === this.selectedCover);
          } else if (this.activeTab === "images") {
            coverData = this.images.find((c) => c.id === this.selectedCover);
          }

          payload.coverId = this.selectedCover;
          payload.coverData = coverData;
          payload.imagePosition =
            this.activeTab === "images" ? this.imagePosition : null;
          payload.imageScale =
            this.activeTab === "images" ? this.imageScale : null;
        } else if (this.activeTab === "avatar-customizer") {
          // Handle avatar customization - redirect to avatar customization page
          this.$emit("go-to-avatar-customizer");
          this.closeModal();
          return; // Exit early to prevent emitting cover-selected
        }

        this.$emit("cover-selected", payload);

        this.closeModal();

        // Mostrar mensagem de sucesso
        this.$toast?.success(
          this.activeTab === "avatar-customizer"
            ? "Avatar personalizado salvo com sucesso!"
            : "Cover selecionado com sucesso!"
        );
      } catch (error) {
        console.error("Erro ao selecionar:", error);
        this.$toast?.error("Erro ao selecionar. Tente novamente.");
      } finally {
        this.saving = false;
      }
    },

    async saveStoreInfo() {
      // Save store information to the backend
      try {
        this.saving = true;

        // Call the parent component to handle the store info update
        this.$emit("info-updated", {
          ...this.editInfo,
        });

        // Show success message
        this.$toast?.success("Informações da loja atualizadas com sucesso!");

        // Close the modal after saving
        this.closeModal();
      } catch (error) {
        console.error("Erro ao atualizar informações da loja:", error);
        this.$toast?.error("Erro ao atualizar informações. Tente novamente.");
      } finally {
        this.saving = false;
      }
    },

    cancelEdit() {
      // Reset the edit info form
      this.editInfo = {
        nome: "",
        endereco: "",
        cidade: "",
        telefone: "",
        gerente: "",
        regiao: "",
      };
      // Go back to the first tab
      this.activeTab = "gradients";
    },

    // Initialize the edit form with store data
    async initializeEditForm() {
      try {
        // Fetch store data from the API using the lojaCodigo prop
        const response = await fetch(
          `/api/api/perfil-loja/${this.lojaCodigo}`
        );
        if (response.ok) {
          const data = await response.json();
          // Populate the edit form with store data
          this.editInfo = {
            nome: data.loja.nome || "",
            endereco: data.loja.endereco || "",
            cidade: data.loja.cidade || "",
            telefone: data.loja.metadata?.telefone || "",
            gerente: data.loja.metadata?.gerente || "",
            regiao: data.loja.regiao || "",
          };
        }
      } catch (error) {
        console.error("Erro ao carregar informações da loja:", error);
        // Set default values if API call fails
        this.editInfo = {
          nome: "",
          endereco: "",
          cidade: "",
          telefone: "",
          gerente: "",
          regiao: "",
        };
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
          (id) => id !== badgeId
        );
      } else if (this.selectedBadges.length < this.maxBadges) {
        // Add badge if not selected and we haven't reached the limit
        this.selectedBadges.push(badgeId);
      }
    },

    addCustomImage() {
      if (!this.customImageUrl) return;

      // Validate URL format
      try {
        new URL(this.customImageUrl);
      } catch (e) {
        this.$toast?.error("URL inválida. Por favor, insira um link válido.");
        return;
      }

      // Check if this URL already exists in the images array
      const existingImage = this.images.find(
        (img) => img.id === this.customImageUrl
      );

      if (!existingImage) {
        // Add the new custom image to the beginning of the images array
        this.images.unshift({
          id: this.customImageUrl,
          name: "Imagem Personalizada",
          type: "image",
          url: this.customImageUrl,
        });

        this.$toast?.success("Imagem personalizada adicionada!");
      }

      // Select the custom image
      this.selectedCover = this.customImageUrl;

      // Clear the input
      this.customImageUrl = "";
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
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
  color: #95a5a6;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: #f8f9fa;
  color: #e74c3c;
}

.modal-body {
  padding: 30px;
  overflow-y: auto;
  flex: 1;
}

.tabs-nav {
  display: flex;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 20px;
}

.tab-button {
  padding: 12px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  color: #7f8c8d;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-button:hover {
  color: #667eea;
  background: #f8f9fa;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: #f8f9fa;
}

.covers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.image-controls {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 150px;
}

.control-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.control-group select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
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

.custom-image-input {
  margin-bottom: 25px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px dashed #667eea;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.input-group .form-control {
  flex: 1;
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-add:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-hint {
  margin: 0;
  font-size: 0.85rem;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-hint i {
  color: #667eea;
}

.cover-item {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.cover-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.cover-item.selected {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
}

.cover-preview {
  height: 120px;
  position: relative;
  overflow: hidden;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cover-item:hover .cover-overlay,
.cover-item.selected .cover-overlay {
  opacity: 1;
}

.cover-name {
  padding: 12px;
  text-align: center;
  font-weight: 600;
  color: #2c3e50;
  background: #f8f9fa;
  margin: 0;
  font-size: 0.9rem;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e9ecef;
  color: #495057;
}

.btn-secondary:hover:not(:disabled) {
  background: #dee2e6;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

/* Transições do modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .modal-container {
    max-height: 90vh;
    margin: 10px;
  }

  .covers-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .cover-preview {
    height: 90px;
  }

  .modal-header h2 {
    font-size: 1.2rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
