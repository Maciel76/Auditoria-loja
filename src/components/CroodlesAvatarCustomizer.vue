<template>
  <div class="croodles-customizer">
    <!-- Aba: Cabelo (top) -->
    <div v-if="activeTab === 'cabelo'" class="tab-pane">
      <h3><i class="fas fa-cut"></i> Cabelo</h3>
      <div class="option-grid">
        <div
          v-for="t in topStyles"
          :key="t.value"
          class="option-item"
          :class="{ active: selectedCroodlesTop === t.value }"
          @click="$emit('update:selectedCroodlesTop', t.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('top', t.value, { excludeTop: true })"
              :alt="t.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ t.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Cor do Cabelo (topColor) -->
    <div v-if="activeTab === 'cor_cabelo'" class="tab-pane">
      <h3><i class="fas fa-palette"></i> Cor do Cabelo</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in topColors"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedCroodlesTopColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedCroodlesTopColor', color.value)"
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedCroodlesTopColor"
              @input="
                $emit(
                  'update:selectedCroodlesTopColor',
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

    <!-- Aba: Rosto (face) -->
    <div v-if="activeTab === 'rosto'" class="tab-pane">
      <h3><i class="fas fa-meh"></i> Formato do Rosto</h3>
      <div class="option-grid">
        <div
          v-for="f in faceStyles"
          :key="f.value"
          class="option-item"
          :class="{ active: selectedCroodlesFace === f.value }"
          @click="$emit('update:selectedCroodlesFace', f.value)"
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

    <!-- Aba: Olhos -->
    <div v-if="activeTab === 'olhos'" class="tab-pane">
      <h3><i class="fas fa-eye"></i> Olhos</h3>
      <div class="option-grid">
        <div
          v-for="e in eyeStyles"
          :key="e.value"
          class="option-item"
          :class="{ active: selectedCroodlesEyes === e.value }"
          @click="$emit('update:selectedCroodlesEyes', e.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('eyes', e.value, { excludeEyes: true })"
              :alt="e.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ e.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Boca -->
    <div v-if="activeTab === 'boca'" class="tab-pane">
      <h3><i class="fas fa-smile"></i> Boca</h3>
      <div class="option-grid">
        <div
          v-for="m in mouthStyles"
          :key="m.value"
          class="option-item"
          :class="{ active: selectedCroodlesMouth === m.value }"
          @click="$emit('update:selectedCroodlesMouth', m.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('mouth', m.value, { excludeMouth: true })"
              :alt="m.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ m.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Nariz -->
    <div v-if="activeTab === 'nariz'" class="tab-pane">
      <h3><i class="fas fa-meh-blank"></i> Nariz</h3>
      <div class="option-grid">
        <div
          v-for="n in noseStyles"
          :key="n.value"
          class="option-item"
          :class="{ active: selectedCroodlesNose === n.value }"
          @click="$emit('update:selectedCroodlesNose', n.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('nose', n.value, { excludeNose: true })"
              :alt="n.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ n.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Barba -->
    <div v-if="activeTab === 'barba'" class="tab-pane">
      <h3><i class="fas fa-user-tie"></i> Barba</h3>
      <div class="option-grid">
        <div
          v-for="b in beardStyles"
          :key="b.value"
          class="option-item"
          :class="{ active: selectedCroodlesBeard === b.value }"
          @click="$emit('update:selectedCroodlesBeard', b.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_previewBeard(b.value)"
              :alt="b.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ b.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Bigode -->
    <div v-if="activeTab === 'bigode'" class="tab-pane">
      <h3><i class="fas fa-user-secret"></i> Bigode</h3>
      <div class="option-grid">
        <div
          v-for="mu in mustacheStyles"
          :key="mu.value"
          class="option-item"
          :class="{ active: selectedCroodlesMustache === mu.value }"
          @click="$emit('update:selectedCroodlesMustache', mu.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_previewMustache(mu.value)"
              :alt="mu.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ mu.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Cor Base -->
    <div v-if="activeTab === 'cor_base'" class="tab-pane">
      <h3><i class="fas fa-tint"></i> Cor Base</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            class="color-option"
            :class="{ active: selectedCroodlesBaseColor === 'ffffff' }"
            :style="{ backgroundColor: '#ffffff' }"
            @click="$emit('update:selectedCroodlesBaseColor', 'ffffff')"
            title="Branco (Padrão)"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedCroodlesBaseColor"
              @input="
                $emit(
                  'update:selectedCroodlesBaseColor',
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
  name: "CroodlesAvatarCustomizer",
  props: {
    activeTab: { type: String, required: true },
    selectedStyle: { type: String, required: true },
    selectedCroodlesTop: { type: String, required: true },
    selectedCroodlesTopColor: { type: String, required: true },
    selectedCroodlesFace: { type: String, required: true },
    selectedCroodlesEyes: { type: String, required: true },
    selectedCroodlesMouth: { type: String, required: true },
    selectedCroodlesNose: { type: String, required: true },
    selectedCroodlesBeard: { type: String, required: true },
    selectedCroodlesMustache: { type: String, required: true },
    selectedCroodlesBaseColor: { type: String, required: true },
    userSessionStore: { type: Object, required: true },
  },
  emits: [
    "update:selectedCroodlesTop",
    "update:selectedCroodlesTopColor",
    "update:selectedCroodlesFace",
    "update:selectedCroodlesEyes",
    "update:selectedCroodlesMouth",
    "update:selectedCroodlesNose",
    "update:selectedCroodlesBeard",
    "update:selectedCroodlesMustache",
    "update:selectedCroodlesBaseColor",
  ],
  data() {
    return {
      // Cabelo (top): 29 variantes
      topStyles: [
        { value: "variant01", label: "Cabelo 1" },
        { value: "variant02", label: "Cabelo 2" },
        { value: "variant03", label: "Cabelo 3" },
        { value: "variant04", label: "Cabelo 4" },
        { value: "variant05", label: "Cabelo 5" },
        { value: "variant06", label: "Cabelo 6" },
        { value: "variant07", label: "Cabelo 7" },
        { value: "variant08", label: "Cabelo 8" },
        { value: "variant09", label: "Cabelo 9" },
        { value: "variant10", label: "Cabelo 10" },
        { value: "variant11", label: "Cabelo 11" },
        { value: "variant12", label: "Cabelo 12" },
        { value: "variant13", label: "Cabelo 13" },
        { value: "variant14", label: "Cabelo 14" },
        { value: "variant15", label: "Cabelo 15" },
        { value: "variant16", label: "Cabelo 16" },
        { value: "variant17", label: "Cabelo 17" },
        { value: "variant18", label: "Cabelo 18" },
        { value: "variant19", label: "Cabelo 19" },
        { value: "variant20", label: "Cabelo 20" },
        { value: "variant21", label: "Cabelo 21" },
        { value: "variant22", label: "Cabelo 22" },
        { value: "variant23", label: "Cabelo 23" },
        { value: "variant24", label: "Cabelo 24" },
        { value: "variant25", label: "Cabelo 25" },
        { value: "variant26", label: "Cabelo 26" },
        { value: "variant27", label: "Cabelo 27" },
        { value: "variant28", label: "Cabelo 28" },
        { value: "variant29", label: "Cabelo 29" },
      ],

      // Cores do cabelo (topColor)
      topColors: [
        { value: "000000", label: "Preto" },
        { value: "0fa958", label: "Verde" },
        { value: "699bf7", label: "Azul" },
        { value: "9747ff", label: "Roxo" },
        { value: "f24e1e", label: "Vermelho" },
        { value: "ffc700", label: "Amarelo" },
      ],

      // Rosto (face): 8 variantes
      faceStyles: [
        { value: "variant01", label: "Rosto 1" },
        { value: "variant02", label: "Rosto 2" },
        { value: "variant03", label: "Rosto 3" },
        { value: "variant04", label: "Rosto 4" },
        { value: "variant05", label: "Rosto 5" },
        { value: "variant06", label: "Rosto 6" },
        { value: "variant07", label: "Rosto 7" },
        { value: "variant08", label: "Rosto 8" },
      ],

      // Olhos: 16 variantes
      eyeStyles: [
        { value: "variant01", label: "Olhos 1" },
        { value: "variant02", label: "Olhos 2" },
        { value: "variant03", label: "Olhos 3" },
        { value: "variant04", label: "Olhos 4" },
        { value: "variant05", label: "Olhos 5" },
        { value: "variant06", label: "Olhos 6" },
        { value: "variant07", label: "Olhos 7" },
        { value: "variant08", label: "Olhos 8" },
        { value: "variant09", label: "Olhos 9" },
        { value: "variant10", label: "Olhos 10" },
        { value: "variant11", label: "Olhos 11" },
        { value: "variant12", label: "Olhos 12" },
        { value: "variant13", label: "Olhos 13" },
        { value: "variant14", label: "Olhos 14" },
        { value: "variant15", label: "Olhos 15" },
        { value: "variant16", label: "Olhos 16" },
      ],

      // Boca: 18 variantes
      mouthStyles: [
        { value: "variant01", label: "Boca 1" },
        { value: "variant02", label: "Boca 2" },
        { value: "variant03", label: "Boca 3" },
        { value: "variant04", label: "Boca 4" },
        { value: "variant05", label: "Boca 5" },
        { value: "variant06", label: "Boca 6" },
        { value: "variant07", label: "Boca 7" },
        { value: "variant08", label: "Boca 8" },
        { value: "variant09", label: "Boca 9" },
        { value: "variant10", label: "Boca 10" },
        { value: "variant11", label: "Boca 11" },
        { value: "variant12", label: "Boca 12" },
        { value: "variant13", label: "Boca 13" },
        { value: "variant14", label: "Boca 14" },
        { value: "variant15", label: "Boca 15" },
        { value: "variant16", label: "Boca 16" },
        { value: "variant17", label: "Boca 17" },
        { value: "variant18", label: "Boca 18" },
      ],

      // Nariz: 9 variantes
      noseStyles: [
        { value: "variant01", label: "Nariz 1" },
        { value: "variant02", label: "Nariz 2" },
        { value: "variant03", label: "Nariz 3" },
        { value: "variant04", label: "Nariz 4" },
        { value: "variant05", label: "Nariz 5" },
        { value: "variant06", label: "Nariz 6" },
        { value: "variant07", label: "Nariz 7" },
        { value: "variant08", label: "Nariz 8" },
        { value: "variant09", label: "Nariz 9" },
      ],

      // Barba: none + 5 variantes
      beardStyles: [
        { value: "none", label: "Sem Barba" },
        { value: "variant01", label: "Barba 1" },
        { value: "variant02", label: "Barba 2" },
        { value: "variant03", label: "Barba 3" },
        { value: "variant04", label: "Barba 4" },
        { value: "variant05", label: "Barba 5" },
      ],

      // Bigode: none + 4 variantes
      mustacheStyles: [
        { value: "none", label: "Sem Bigode" },
        { value: "variant01", label: "Bigode 1" },
        { value: "variant02", label: "Bigode 2" },
        { value: "variant03", label: "Bigode 3" },
        { value: "variant04", label: "Bigode 4" },
      ],
    };
  },
  methods: {
    /* ===== Helpers DRY ===== */

    _baseParams() {
      return `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=f0f0f0`;
    },

    _buildUrl(extraParams) {
      return `https://api.dicebear.com/9.x/croodles/svg?${this._baseParams()}${extraParams}&_t=${Date.now()}`;
    },

    /**
     * Parâmetros do avatar atual, excluindo a categoria sendo previsualizada.
     */
    _currentParams({
      excludeTop,
      excludeTopColor,
      excludeFace,
      excludeEyes,
      excludeMouth,
      excludeNose,
      excludeBeard,
      excludeMustache,
      excludeBaseColor,
    } = {}) {
      let p = "";

      if (!excludeTop) {
        p += `&top=${this.selectedCroodlesTop}`;
      }
      if (!excludeTopColor) {
        p += `&topColor=${this.selectedCroodlesTopColor}`;
      }
      if (!excludeFace) {
        p += `&face=${this.selectedCroodlesFace}`;
      }
      if (!excludeEyes) {
        p += `&eyes=${this.selectedCroodlesEyes}`;
      }
      if (!excludeMouth) {
        p += `&mouth=${this.selectedCroodlesMouth}`;
      }
      if (!excludeNose) {
        p += `&nose=${this.selectedCroodlesNose}`;
      }
      if (!excludeBaseColor) {
        p += `&baseColor=${this.selectedCroodlesBaseColor}`;
      }

      // Barba (com probabilidade)
      if (!excludeBeard) {
        if (this.selectedCroodlesBeard !== "none") {
          p += `&beard=${this.selectedCroodlesBeard}&beardProbability=100`;
        } else {
          p += `&beardProbability=0`;
        }
      }

      // Bigode (com probabilidade)
      if (!excludeMustache) {
        if (this.selectedCroodlesMustache !== "none") {
          p += `&mustache=${this.selectedCroodlesMustache}&mustacheProbability=100`;
        } else {
          p += `&mustacheProbability=0`;
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

    _previewMustache(value) {
      let extra = "";
      if (value !== "none") {
        extra += `&mustache=${value}&mustacheProbability=100`;
      } else {
        extra += `&mustacheProbability=0`;
      }
      extra += this._currentParams({ excludeMustache: true });
      return this._buildUrl(extra);
    },
  },
};
</script>

<style scoped>
.croodles-customizer {
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
