<template>
  <div class="notionists-customizer">
    <!-- Aba: Cabelo -->
    <div v-if="activeTab === 'cabelo'" class="tab-pane">
      <h3><i class="fas fa-cut"></i> Estilo de Cabelo</h3>
      <div class="option-grid">
        <div
          v-for="hair in hairStyles"
          :key="hair.value"
          class="option-item"
          :class="{ active: selectedHairStyle === hair.value }"
          @click="$emit('update:selectedHairStyle', hair.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('hair', hair.value, { excludeHair: true })"
              :alt="hair.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ hair.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Lábios -->
    <div v-if="activeTab === 'labios'" class="tab-pane">
      <h3><i class="fas fa-kiss-wink-heart"></i> Estilo dos Lábios</h3>
      <div class="option-grid">
        <div
          v-for="lip in lipsStyles"
          :key="lip.value"
          class="option-item"
          :class="{ active: selectedLipsStyle === lip.value }"
          @click="$emit('update:selectedLipsStyle', lip.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('lips', lip.value, { excludeLips: true })"
              :alt="lip.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ lip.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Nariz -->
    <div v-if="activeTab === 'nariz'" class="tab-pane">
      <h3><i class="fas fa-meh-blank"></i> Estilo do Nariz</h3>
      <div class="option-grid">
        <div
          v-for="nose in noseStyles"
          :key="nose.value"
          class="option-item"
          :class="{ active: selectedNoseStyle === nose.value }"
          @click="$emit('update:selectedNoseStyle', nose.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('nose', nose.value, { excludeNose: true })"
              :alt="nose.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ nose.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Sobrancelhas -->
    <div v-if="activeTab === 'sobrancelhas'" class="tab-pane">
      <h3><i class="fas fa-low-vision"></i> Estilo das Sobrancelhas</h3>
      <div class="option-grid">
        <div
          v-for="brow in browsVariants"
          :key="brow.value"
          class="option-item"
          :class="{ active: selectedBrowStyle === brow.value }"
          @click="$emit('update:selectedBrowStyle', brow.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('brows', brow.value, { excludeBrows: true })"
              :alt="brow.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ brow.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Olhos -->
    <div v-if="activeTab === 'olhos'" class="tab-pane">
      <h3><i class="fas fa-eye"></i> Estilo dos Olhos</h3>
      <div class="option-grid">
        <div
          v-for="eye in eyesVariants"
          :key="eye.value"
          class="option-item"
          :class="{ active: selectedEyeStyle === eye.value }"
          @click="$emit('update:selectedEyeStyle', eye.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('eyes', eye.value, { excludeEyes: true })"
              :alt="eye.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ eye.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Barba -->
    <div v-if="activeTab === 'barba'" class="tab-pane">
      <h3><i class="fas fa-user-tie"></i> Estilo da Barba</h3>
      <div class="option-grid">
        <div
          v-for="beard in beardVariants"
          :key="beard.value"
          class="option-item"
          :class="{ active: selectedBeardStyle === beard.value }"
          @click="$emit('update:selectedBeardStyle', beard.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_previewBeard(beard.value)"
              :alt="beard.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ beard.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Gestos -->
    <div v-if="activeTab === 'gestos'" class="tab-pane">
      <h3><i class="fas fa-hand-paper"></i> Estilo dos Gestos</h3>
      <div class="option-grid">
        <div
          v-for="gesture in gestureVariants"
          :key="gesture.value"
          class="option-item"
          :class="{ active: selectedGestureStyle === gesture.value }"
          @click="$emit('update:selectedGestureStyle', gesture.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_previewGesture(gesture.value)"
              :alt="gesture.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ gesture.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Óculos -->
    <div v-if="activeTab === 'oculos'" class="tab-pane">
      <h3><i class="fas fa-glasses"></i> Estilo dos Óculos</h3>
      <div class="option-grid">
        <div
          v-for="glasses in glassesVariants"
          :key="glasses.value"
          class="option-item"
          :class="{ active: selectedGlassesVariant === glasses.value }"
          @click="$emit('update:selectedGlassesVariant', glasses.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_previewGlasses(glasses.value)"
              :alt="glasses.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ glasses.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Corpo -->
    <div v-if="activeTab === 'corpo'" class="tab-pane">
      <h3><i class="fas fa-user"></i> Estilo do Corpo</h3>
      <div class="option-grid">
        <div
          v-for="body in bodyVariants"
          :key="body.value"
          class="option-item"
          :class="{ active: selectedBodyStyle === body.value }"
          @click="$emit('update:selectedBodyStyle', body.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('body', body.value, { excludeBody: true })"
              :alt="body.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ body.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Ícone do Corpo -->
    <div v-if="activeTab === 'icone_corpo'" class="tab-pane">
      <h3><i class="fas fa-bolt"></i> Ícone do Corpo</h3>
      <div class="option-grid">
        <div
          v-for="icon in bodyIconVariants"
          :key="icon.value"
          class="option-item"
          :class="{ active: selectedBodyIcon === icon.value }"
          @click="$emit('update:selectedBodyIcon', icon.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_previewBodyIcon(icon.value)"
              :alt="icon.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ icon.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotionistsAvatarCustomizer",
  props: {
    activeTab: { type: String, required: true },
    selectedStyle: { type: String, required: true },
    selectedHairStyle: { type: String, required: true },
    selectedLipsStyle: { type: String, required: true },
    selectedNoseStyle: { type: String, required: true },
    selectedBrowStyle: { type: String, required: true },
    selectedEyeStyle: { type: String, required: true },
    selectedBeardStyle: { type: String, required: true },
    selectedGestureStyle: { type: String, required: true },
    selectedGlassesVariant: { type: String, required: true },
    selectedBodyStyle: { type: String, required: true },
    selectedBodyIcon: { type: String, required: true },
    userSessionStore: { type: Object, required: true },
  },
  emits: [
    "update:selectedHairStyle",
    "update:selectedLipsStyle",
    "update:selectedNoseStyle",
    "update:selectedBrowStyle",
    "update:selectedEyeStyle",
    "update:selectedBeardStyle",
    "update:selectedGestureStyle",
    "update:selectedGlassesVariant",
    "update:selectedBodyStyle",
    "update:selectedBodyIcon",
  ],
  data() {
    return {
      // Cabelo: hat + variant01-variant63
      hairStyles: [
        { value: "hat", label: "Chapéu" },
        ...Array.from({ length: 63 }, (_, i) => ({
          value: `variant${String(i + 1).padStart(2, "0")}`,
          label: `Cabelo ${String(i + 1).padStart(2, "0")}`,
        })),
      ],

      // Lábios: variant01-variant30
      lipsStyles: Array.from({ length: 30 }, (_, i) => ({
        value: `variant${String(i + 1).padStart(2, "0")}`,
        label: `Lábios ${String(i + 1).padStart(2, "0")}`,
      })),

      // Nariz: variant01-variant20
      noseStyles: Array.from({ length: 20 }, (_, i) => ({
        value: `variant${String(i + 1).padStart(2, "0")}`,
        label: `Nariz ${String(i + 1).padStart(2, "0")}`,
      })),

      // Sobrancelhas (brows): variant01-variant13
      browsVariants: Array.from({ length: 13 }, (_, i) => ({
        value: `variant${String(i + 1).padStart(2, "0")}`,
        label: `Sobrancelha ${String(i + 1).padStart(2, "0")}`,
      })),

      // Olhos: variant01-variant05
      eyesVariants: Array.from({ length: 5 }, (_, i) => ({
        value: `variant${String(i + 1).padStart(2, "0")}`,
        label: `Olhos ${String(i + 1).padStart(2, "0")}`,
      })),

      // Barba: none + variant01-variant12
      beardVariants: [
        { value: "none", label: "Sem Barba" },
        ...Array.from({ length: 12 }, (_, i) => ({
          value: `variant${String(i + 1).padStart(2, "0")}`,
          label: `Barba ${String(i + 1).padStart(2, "0")}`,
        })),
      ],

      // Gestos: none + opções da API
      gestureVariants: [
        { value: "none", label: "Sem Gesto" },
        { value: "hand", label: "Mão" },
        { value: "handPhone", label: "Mão com Telefone" },
        { value: "ok", label: "Sinal de OK" },
        { value: "okLongArm", label: "OK Braço Longo" },
        { value: "point", label: "Apontando" },
        { value: "pointLongArm", label: "Apontar Braço Longo" },
        { value: "waveLongArm", label: "Acenar Braço Longo" },
        { value: "waveLongArms", label: "Acenar Braços Longos" },
        { value: "waveOkLongArms", label: "Acenar OK Braços Longos" },
        { value: "wavePointLongArms", label: "Acenar Apontar Braços" },
      ],

      // Óculos: none + variant01-variant11
      glassesVariants: [
        { value: "none", label: "Sem Óculos" },
        ...Array.from({ length: 11 }, (_, i) => ({
          value: `variant${String(i + 1).padStart(2, "0")}`,
          label: `Óculos ${String(i + 1).padStart(2, "0")}`,
        })),
      ],

      // Corpo: variant01-variant25
      bodyVariants: Array.from({ length: 25 }, (_, i) => ({
        value: `variant${String(i + 1).padStart(2, "0")}`,
        label: `Corpo ${String(i + 1).padStart(2, "0")}`,
      })),

      // Ícone do Corpo: none + electric, galaxy, saturn
      bodyIconVariants: [
        { value: "none", label: "Sem Ícone" },
        { value: "electric", label: "Elétrico" },
        { value: "galaxy", label: "Galáxia" },
        { value: "saturn", label: "Saturno" },
      ],
    };
  },
  methods: {
    /* ===== Helpers DRY ===== */

    _baseParams() {
      return `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=f0f0f0`;
    },

    _buildUrl(extraParams) {
      return `https://api.dicebear.com/9.x/notionists/svg?${this._baseParams()}${extraParams}&_t=${Date.now()}`;
    },

    /**
     * Parâmetros do avatar atual, excluindo a categoria que está
     * sendo previsualizada para evitar duplicação de query-string.
     */
    _currentParams({
      excludeHair,
      excludeLips,
      excludeNose,
      excludeBrows,
      excludeEyes,
      excludeBeard,
      excludeGesture,
      excludeGlasses,
      excludeBody,
      excludeBodyIcon,
    } = {}) {
      let p = "";

      if (!excludeHair) {
        p += `&hair=${this.selectedHairStyle}`;
      }
      if (!excludeLips) {
        p += `&lips=${this.selectedLipsStyle}`;
      }
      if (!excludeNose) {
        p += `&nose=${this.selectedNoseStyle}`;
      }
      if (!excludeBrows) {
        p += `&brows=${this.selectedBrowStyle}`;
      }
      if (!excludeEyes) {
        p += `&eyes=${this.selectedEyeStyle}`;
      }

      // Barba (com probabilidade)
      if (!excludeBeard) {
        if (this.selectedBeardStyle !== "none") {
          p += `&beard=${this.selectedBeardStyle}&beardProbability=100`;
        } else {
          p += `&beardProbability=0`;
        }
      }

      // Gesto (com probabilidade)
      if (!excludeGesture) {
        if (this.selectedGestureStyle !== "none") {
          p += `&gesture=${this.selectedGestureStyle}&gestureProbability=100`;
        } else {
          p += `&gestureProbability=0`;
        }
      }

      // Óculos (com probabilidade)
      if (!excludeGlasses) {
        if (this.selectedGlassesVariant !== "none") {
          p += `&glasses=${this.selectedGlassesVariant}&glassesProbability=100`;
        } else {
          p += `&glassesProbability=0`;
        }
      }

      if (!excludeBody) {
        p += `&body=${this.selectedBodyStyle}`;
      }

      // Ícone do corpo (com probabilidade)
      if (!excludeBodyIcon) {
        if (this.selectedBodyIcon !== "none") {
          p += `&bodyIcon=${this.selectedBodyIcon}&bodyIconProbability=100`;
        } else {
          p += `&bodyIconProbability=0`;
        }
      }

      return p;
    },

    /* ===== Preview genérico (params sem probabilidade) ===== */

    _preview(paramName, value, excludeKey) {
      const extra = `&${paramName}=${value}` + this._currentParams(excludeKey);
      return this._buildUrl(extra);
    },

    /* ===== Previews com lógica de probabilidade ===== */

    _previewBeard(value) {
      let extra = "";
      if (value !== "none") {
        extra += `&beard=${value}&beardProbability=100`;
      } else {
        extra += `&beardProbability=0`;
      }
      extra += this._currentParams({ excludeBeard: true });
      return this._buildUrl(extra);
    },

    _previewGesture(value) {
      let extra = "";
      if (value !== "none") {
        extra += `&gesture=${value}&gestureProbability=100`;
      } else {
        extra += `&gestureProbability=0`;
      }
      extra += this._currentParams({ excludeGesture: true });
      return this._buildUrl(extra);
    },

    _previewGlasses(value) {
      let extra = "";
      if (value !== "none") {
        extra += `&glasses=${value}&glassesProbability=100`;
      } else {
        extra += `&glassesProbability=0`;
      }
      extra += this._currentParams({ excludeGlasses: true });
      return this._buildUrl(extra);
    },

    _previewBodyIcon(value) {
      let extra = "";
      if (value !== "none") {
        extra += `&bodyIcon=${value}&bodyIconProbability=100`;
      } else {
        extra += `&bodyIconProbability=0`;
      }
      extra += this._currentParams({ excludeBodyIcon: true });
      return this._buildUrl(extra);
    },
  },
};
</script>

<style scoped>
.notionists-customizer {
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

/* ===== Mobile ===== */
@media (max-width: 768px) {
  .option-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 10px;
  }

  .avatar-preview-circle {
    width: 64px;
    height: 64px;
  }

  .option-label {
    font-size: 0.65rem;
  }
}
</style>
