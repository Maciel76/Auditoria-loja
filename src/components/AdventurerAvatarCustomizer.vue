<template>
  <div class="adventurer-customizer">
    <!-- Aba: Cabelo -->
    <div v-if="activeTab === 'cabelo'" class="tab-pane">
      <h3><i class="fas fa-cut"></i> Estilo de Cabelo</h3>

      <!-- Cor do cabelo -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor do Cabelo</h4>
        <div class="color-options">
          <div
            v-for="color in hairColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedHairColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedHairColor', color.value)"
            :title="color.label"
          ></div>
          <!-- Seletor de cor personalizado -->
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedHairColor"
              @input="
                $emit(
                  'update:selectedHairColor',
                  $event.target.value.replace('#', ''),
                )
              "
              class="gradient-color-circle"
              title="Selecione uma cor personalizada"
            />
          </div>
        </div>
      </div>

      <div class="hair-preview-container">
        <div
          v-for="hair in hairStyles"
          :key="hair.value"
          class="hair-preview-item"
          :class="{ active: selectedHairStyle === hair.value }"
          @click="$emit('update:selectedHairStyle', hair.value)"
        >
          <div class="avatar-preview-with-hair">
            <img
              :src="generateHairPreviewUrl(hair.value)"
              :alt="`Avatar com ${hair.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
          <span class="hair-label">{{ hair.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Olhos -->
    <div v-if="activeTab === 'olhos'" class="tab-pane">
      <h3><i class="fas fa-eye"></i> Estilo dos Olhos</h3>
      <div class="eye-preview-container">
        <div
          v-for="eye in eyeStyles"
          :key="eye.value"
          class="eye-preview-item"
          :class="{ active: selectedEyeStyle === eye.value }"
          @click="$emit('update:selectedEyeStyle', eye.value)"
          :title="eye.label"
        >
          <div class="avatar-preview-with-eye">
            <img
              :src="generateEyePreviewUrl(eye.value)"
              :alt="`Avatar com ${eye.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Aba: Sobrancelhas -->
    <div v-if="activeTab === 'sobrancelhas'" class="tab-pane">
      <h3><i class="fas fa-low-vision"></i> Estilo das Sobrancelhas</h3>
      <div class="brow-preview-container">
        <div
          v-for="brow in eyebrowVariants"
          :key="brow.value"
          class="brow-preview-item"
          :class="{ active: selectedBrowStyle === brow.value }"
          @click="$emit('update:selectedBrowStyle', brow.value)"
          :title="brow.label"
        >
          <div class="avatar-preview-with-brow">
            <img
              :src="generateEyebrowPreviewUrl(brow.value)"
              :alt="`Avatar com ${brow.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Aba: Boca -->
    <div v-if="activeTab === 'boca'" class="tab-pane">
      <h3><i class="fas fa-smile"></i> Estilo da Boca</h3>
      <div class="mouth-preview-container">
        <div
          v-for="mouth in mouthStyles"
          :key="mouth.value"
          class="mouth-preview-item"
          :class="{ active: selectedMouthStyle === mouth.value }"
          @click="$emit('update:selectedMouthStyle', mouth.value)"
          :title="mouth.label"
        >
          <div class="avatar-preview-with-mouth">
            <img
              :src="generateMouthPreviewUrl(mouth.value)"
              :alt="`Avatar com ${mouth.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Aba: Brincos -->
    <div v-if="activeTab === 'brincos'" class="tab-pane">
      <h3><i class="fas fa-gem"></i> Brincos</h3>
      <div class="earring-preview-container">
        <div
          v-for="earring in earringVariantsExtended"
          :key="earring.value"
          class="earring-preview-item"
          :class="{ active: selectedEarringVariant === earring.value }"
          @click="
            $emit(
              'update:selectedEarringVariant',
              earring.value === 'none' ? null : earring.value,
            )
          "
        >
          <div class="avatar-preview-with-earring">
            <img
              :src="
                generateEarringPreviewUrl(
                  earring.value === 'none' ? null : earring.value,
                )
              "
              :alt="`Avatar com ${earring.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
          <span class="earring-label">{{ earring.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Óculos -->
    <div v-if="activeTab === 'oculos'" class="tab-pane">
      <h3><i class="fas fa-glasses"></i> Óculos</h3>
      <div class="glasses-preview-container">
        <div
          v-for="glasses in glassesVariants"
          :key="glasses.value"
          class="glasses-preview-item"
          :class="{ active: selectedGlassesVariant === glasses.value }"
          @click="$emit('update:selectedGlassesVariant', glasses.value)"
          :title="glasses.label"
        >
          <div class="avatar-preview-with-glasses">
            <img
              :src="generateGlassesPreviewUrl(glasses.value)"
              :alt="`Avatar com ${glasses.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Aba: Recursos (features faciais) -->
    <div v-if="activeTab === 'recursos'" class="tab-pane">
      <h3><i class="fas fa-star"></i> Recursos Faciais</h3>
      <div class="features-preview-container">
        <div
          v-for="feature in faceFeaturesExtended"
          :key="feature.value"
          class="feature-preview-item"
          :class="{ active: selectedFaceFeature === feature.value }"
          @click="$emit('update:selectedFaceFeature', feature.value)"
          :title="feature.label"
        >
          <div class="avatar-preview-with-feature">
            <img
              :src="generateFeaturePreviewUrl(feature.value)"
              :alt="`Avatar com ${feature.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
          <span class="feature-label">{{ feature.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Cor da Pele -->
    <div v-if="activeTab === 'cor_pele'" class="tab-pane">
      <h3><i class="fas fa-tint"></i> Cor da Pele</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in skinColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedSkinColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedSkinColor', color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdventurerAvatarCustomizer",
  props: {
    activeTab: { type: String, required: true },
    selectedStyle: { type: String, required: true },
    selectedSkinColor: { type: String, required: true },
    selectedHairColor: { type: String, required: true },
    selectedHairStyle: { type: String, required: true },
    selectedEyeStyle: { type: String, required: true },
    selectedMouthStyle: { type: String, required: true },
    selectedBrowStyle: { type: String, required: true },
    selectedGlassesStyle: { type: String, required: true },
    selectedGlassesVariant: { type: String, required: true },
    selectedFaceFeature: { type: String, required: true },
    selectedEarringVariant: { type: String, default: null },
    selectedBeardStyle: { type: String, required: true },
    userSessionStore: { type: Object, required: true },
    selectedBackgroundColor: { type: String, required: true },
  },
  emits: [
    "update:selectedSkinColor",
    "update:selectedHairColor",
    "update:selectedHairStyle",
    "update:selectedEyeStyle",
    "update:selectedMouthStyle",
    "update:selectedBrowStyle",
    "update:selectedGlassesStyle",
    "update:selectedGlassesVariant",
    "update:selectedFaceFeature",
    "update:selectedEarringVariant",
    "update:selectedBeardStyle",
  ],
  data() {
    return {
      // Cores de pele (conforme documentação)
      skinColorOptions: [
        { value: "9e5622", label: "Escura" },
        { value: "763900", label: "Muito Escura" },
        { value: "ecad80", label: "Morena" },
        { value: "f2d3b1", label: "Clara" },
      ],

      // Cores do cabelo (conforme documentação)
      hairColorOptions: [
        { value: "0e0e0e", label: "Preto" },
        { value: "3eac2c", label: "Verde" },
        { value: "6a4e35", label: "Castanho" },
        { value: "85c2c6", label: "Azul Claro" },
        { value: "796a45", label: "Castanho Claro" },
        { value: "562306", label: "Marrom Escuro" },
        { value: "592454", label: "Roxo Escuro" },
        { value: "ab2a18", label: "Ruivo" },
        { value: "ac6511", label: "Cobre" },
        { value: "afafaf", label: "Cinza" },
        { value: "b9a05f", label: "Loiro Escuro" },
        { value: "cb6820", label: "Laranja" },
        { value: "dba3be", label: "Rosa Antigo" },
        { value: "e5d7a3", label: "Loiro Claro" },
      ],

      // Estilos de cabelo (conforme documentação)
      hairStyles: [
        { value: "any", label: "Qualquer um" },
        { value: "long01", label: "Longo 01" },
        { value: "long02", label: "Longo 02" },
        { value: "long03", label: "Longo 03" },
        { value: "long04", label: "Longo 04" },
        { value: "long05", label: "Longo 05" },
        { value: "long06", label: "Longo 06" },
        { value: "long07", label: "Longo 07" },
        { value: "long08", label: "Longo 08" },
        { value: "long09", label: "Longo 09" },
        { value: "long10", label: "Longo 10" },
        { value: "long11", label: "Longo 11" },
        { value: "long12", label: "Longo 12" },
        { value: "long13", label: "Longo 13" },
        { value: "long14", label: "Longo 14" },
        { value: "long15", label: "Longo 15" },
        { value: "long16", label: "Longo 16" },
        { value: "long17", label: "Longo 17" },
        { value: "long18", label: "Longo 18" },
        { value: "long19", label: "Longo 19" },
        { value: "long20", label: "Longo 20" },
        { value: "long21", label: "Longo 21" },
        { value: "long22", label: "Longo 22" },
        { value: "long23", label: "Longo 23" },
        { value: "long24", label: "Longo 24" },
        { value: "long25", label: "Longo 25" },
        { value: "long26", label: "Longo 26" },
        { value: "short01", label: "Curto 01" },
        { value: "short02", label: "Curto 02" },
        { value: "short03", label: "Curto 03" },
        { value: "short04", label: "Curto 04" },
        { value: "short05", label: "Curto 05" },
        { value: "short06", label: "Curto 06" },
        { value: "short07", label: "Curto 07" },
        { value: "short08", label: "Curto 08" },
        { value: "short09", label: "Curto 09" },
        { value: "short10", label: "Curto 10" },
        { value: "short11", label: "Curto 11" },
        { value: "short12", label: "Curto 12" },
        { value: "short13", label: "Curto 13" },
        { value: "short14", label: "Curto 14" },
        { value: "short15", label: "Curto 15" },
        { value: "short16", label: "Curto 16" },
        { value: "short17", label: "Curto 17" },
        { value: "short18", label: "Curto 18" },
        { value: "short19", label: "Curto 19" },
        { value: "bald", label: "Careca" },
      ],

      // Estilos de olhos (conforme documentação - 26 variantes)
      eyeStyles: [
        { value: "any", label: "Qualquer um" },
        { value: "variant01", label: "Variante 1" },
        { value: "variant02", label: "Variante 2" },
        { value: "variant03", label: "Variante 3" },
        { value: "variant04", label: "Variante 4" },
        { value: "variant05", label: "Variante 5" },
        { value: "variant06", label: "Variante 6" },
        { value: "variant07", label: "Variante 7" },
        { value: "variant08", label: "Variante 8" },
        { value: "variant09", label: "Variante 9" },
        { value: "variant10", label: "Variante 10" },
        { value: "variant11", label: "Variante 11" },
        { value: "variant12", label: "Variante 12" },
        { value: "variant13", label: "Variante 13" },
        { value: "variant14", label: "Variante 14" },
        { value: "variant15", label: "Variante 15" },
        { value: "variant16", label: "Variante 16" },
        { value: "variant17", label: "Variante 17" },
        { value: "variant18", label: "Variante 18" },
        { value: "variant19", label: "Variante 19" },
        { value: "variant20", label: "Variante 20" },
        { value: "variant21", label: "Variante 21" },
        { value: "variant22", label: "Variante 22" },
        { value: "variant23", label: "Variante 23" },
        { value: "variant24", label: "Variante 24" },
        { value: "variant25", label: "Variante 25" },
        { value: "variant26", label: "Variante 26" },
      ],

      // Sobrancelhas (conforme documentação - 15 variantes)
      eyebrowVariants: [
        { value: "variant01", label: "Sobrancelha 01" },
        { value: "variant02", label: "Sobrancelha 02" },
        { value: "variant03", label: "Sobrancelha 03" },
        { value: "variant04", label: "Sobrancelha 04" },
        { value: "variant05", label: "Sobrancelha 05" },
        { value: "variant06", label: "Sobrancelha 06" },
        { value: "variant07", label: "Sobrancelha 07" },
        { value: "variant08", label: "Sobrancelha 08" },
        { value: "variant09", label: "Sobrancelha 09" },
        { value: "variant10", label: "Sobrancelha 10" },
        { value: "variant11", label: "Sobrancelha 11" },
        { value: "variant12", label: "Sobrancelha 12" },
        { value: "variant13", label: "Sobrancelha 13" },
        { value: "variant14", label: "Sobrancelha 14" },
        { value: "variant15", label: "Sobrancelha 15" },
      ],

      // Boca (conforme documentação - 30 variantes)
      mouthStyles: [
        { value: "any", label: "Qualquer uma" },
        { value: "variant01", label: "Variante 1" },
        { value: "variant02", label: "Variante 2" },
        { value: "variant03", label: "Variante 3" },
        { value: "variant04", label: "Variante 4" },
        { value: "variant05", label: "Variante 5" },
        { value: "variant06", label: "Variante 6" },
        { value: "variant07", label: "Variante 7" },
        { value: "variant08", label: "Variante 8" },
        { value: "variant09", label: "Variante 9" },
        { value: "variant10", label: "Variante 10" },
        { value: "variant11", label: "Variante 11" },
        { value: "variant12", label: "Variante 12" },
        { value: "variant13", label: "Variante 13" },
        { value: "variant14", label: "Variante 14" },
        { value: "variant15", label: "Variante 15" },
        { value: "variant16", label: "Variante 16" },
        { value: "variant17", label: "Variante 17" },
        { value: "variant18", label: "Variante 18" },
        { value: "variant19", label: "Variante 19" },
        { value: "variant20", label: "Variante 20" },
        { value: "variant21", label: "Variante 21" },
        { value: "variant22", label: "Variante 22" },
        { value: "variant23", label: "Variante 23" },
        { value: "variant24", label: "Variante 24" },
        { value: "variant25", label: "Variante 25" },
        { value: "variant26", label: "Variante 26" },
        { value: "variant27", label: "Variante 27" },
        { value: "variant28", label: "Variante 28" },
        { value: "variant29", label: "Variante 29" },
        { value: "variant30", label: "Variante 30" },
      ],

      // Brincos (conforme documentação - 6 variantes)
      earringVariantsExtended: [
        { value: "none", label: "Nenhum" },
        { value: "variant01", label: "Brincos 01" },
        { value: "variant02", label: "Brincos 02" },
        { value: "variant03", label: "Brincos 03" },
        { value: "variant04", label: "Brincos 04" },
        { value: "variant05", label: "Brincos 05" },
        { value: "variant06", label: "Brincos 06" },
      ],

      // Óculos (conforme documentação - 5 variantes)
      glassesVariants: [
        { value: "none", label: "Nenhum" },
        { value: "variant01", label: "Óculos 01" },
        { value: "variant02", label: "Óculos 02" },
        { value: "variant03", label: "Óculos 03" },
        { value: "variant04", label: "Óculos 04" },
        { value: "variant05", label: "Óculos 05" },
      ],

      // Recursos faciais (conforme documentação)
      faceFeaturesExtended: [
        { value: "none", label: "Nenhum" },
        { value: "birthmark", label: "Sinal de Nascença" },
        { value: "blush", label: "Rubor" },
        { value: "freckles", label: "Sardas" },
        { value: "mustache", label: "Bigode" },
      ],
    };
  },
  computed: {
    isAdventurerStyle() {
      return this.selectedStyle === "adventurer";
    },
  },
  methods: {
    // Helper para construir base params
    _baseParams() {
      return `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=${this.selectedBackgroundColor}&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;
    },

    _buildUrl(extraParams) {
      return `https://api.dicebear.com/9.x/adventurer/svg?${this._baseParams()}${extraParams}&_t=${Date.now()}`;
    },

    // Parâmetros comuns do avatar atual (exceto o item sendo previewed)
    _currentParams({
      excludeHair,
      excludeEyes,
      excludeMouth,
      excludeEyebrows,
      excludeGlasses,
      excludeFeature,
      excludeEarrings,
    } = {}) {
      let extra = "";
      if (
        !excludeHair &&
        this.selectedHairStyle !== "any" &&
        this.selectedHairStyle !== "bald"
      ) {
        extra += `&hair=${this.selectedHairStyle}`;
      }
      if (!excludeEyes && this.selectedEyeStyle !== "any") {
        extra += `&eyes=${this.selectedEyeStyle}`;
      }
      if (!excludeMouth && this.selectedMouthStyle !== "any") {
        extra += `&mouth=${this.selectedMouthStyle}`;
      }
      if (!excludeEyebrows && this.selectedBrowStyle !== "flat") {
        extra += `&eyebrows=${this.selectedBrowStyle}`;
      }
      if (this.selectedBeardStyle !== "none") {
        extra += `&beard=${this.selectedBeardStyle}`;
      }
      if (!excludeGlasses) {
        if (this.selectedGlassesVariant !== "none") {
          extra += `&glasses=${this.selectedGlassesVariant}`;
        } else if (this.selectedGlassesStyle !== "none") {
          extra += `&glasses=${this.selectedGlassesStyle}`;
        }
      }
      if (!excludeFeature && this.selectedFaceFeature !== "none") {
        extra += `&faceFeature=${this.selectedFaceFeature}`;
      }
      if (
        !excludeEarrings &&
        this.selectedEarringVariant &&
        this.selectedEarringVariant !== "none"
      ) {
        extra += `&earrings=${this.selectedEarringVariant}`;
      }
      return extra;
    },

    // Gerar preview URLs
    generateHairPreviewUrl(hairValue) {
      if (!this.isAdventurerStyle) return "";
      let extra = "";
      if (hairValue !== "any" && hairValue !== "bald") {
        extra += `&hair=${hairValue}`;
      }
      extra += this._currentParams({ excludeHair: true });
      return this._buildUrl(extra);
    },

    generateEyePreviewUrl(eyeValue) {
      if (!this.isAdventurerStyle) return "";
      let extra = "";
      if (eyeValue !== "any") {
        extra += `&eyes=${eyeValue}`;
      }
      extra += this._currentParams({ excludeEyes: true });
      return this._buildUrl(extra);
    },

    generateEyebrowPreviewUrl(eyebrowValue) {
      if (!this.isAdventurerStyle) return "";
      let extra = "";
      if (eyebrowValue !== "flat") {
        extra += `&eyebrows=${eyebrowValue}`;
      }
      extra += this._currentParams({ excludeEyebrows: true });
      return this._buildUrl(extra);
    },

    generateMouthPreviewUrl(mouthValue) {
      if (!this.isAdventurerStyle) return "";
      let extra = "";
      if (mouthValue !== "any") {
        extra += `&mouth=${mouthValue}`;
      }
      extra += this._currentParams({ excludeMouth: true });
      return this._buildUrl(extra);
    },

    generateEarringPreviewUrl(earringValue) {
      if (!this.isAdventurerStyle) return "";
      let extra = "";
      if (earringValue && earringValue !== "none") {
        extra += `&earrings=${earringValue}&earringsProbability=100`;
      }
      extra += this._currentParams({ excludeEarrings: true });
      return this._buildUrl(extra);
    },

    generateGlassesPreviewUrl(glassesValue) {
      if (!this.isAdventurerStyle) return "";
      let extra = "";
      if (glassesValue !== "none") {
        extra += `&glasses=${glassesValue}&glassesProbability=100`;
      }
      extra += this._currentParams({ excludeGlasses: true });
      return this._buildUrl(extra);
    },

    generateFeaturePreviewUrl(featureValue) {
      if (!this.isAdventurerStyle) return "";
      let extra = "";
      if (featureValue !== "none") {
        extra += `&features=${featureValue}&featuresProbability=100`;
      }
      extra += this._currentParams({ excludeFeature: true });
      return this._buildUrl(extra);
    },
  },
};
</script>

<style scoped>
.adventurer-customizer {
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

.color-section {
  margin-bottom: 20px;
}

.color-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
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
  align-items: center;
}

.gradient-color-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e9ecef;
  cursor: pointer;
  padding: 0;
  -webkit-appearance: none;
  appearance: none;
  background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
}

.gradient-color-circle::-webkit-color-swatch-wrapper {
  padding: 0;
}

.gradient-color-circle::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}

.hair-preview-container,
.earring-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.hair-preview-item,
.earring-preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.hair-preview-item:hover,
.earring-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.hair-preview-item.active,
.earring-preview-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

.avatar-preview-with-hair,
.avatar-preview-with-earring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-preview-with-hair img,
.avatar-preview-with-earring img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.hair-label,
.earring-label,
.feature-label {
  font-size: 0.75rem;
  text-align: center;
  color: #495057;
}

.eye-preview-container,
.mouth-preview-container,
.brow-preview-container,
.glasses-preview-container,
.features-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.eye-preview-item,
.mouth-preview-item,
.brow-preview-item,
.glasses-preview-item,
.feature-preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.eye-preview-item:hover,
.mouth-preview-item:hover,
.brow-preview-item:hover,
.glasses-preview-item:hover,
.feature-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.eye-preview-item.active,
.mouth-preview-item.active,
.brow-preview-item.active,
.glasses-preview-item.active,
.feature-preview-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

.avatar-preview-with-eye,
.avatar-preview-with-mouth,
.avatar-preview-with-brow,
.avatar-preview-with-glasses,
.avatar-preview-with-feature {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-preview-with-eye img,
.avatar-preview-with-mouth img,
.avatar-preview-with-brow img,
.avatar-preview-with-glasses img,
.avatar-preview-with-feature img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}
</style>
