<template>
  <div class="open-peeps-customizer">
    <!-- Aba: Cabeça / Cabelo -->
    <div v-if="activeTab === 'cabelo'" class="tab-pane">
      <h3><i class="fas fa-cut"></i> Estilo de Cabeça</h3>
      <div class="option-grid">
        <div
          v-for="h in headStyles"
          :key="h.value"
          class="option-item"
          :class="{ active: selectedHeadStyle === h.value }"
          @click="$emit('update:selectedHeadStyle', h.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('head', h.value, { excludeHead: true })"
              :alt="h.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ h.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Cor do Cabelo -->
    <div v-if="activeTab === 'cor_cabelo'" class="tab-pane">
      <h3><i class="fas fa-palette"></i> Cor do Cabelo</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in headContrastColors"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedHeadContrastColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedHeadContrastColor', color.value)"
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedHeadContrastColor"
              @input="
                $emit(
                  'update:selectedHeadContrastColor',
                  $event.target.value.replace('#', ''),
                )
              "
              class="gradient-color-circle"
              title="Cor personalizada"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Aba: Rosto -->
    <div v-if="activeTab === 'rosto'" class="tab-pane">
      <h3><i class="fas fa-smile"></i> Expressão Facial</h3>
      <div class="option-grid">
        <div
          v-for="f in faceStyles"
          :key="f.value"
          class="option-item"
          :class="{ active: selectedFaceStyle === f.value }"
          @click="$emit('update:selectedFaceStyle', f.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('face', f.value, { excludeFace: true })"
              :alt="f.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ f.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Barba -->
    <div v-if="activeTab === 'barba'" class="tab-pane">
      <h3><i class="fas fa-user-tie"></i> Barba / Bigode</h3>
      <div class="option-grid">
        <div
          v-for="fh in facialHairStyles"
          :key="fh.value"
          class="option-item"
          :class="{ active: selectedOpenPeepsFacialHair === fh.value }"
          @click="$emit('update:selectedOpenPeepsFacialHair', fh.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_previewFacialHair(fh.value)"
              :alt="fh.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ fh.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Acessórios (óculos) -->
    <div v-if="activeTab === 'acessorios'" class="tab-pane">
      <h3><i class="fas fa-glasses"></i> Acessórios</h3>
      <div class="option-grid">
        <div
          v-for="acc in accessoryStyles"
          :key="acc.value"
          class="option-item"
          :class="{ active: selectedOpenPeepsAccessory === acc.value }"
          @click="$emit('update:selectedOpenPeepsAccessory', acc.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_previewAccessory(acc.value)"
              :alt="acc.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ acc.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Máscara -->
    <div v-if="activeTab === 'mascara'" class="tab-pane">
      <h3><i class="fas fa-head-side-mask"></i> Máscara</h3>
      <div class="option-grid">
        <div
          v-for="m in maskStyles"
          :key="m.value"
          class="option-item"
          :class="{ active: selectedOpenPeepsMask === m.value }"
          @click="$emit('update:selectedOpenPeepsMask', m.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_previewMask(m.value)"
              :alt="m.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ m.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Cor da Pele -->
    <div v-if="activeTab === 'cor_pele'" class="tab-pane">
      <h3><i class="fas fa-tint"></i> Cor da Pele</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in skinColors"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedOpenPeepsSkinColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedOpenPeepsSkinColor', color.value)"
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedOpenPeepsSkinColor"
              @input="
                $emit(
                  'update:selectedOpenPeepsSkinColor',
                  $event.target.value.replace('#', ''),
                )
              "
              class="gradient-color-circle"
              title="Cor personalizada"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Aba: Cor da Roupa -->
    <div v-if="activeTab === 'cor_roupa'" class="tab-pane">
      <h3><i class="fas fa-tshirt"></i> Cor da Roupa</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in clothingColors"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedOpenPeepsClothingColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedOpenPeepsClothingColor', color.value)"
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedOpenPeepsClothingColor"
              @input="
                $emit(
                  'update:selectedOpenPeepsClothingColor',
                  $event.target.value.replace('#', ''),
                )
              "
              class="gradient-color-circle"
              title="Cor personalizada"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OpenPeepsAvatarCustomizer",
  props: {
    activeTab: { type: String, required: true },
    selectedStyle: { type: String, required: true },
    selectedHeadStyle: { type: String, required: true },
    selectedHeadContrastColor: { type: String, required: true },
    selectedFaceStyle: { type: String, required: true },
    selectedOpenPeepsFacialHair: { type: String, required: true },
    selectedOpenPeepsAccessory: { type: String, required: true },
    selectedOpenPeepsMask: { type: String, required: true },
    selectedOpenPeepsSkinColor: { type: String, required: true },
    selectedOpenPeepsClothingColor: { type: String, required: true },
    userSessionStore: { type: Object, required: true },
  },
  emits: [
    "update:selectedHeadStyle",
    "update:selectedHeadContrastColor",
    "update:selectedFaceStyle",
    "update:selectedOpenPeepsFacialHair",
    "update:selectedOpenPeepsAccessory",
    "update:selectedOpenPeepsMask",
    "update:selectedOpenPeepsSkinColor",
    "update:selectedOpenPeepsClothingColor",
  ],
  data() {
    return {
      // Cabeça: 48 estilos
      headStyles: [
        { value: "afro", label: "Afro" },
        { value: "bangs", label: "Franja" },
        { value: "bangs2", label: "Franja 2" },
        { value: "bantuKnots", label: "Bantu Knots" },
        { value: "bear", label: "Urso" },
        { value: "bun", label: "Coque" },
        { value: "bun2", label: "Coque 2" },
        { value: "buns", label: "Coques" },
        { value: "cornrows", label: "Tranças" },
        { value: "cornrows2", label: "Tranças 2" },
        { value: "dreads1", label: "Dreads 1" },
        { value: "dreads2", label: "Dreads 2" },
        { value: "flatTop", label: "Flat Top" },
        { value: "flatTopLong", label: "Flat Top Longo" },
        { value: "grayBun", label: "Coque Grisalho" },
        { value: "grayMedium", label: "Grisalho Médio" },
        { value: "grayShort", label: "Grisalho Curto" },
        { value: "hatBeanie", label: "Gorro" },
        { value: "hatHip", label: "Boné Hip" },
        { value: "hijab", label: "Hijab" },
        { value: "long", label: "Longo" },
        { value: "longAfro", label: "Afro Longo" },
        { value: "longBangs", label: "Franja Longa" },
        { value: "longCurly", label: "Cacheado Longo" },
        { value: "medium1", label: "Médio 1" },
        { value: "medium2", label: "Médio 2" },
        { value: "medium3", label: "Médio 3" },
        { value: "mediumBangs", label: "Médio Franja" },
        { value: "mediumBangs2", label: "Médio Franja 2" },
        { value: "mediumBangs3", label: "Médio Franja 3" },
        { value: "mediumStraight", label: "Médio Liso" },
        { value: "mohawk", label: "Moicano" },
        { value: "mohawk2", label: "Moicano 2" },
        { value: "noHair1", label: "Sem Cabelo 1" },
        { value: "noHair2", label: "Sem Cabelo 2" },
        { value: "noHair3", label: "Sem Cabelo 3" },
        { value: "pomp", label: "Topete" },
        { value: "shaved1", label: "Raspado 1" },
        { value: "shaved2", label: "Raspado 2" },
        { value: "shaved3", label: "Raspado 3" },
        { value: "short1", label: "Curto 1" },
        { value: "short2", label: "Curto 2" },
        { value: "short3", label: "Curto 3" },
        { value: "short4", label: "Curto 4" },
        { value: "short5", label: "Curto 5" },
        { value: "turban", label: "Turbante" },
        { value: "twists", label: "Torções" },
        { value: "twists2", label: "Torções 2" },
      ],

      // Cor do cabelo
      headContrastColors: [
        { value: "2c1b18", label: "Preto" },
        { value: "4a312c", label: "Castanho Escuro" },
        { value: "724133", label: "Castanho" },
        { value: "a55728", label: "Castanho Claro" },
        { value: "b58143", label: "Loiro Escuro" },
        { value: "c93305", label: "Ruivo" },
        { value: "d6b370", label: "Loiro" },
        { value: "e8e1e1", label: "Grisalho" },
        { value: "ecdcbf", label: "Platinado" },
        { value: "f59797", label: "Rosa" },
      ],

      // Rosto (expressões): 31 estilos
      faceStyles: [
        { value: "angryWithFang", label: "Raiva c/ Presa" },
        { value: "awe", label: "Espanto" },
        { value: "blank", label: "Em Branco" },
        { value: "calm", label: "Calmo" },
        { value: "cheeky", label: "Brincalhão" },
        { value: "concerned", label: "Preocupado" },
        { value: "concernedFear", label: "Medo" },
        { value: "contempt", label: "Desprezo" },
        { value: "cute", label: "Fofo" },
        { value: "cyclops", label: "Ciclope" },
        { value: "driven", label: "Determinado" },
        { value: "eatingHappy", label: "Comendo Feliz" },
        { value: "explaining", label: "Explicando" },
        { value: "eyesClosed", label: "Olhos Fechados" },
        { value: "fear", label: "Assustado" },
        { value: "hectic", label: "Agitado" },
        { value: "lovingGrin1", label: "Sorriso Amoroso 1" },
        { value: "lovingGrin2", label: "Sorriso Amoroso 2" },
        { value: "monster", label: "Monstro" },
        { value: "old", label: "Idoso" },
        { value: "rage", label: "Fúria" },
        { value: "serious", label: "Sério" },
        { value: "smile", label: "Sorriso" },
        { value: "smileBig", label: "Sorriso Grande" },
        { value: "smileLOL", label: "Rindo" },
        { value: "smileTeethGap", label: "Sorriso Dentudo" },
        { value: "solemn", label: "Solene" },
        { value: "suspicious", label: "Suspeito" },
        { value: "tired", label: "Cansado" },
        { value: "veryAngry", label: "Muito Irritado" },
      ],

      // Barba / Bigode: none + 16 estilos
      facialHairStyles: [
        { value: "none", label: "Sem Barba" },
        { value: "chin", label: "Cavanhaque" },
        { value: "full", label: "Barba Cheia" },
        { value: "full2", label: "Barba Cheia 2" },
        { value: "full3", label: "Barba Cheia 3" },
        { value: "full4", label: "Barba Cheia 4" },
        { value: "goatee1", label: "Barbicha 1" },
        { value: "goatee2", label: "Barbicha 2" },
        { value: "moustache1", label: "Bigode 1" },
        { value: "moustache2", label: "Bigode 2" },
        { value: "moustache3", label: "Bigode 3" },
        { value: "moustache4", label: "Bigode 4" },
        { value: "moustache5", label: "Bigode 5" },
        { value: "moustache6", label: "Bigode 6" },
        { value: "moustache7", label: "Bigode 7" },
        { value: "moustache8", label: "Bigode 8" },
        { value: "moustache9", label: "Bigode 9" },
      ],

      // Acessórios (óculos): none + 8 estilos
      accessoryStyles: [
        { value: "none", label: "Nenhum" },
        { value: "eyepatch", label: "Tapa-Olho" },
        { value: "glasses", label: "Óculos" },
        { value: "glasses2", label: "Óculos 2" },
        { value: "glasses3", label: "Óculos 3" },
        { value: "glasses4", label: "Óculos 4" },
        { value: "glasses5", label: "Óculos 5" },
        { value: "sunglasses", label: "Óculos de Sol" },
        { value: "sunglasses2", label: "Óculos de Sol 2" },
      ],

      // Máscara: none + 2 estilos
      maskStyles: [
        { value: "none", label: "Sem Máscara" },
        { value: "medicalMask", label: "Máscara Médica" },
        { value: "respirator", label: "Respirador" },
      ],

      // Cor da pele
      skinColors: [
        { value: "694d3d", label: "Escura" },
        { value: "ae5d29", label: "Morena Escura" },
        { value: "d08b5b", label: "Morena" },
        { value: "edb98a", label: "Média" },
        { value: "ffdbb4", label: "Clara" },
      ],

      // Cor da roupa
      clothingColors: [
        { value: "8fa7df", label: "Azul" },
        { value: "9ddadb", label: "Ciano" },
        { value: "78e185", label: "Verde" },
        { value: "e279c7", label: "Rosa" },
        { value: "e78276", label: "Vermelho" },
        { value: "fdea6b", label: "Amarelo" },
        { value: "ffcf77", label: "Laranja" },
      ],
    };
  },
  methods: {
    /* ===== Helpers DRY ===== */

    _baseParams() {
      return `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=f0f0f0`;
    },

    _buildUrl(extraParams) {
      return `https://api.dicebear.com/9.x/open-peeps/svg?${this._baseParams()}${extraParams}&_t=${Date.now()}`;
    },

    /**
     * Parâmetros do avatar atual, excluindo a categoria sendo previsualizada.
     */
    _currentParams({
      excludeHead,
      excludeFace,
      excludeFacialHair,
      excludeAccessory,
      excludeMask,
      excludeSkinColor,
      excludeClothingColor,
      excludeHeadContrastColor,
    } = {}) {
      let p = "";

      if (!excludeHead) {
        p += `&head=${this.selectedHeadStyle}`;
      }
      if (!excludeHeadContrastColor) {
        p += `&headContrastColor=${this.selectedHeadContrastColor}`;
      }
      if (!excludeFace) {
        p += `&face=${this.selectedFaceStyle}`;
      }
      if (!excludeSkinColor) {
        p += `&skinColor=${this.selectedOpenPeepsSkinColor}`;
      }
      if (!excludeClothingColor) {
        p += `&clothingColor=${this.selectedOpenPeepsClothingColor}`;
      }

      // Barba facial (com probabilidade)
      if (!excludeFacialHair) {
        if (this.selectedOpenPeepsFacialHair !== "none") {
          p += `&facialHair=${this.selectedOpenPeepsFacialHair}&facialHairProbability=100`;
        } else {
          p += `&facialHairProbability=0`;
        }
      }

      // Acessórios (com probabilidade)
      if (!excludeAccessory) {
        if (this.selectedOpenPeepsAccessory !== "none") {
          p += `&accessories=${this.selectedOpenPeepsAccessory}&accessoriesProbability=100`;
        } else {
          p += `&accessoriesProbability=0`;
        }
      }

      // Máscara (com probabilidade)
      if (!excludeMask) {
        if (this.selectedOpenPeepsMask !== "none") {
          p += `&mask=${this.selectedOpenPeepsMask}&maskProbability=100`;
        } else {
          p += `&maskProbability=0`;
        }
      }

      return p;
    },

    /* ===== Preview genérico (params simples) ===== */

    _preview(paramName, value, excludeKey) {
      const extra = `&${paramName}=${value}` + this._currentParams(excludeKey);
      return this._buildUrl(extra);
    },

    /* ===== Previews com lógica de probabilidade ===== */

    _previewFacialHair(value) {
      let extra = "";
      if (value !== "none") {
        extra += `&facialHair=${value}&facialHairProbability=100`;
      } else {
        extra += `&facialHairProbability=0`;
      }
      extra += this._currentParams({ excludeFacialHair: true });
      return this._buildUrl(extra);
    },

    _previewAccessory(value) {
      let extra = "";
      if (value !== "none") {
        extra += `&accessories=${value}&accessoriesProbability=100`;
      } else {
        extra += `&accessoriesProbability=0`;
      }
      extra += this._currentParams({ excludeAccessory: true });
      return this._buildUrl(extra);
    },

    _previewMask(value) {
      let extra = "";
      if (value !== "none") {
        extra += `&mask=${value}&maskProbability=100`;
      } else {
        extra += `&maskProbability=0`;
      }
      extra += this._currentParams({ excludeMask: true });
      return this._buildUrl(extra);
    },
  },
};
</script>

<style scoped>
.open-peeps-customizer {
  width: 100%;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tab-pane h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
}

/* ===== Grid de opções ===== */
.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 16px;
}

.option-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px 6px;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.option-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.option-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

/* ===== Preview circular ===== */
.avatar-preview-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.avatar-preview-circle img.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.option-label {
  font-size: 0.75rem;
  text-align: center;
  color: #495057;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== Cores ===== */
.color-section {
  margin-bottom: 20px;
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.color-option::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.color-option:hover {
  transform: scale(1.1);
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.color-option.active {
  border-color: #2c3e50;
  box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.3);
}

.custom-color-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.gradient-color-circle {
  width: 40px;
  height: 40px;
  border: 2px solid #adb5bd;
  border-radius: 50%;
  cursor: pointer;
  background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff, #ffff00);
  position: relative;
  overflow: hidden;
}

.gradient-color-circle::-webkit-color-swatch {
  opacity: 0;
}

.gradient-color-circle::-webkit-color-swatch-wrapper {
  padding: 0;
  border: none;
  border-radius: 50%;
}

/* ===== Mobile ===== */
@media (max-width: 768px) {
  .option-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .option-item {
    padding: 6px 4px;
    border-radius: 10px;
  }

  .avatar-preview-circle {
    width: 64px;
    height: 64px;
  }

  .option-label {
    font-size: 0.6rem;
  }

  .color-option {
    width: 44px;
    height: 44px;
  }

  .color-options {
    gap: 8px;
  }

  .tab-pane h3 {
    font-size: 0.95rem;
  }
}

@media (max-width: 400px) {
  .option-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .avatar-preview-circle {
    width: 56px;
    height: 56px;
  }
}
</style>
