<template>
  <div class="micah-customizer">
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
            :class="{ active: selectedMicahHairColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectMicahHairColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <div class="hair-preview-container">
        <div
          v-for="hair in hairStyles"
          :key="hair.value"
          class="hair-preview-item"
          :class="{ active: selectedMicahHairStyle === hair.value }"
          @click="selectMicahHairStyle(hair.value)"
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

      <!-- Cor dos olhos -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor dos Olhos</h4>
        <div class="color-options">
          <div
            v-for="color in eyesColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedMicahEyesColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectMicahEyesColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <!-- Cor da sombra -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor da Sombra</h4>
        <div class="color-options">
          <div
            v-for="color in eyeShadowColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedMicahEyeShadowColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectMicahEyeShadowColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <div class="eye-preview-container">
        <div
          v-for="eye in eyesStyles"
          :key="eye.value"
          class="eye-preview-item"
          :class="{ active: selectedMicahEyeStyle === eye.value }"
          @click="selectMicahEyeStyle(eye.value)"
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

      <!-- Cor das sobrancelhas -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor das Sobrancelhas</h4>
        <div class="color-options">
          <div
            v-for="color in eyebrowsColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedMicahEyebrowsColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectMicahEyebrowsColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <div class="brow-preview-container">
        <div
          v-for="brow in eyebrowStyles"
          :key="brow.value"
          class="brow-preview-item"
          :class="{ active: selectedMicahEyebrowStyle === brow.value }"
          @click="selectMicahEyebrowStyle(brow.value)"
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

      <!-- Cor da boca -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor da Boca</h4>
        <div class="color-options">
          <div
            v-for="color in mouthColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedMicahMouthColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectMicahMouthColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <div class="mouth-preview-container">
        <div
          v-for="mouth in mouthStyles"
          :key="mouth.value"
          class="mouth-preview-item"
          :class="{ active: selectedMicahMouthStyle === mouth.value }"
          @click="selectMicahMouthStyle(mouth.value)"
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

    <!-- Aba: Nariz -->
    <div v-if="activeTab === 'nariz'" class="tab-pane">
      <h3><i class="fas fa-otter"></i> Estilo do Nariz</h3>
      <div class="mouth-preview-container">
        <div
          v-for="nose in noseStyles"
          :key="nose.value"
          class="mouth-preview-item"
          :class="{ active: selectedMicahNoseStyle === nose.value }"
          @click="selectMicahNoseStyle(nose.value)"
          :title="nose.label"
        >
          <div class="avatar-preview-with-mouth">
            <img
              :src="generateNosePreviewUrl(nose.value)"
              :alt="`Avatar com ${nose.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Aba: Orelhas -->
    <div v-if="activeTab === 'orelhas'" class="tab-pane">
      <h3><i class="fas fa-deaf"></i> Estilo das Orelhas</h3>
      <div class="mouth-preview-container">
        <div
          v-for="ear in earsStyles"
          :key="ear.value"
          class="mouth-preview-item"
          :class="{ active: selectedMicahEarStyle === ear.value }"
          @click="selectMicahEarStyle(ear.value)"
          :title="ear.label"
        >
          <div class="avatar-preview-with-mouth">
            <img
              :src="generateEarPreviewUrl(ear.value)"
              :alt="`Avatar com ${ear.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Aba: Barba -->
    <div v-if="activeTab === 'barba'" class="tab-pane">
      <h3><i class="fas fa-user"></i> Barba / Bigode</h3>

      <!-- Cor da barba -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor da Barba</h4>
        <div class="color-options">
          <div
            v-for="color in facialHairColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedMicahFacialHairColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectMicahFacialHairColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <div class="brow-preview-container">
        <div
          v-for="facial in facialHairStyles"
          :key="facial.value"
          class="brow-preview-item"
          :class="{ active: selectedMicahFacialHairStyle === facial.value }"
          @click="selectMicahFacialHairStyle(facial.value)"
          :title="facial.label"
        >
          <div class="avatar-preview-with-brow">
            <img
              :src="generateFacialHairPreviewUrl(facial.value)"
              :alt="`Avatar com ${facial.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Aba: Óculos -->
    <div v-if="activeTab === 'oculos'" class="tab-pane">
      <h3><i class="fas fa-glasses"></i> Óculos</h3>

      <!-- Cor dos óculos -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor dos Óculos</h4>
        <div class="color-options">
          <div
            v-for="color in glassesColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedMicahGlassesColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectMicahGlassesColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <div class="glasses-preview-container">
        <div
          v-for="glasses in glassesStyles"
          :key="glasses.value"
          class="glasses-preview-item"
          :class="{ active: selectedMicahGlassesStyle === glasses.value }"
          @click="selectMicahGlassesStyle(glasses.value)"
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

    <!-- Aba: Brincos -->
    <div v-if="activeTab === 'brincos'" class="tab-pane">
      <h3><i class="fas fa-gem"></i> Brincos</h3>

      <!-- Cor dos brincos -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor dos Brincos</h4>
        <div class="color-options">
          <div
            v-for="color in earringColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedMicahEarringColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectMicahEarringColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <div class="glasses-preview-container">
        <div
          v-for="earring in earringsStyles"
          :key="earring.value"
          class="glasses-preview-item"
          :class="{ active: selectedMicahEarringStyle === earring.value }"
          @click="selectMicahEarringStyle(earring.value)"
          :title="earring.label"
        >
          <div class="avatar-preview-with-glasses">
            <img
              :src="generateEarringPreviewUrl(earring.value)"
              :alt="`Avatar com ${earring.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Aba: Camisa -->
    <div v-if="activeTab === 'camisa'" class="tab-pane">
      <h3><i class="fas fa-tshirt"></i> Camisa</h3>

      <!-- Cor da camisa -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor da Camisa</h4>
        <div class="color-options">
          <div
            v-for="color in shirtColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedMicahShirtColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectMicahShirtColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <div class="hair-preview-container">
        <div
          v-for="shirt in shirtStyles"
          :key="shirt.value"
          class="hair-preview-item"
          :class="{ active: selectedMicahShirtStyle === shirt.value }"
          @click="selectMicahShirtStyle(shirt.value)"
          :title="shirt.label"
        >
          <div class="avatar-preview-with-hair">
            <img
              :src="generateShirtPreviewUrl(shirt.value)"
              :alt="`Avatar com ${shirt.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
          <span class="hair-label">{{ shirt.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Cor da Pele (baseColor) -->
    <div v-if="activeTab === 'cor_pele'" class="tab-pane">
      <h3><i class="fas fa-tint"></i> Cor da Pele</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in baseColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedMicahBaseColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectMicahBaseColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MicahAvatarCustomizer",
  props: {
    activeTab: { type: String, required: true },
    selectedStyle: { type: String, required: true },
    selectedMicahBaseColor: { type: String, required: true },
    selectedMicahHairStyle: { type: String, required: true },
    selectedMicahHairColor: { type: String, required: true },
    selectedMicahEyeStyle: { type: String, required: true },
    selectedMicahEyesColor: { type: String, required: true },
    selectedMicahEyeShadowColor: { type: String, required: true },
    selectedMicahEyebrowStyle: { type: String, required: true },
    selectedMicahEyebrowsColor: { type: String, required: true },
    selectedMicahMouthStyle: { type: String, required: true },
    selectedMicahMouthColor: { type: String, required: true },
    selectedMicahNoseStyle: { type: String, required: true },
    selectedMicahEarStyle: { type: String, required: true },
    selectedMicahFacialHairStyle: { type: String, required: true },
    selectedMicahFacialHairColor: { type: String, required: true },
    selectedMicahGlassesStyle: { type: String, required: true },
    selectedMicahGlassesColor: { type: String, required: true },
    selectedMicahEarringStyle: { type: String, required: true },
    selectedMicahEarringColor: { type: String, required: true },
    selectedMicahShirtStyle: { type: String, required: true },
    selectedMicahShirtColor: { type: String, required: true },
    userSessionStore: { type: Object, required: true },
  },
  emits: [
    "update:selectedMicahBaseColor",
    "update:selectedMicahHairStyle",
    "update:selectedMicahHairColor",
    "update:selectedMicahEyeStyle",
    "update:selectedMicahEyesColor",
    "update:selectedMicahEyeShadowColor",
    "update:selectedMicahEyebrowStyle",
    "update:selectedMicahEyebrowsColor",
    "update:selectedMicahMouthStyle",
    "update:selectedMicahMouthColor",
    "update:selectedMicahNoseStyle",
    "update:selectedMicahEarStyle",
    "update:selectedMicahFacialHairStyle",
    "update:selectedMicahFacialHairColor",
    "update:selectedMicahGlassesStyle",
    "update:selectedMicahGlassesColor",
    "update:selectedMicahEarringStyle",
    "update:selectedMicahEarringColor",
    "update:selectedMicahShirtStyle",
    "update:selectedMicahShirtColor",
  ],
  data() {
    return {
      // Cores de pele / base (conforme documentação)
      baseColorOptions: [
        { value: "77311d", label: "Escura" },
        { value: "ac6651", label: "Morena" },
        { value: "f9c9b6", label: "Clara" },
      ],

      // Estilos de cabelo (conforme documentação)
      hairStyles: [
        { value: "any", label: "Qualquer um" },
        { value: "dannyPhantom", label: "Danny Phantom" },
        { value: "dougFunny", label: "Doug Funny" },
        { value: "fonze", label: "Fonze" },
        { value: "full", label: "Cheio" },
        { value: "mrClean", label: "Careca (Mr Clean)" },
        { value: "mrT", label: "Mr T" },
        { value: "pixie", label: "Pixie" },
        { value: "turban", label: "Turbante" },
      ],

      // Cores de cabelo (conforme documentação)
      hairColorOptions: [
        { value: "000000", label: "Preto" },
        { value: "6bd9e9", label: "Azul Claro" },
        { value: "9287ff", label: "Roxo" },
        { value: "77311d", label: "Castanho Escuro" },
        { value: "ac6651", label: "Castanho" },
        { value: "d2eff3", label: "Azul Gelo" },
        { value: "e0ddff", label: "Lilás" },
        { value: "f4d150", label: "Loiro" },
        { value: "f9c9b6", label: "Rose" },
        { value: "fc909f", label: "Rosa" },
        { value: "ffeba4", label: "Amarelo Claro" },
        { value: "ffedef", label: "Rosa Bebê" },
        { value: "ffffff", label: "Branco" },
      ],

      // Estilos de olhos (conforme documentação)
      eyesStyles: [
        { value: "any", label: "Qualquer um" },
        { value: "eyes", label: "Normal" },
        { value: "eyesShadow", label: "Com Sombra" },
        { value: "round", label: "Redondo" },
        { value: "smiling", label: "Sorridente" },
        { value: "smilingShadow", label: "Sorridente com Sombra" },
      ],

      // Cores dos olhos (conforme documentação)
      eyesColorOptions: [{ value: "000000", label: "Preto" }],

      // Cores de sombra (conforme documentação)
      eyeShadowColorOptions: [
        { value: "d2eff3", label: "Azul Gelo" },
        { value: "e0ddff", label: "Lilás" },
        { value: "ffeba4", label: "Amarelo Claro" },
        { value: "ffedef", label: "Rosa Bebê" },
        { value: "ffffff", label: "Branco" },
      ],

      // Estilos de sobrancelhas (conforme documentação)
      eyebrowStyles: [
        { value: "any", label: "Qualquer uma" },
        { value: "down", label: "Para Baixo" },
        { value: "eyelashesDown", label: "Cílios Baixos" },
        { value: "eyelashesUp", label: "Cílios Altos" },
        { value: "up", label: "Para Cima" },
      ],

      // Cores das sobrancelhas (conforme documentação)
      eyebrowsColorOptions: [{ value: "000000", label: "Preto" }],

      // Estilos de boca (conforme documentação)
      mouthStyles: [
        { value: "any", label: "Qualquer uma" },
        { value: "frown", label: "Carranca" },
        { value: "laughing", label: "Rindo" },
        { value: "nervous", label: "Nervoso" },
        { value: "pucker", label: "Biquinho" },
        { value: "sad", label: "Triste" },
        { value: "smile", label: "Sorriso" },
        { value: "smirk", label: "Sorriso Torto" },
        { value: "surprised", label: "Surpreso" },
      ],

      // Cores da boca (conforme documentação)
      mouthColorOptions: [{ value: "000000", label: "Preto" }],

      // Estilos de nariz (conforme documentação)
      noseStyles: [
        { value: "any", label: "Qualquer um" },
        { value: "curve", label: "Curvo" },
        { value: "pointed", label: "Pontudo" },
        { value: "tound", label: "Arredondado" },
      ],

      // Estilos de orelhas (conforme documentação)
      earsStyles: [
        { value: "any", label: "Qualquer uma" },
        { value: "attached", label: "Colada" },
        { value: "detached", label: "Separada" },
      ],

      // Estilos de barba facial (conforme documentação)
      facialHairStyles: [
        { value: "none", label: "Nenhuma" },
        { value: "beard", label: "Barba" },
        { value: "scruff", label: "Barba por Fazer" },
      ],

      // Cores da barba facial (conforme documentação)
      facialHairColorOptions: [{ value: "000000", label: "Preto" }],

      // Estilos de óculos (conforme documentação)
      glassesStyles: [
        { value: "none", label: "Nenhum" },
        { value: "round", label: "Redondo" },
        { value: "square", label: "Quadrado" },
      ],

      // Cores dos óculos (conforme documentação)
      glassesColorOptions: [
        { value: "000000", label: "Preto" },
        { value: "6bd9e9", label: "Azul Claro" },
        { value: "9287ff", label: "Roxo" },
        { value: "77311d", label: "Marrom Escuro" },
        { value: "ac6651", label: "Marrom" },
        { value: "d2eff3", label: "Azul Gelo" },
        { value: "e0ddff", label: "Lilás" },
        { value: "f4d150", label: "Dourado" },
        { value: "f9c9b6", label: "Rose" },
        { value: "fc909f", label: "Rosa" },
        { value: "ffeba4", label: "Amarelo Claro" },
        { value: "ffedef", label: "Rosa Bebê" },
        { value: "ffffff", label: "Branco" },
      ],

      // Estilos de brincos (conforme documentação)
      earringsStyles: [
        { value: "none", label: "Nenhum" },
        { value: "hoop", label: "Argola" },
        { value: "stud", label: "Ponto" },
      ],

      // Cores dos brincos (conforme documentação)
      earringColorOptions: [
        { value: "000000", label: "Preto" },
        { value: "6bd9e9", label: "Azul Claro" },
        { value: "9287ff", label: "Roxo" },
        { value: "77311d", label: "Marrom Escuro" },
        { value: "ac6651", label: "Marrom" },
        { value: "d2eff3", label: "Azul Gelo" },
        { value: "e0ddff", label: "Lilás" },
        { value: "f4d150", label: "Dourado" },
        { value: "f9c9b6", label: "Rose" },
        { value: "fc909f", label: "Rosa" },
        { value: "ffeba4", label: "Amarelo Claro" },
        { value: "ffedef", label: "Rosa Bebê" },
        { value: "ffffff", label: "Branco" },
      ],

      // Estilos de camisa (conforme documentação)
      shirtStyles: [
        { value: "any", label: "Qualquer uma" },
        { value: "collared", label: "Com Gola" },
        { value: "crew", label: "Gola Redonda" },
        { value: "open", label: "Aberta" },
      ],

      // Cores da camisa (conforme documentação)
      shirtColorOptions: [
        { value: "000000", label: "Preto" },
        { value: "6bd9e9", label: "Azul Claro" },
        { value: "9287ff", label: "Roxo" },
        { value: "77311d", label: "Marrom Escuro" },
        { value: "ac6651", label: "Marrom" },
        { value: "d2eff3", label: "Azul Gelo" },
        { value: "e0ddff", label: "Lilás" },
        { value: "f4d150", label: "Dourado" },
        { value: "f9c9b6", label: "Rose" },
        { value: "fc909f", label: "Rosa" },
        { value: "ffeba4", label: "Amarelo Claro" },
        { value: "ffedef", label: "Rosa Bebê" },
        { value: "ffffff", label: "Branco" },
      ],
    };
  },
  computed: {
    isMicahStyle() {
      return this.selectedStyle === "micah";
    },
  },
  methods: {
    // Emit methods
    selectMicahBaseColor(c) {
      this.$emit("update:selectedMicahBaseColor", c);
    },
    selectMicahHairStyle(s) {
      this.$emit("update:selectedMicahHairStyle", s);
    },
    selectMicahHairColor(c) {
      this.$emit("update:selectedMicahHairColor", c);
    },
    selectMicahEyeStyle(s) {
      this.$emit("update:selectedMicahEyeStyle", s);
    },
    selectMicahEyesColor(c) {
      this.$emit("update:selectedMicahEyesColor", c);
    },
    selectMicahEyeShadowColor(c) {
      this.$emit("update:selectedMicahEyeShadowColor", c);
    },
    selectMicahEyebrowStyle(s) {
      this.$emit("update:selectedMicahEyebrowStyle", s);
    },
    selectMicahEyebrowsColor(c) {
      this.$emit("update:selectedMicahEyebrowsColor", c);
    },
    selectMicahMouthStyle(s) {
      this.$emit("update:selectedMicahMouthStyle", s);
    },
    selectMicahMouthColor(c) {
      this.$emit("update:selectedMicahMouthColor", c);
    },
    selectMicahNoseStyle(s) {
      this.$emit("update:selectedMicahNoseStyle", s);
    },
    selectMicahEarStyle(s) {
      this.$emit("update:selectedMicahEarStyle", s);
    },
    selectMicahFacialHairStyle(s) {
      this.$emit("update:selectedMicahFacialHairStyle", s);
    },
    selectMicahFacialHairColor(c) {
      this.$emit("update:selectedMicahFacialHairColor", c);
    },
    selectMicahGlassesStyle(s) {
      this.$emit("update:selectedMicahGlassesStyle", s);
    },
    selectMicahGlassesColor(c) {
      this.$emit("update:selectedMicahGlassesColor", c);
    },
    selectMicahEarringStyle(s) {
      this.$emit("update:selectedMicahEarringStyle", s);
    },
    selectMicahEarringColor(c) {
      this.$emit("update:selectedMicahEarringColor", c);
    },
    selectMicahShirtStyle(s) {
      this.$emit("update:selectedMicahShirtStyle", s);
    },
    selectMicahShirtColor(c) {
      this.$emit("update:selectedMicahShirtColor", c);
    },

    // Helper para construir base params
    _baseParams() {
      return `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=f0f0f0&baseColor=${this.selectedMicahBaseColor}`;
    },

    _buildUrl(extraParams) {
      return `https://api.dicebear.com/9.x/micah/svg?${this._baseParams()}${extraParams}&_t=${Date.now()}`;
    },

    // Gerar preview URLs
    generateHairPreviewUrl(hairValue) {
      if (!this.isMicahStyle) return "";
      let extra = "";
      if (hairValue !== "any")
        extra += `&hair=${hairValue}&hairProbability=100`;
      extra += `&hairColor=${this.selectedMicahHairColor}`;
      return this._buildUrl(extra);
    },

    generateEyePreviewUrl(eyeValue) {
      if (!this.isMicahStyle) return "";
      let extra = "";
      if (eyeValue !== "any") extra += `&eyes=${eyeValue}`;
      extra += `&eyesColor=${this.selectedMicahEyesColor}`;
      extra += `&eyeShadowColor=${this.selectedMicahEyeShadowColor}`;
      if (this.selectedMicahHairStyle !== "any")
        extra += `&hair=${this.selectedMicahHairStyle}&hairProbability=100`;
      return this._buildUrl(extra);
    },

    generateEyebrowPreviewUrl(eyebrowValue) {
      if (!this.isMicahStyle) return "";
      let extra = "";
      if (eyebrowValue !== "any") extra += `&eyebrows=${eyebrowValue}`;
      extra += `&eyebrowsColor=${this.selectedMicahEyebrowsColor}`;
      if (this.selectedMicahHairStyle !== "any")
        extra += `&hair=${this.selectedMicahHairStyle}&hairProbability=100`;
      if (this.selectedMicahEyeStyle !== "any")
        extra += `&eyes=${this.selectedMicahEyeStyle}`;
      return this._buildUrl(extra);
    },

    generateMouthPreviewUrl(mouthValue) {
      if (!this.isMicahStyle) return "";
      let extra = "";
      if (mouthValue !== "any") extra += `&mouth=${mouthValue}`;
      extra += `&mouthColor=${this.selectedMicahMouthColor}`;
      if (this.selectedMicahHairStyle !== "any")
        extra += `&hair=${this.selectedMicahHairStyle}&hairProbability=100`;
      if (this.selectedMicahEyeStyle !== "any")
        extra += `&eyes=${this.selectedMicahEyeStyle}`;
      return this._buildUrl(extra);
    },

    generateNosePreviewUrl(noseValue) {
      if (!this.isMicahStyle) return "";
      let extra = "";
      if (noseValue !== "any") extra += `&nose=${noseValue}`;
      if (this.selectedMicahHairStyle !== "any")
        extra += `&hair=${this.selectedMicahHairStyle}&hairProbability=100`;
      if (this.selectedMicahEyeStyle !== "any")
        extra += `&eyes=${this.selectedMicahEyeStyle}`;
      if (this.selectedMicahMouthStyle !== "any")
        extra += `&mouth=${this.selectedMicahMouthStyle}`;
      return this._buildUrl(extra);
    },

    generateEarPreviewUrl(earValue) {
      if (!this.isMicahStyle) return "";
      let extra = "";
      if (earValue !== "any") extra += `&ears=${earValue}`;
      if (this.selectedMicahHairStyle !== "any")
        extra += `&hair=${this.selectedMicahHairStyle}&hairProbability=100`;
      return this._buildUrl(extra);
    },

    generateFacialHairPreviewUrl(facialHairValue) {
      if (!this.isMicahStyle) return "";
      let extra = "";
      if (facialHairValue !== "none") {
        extra += `&facialHair=${facialHairValue}&facialHairProbability=100`;
        extra += `&facialHairColor=${this.selectedMicahFacialHairColor}`;
      }
      if (this.selectedMicahHairStyle !== "any")
        extra += `&hair=${this.selectedMicahHairStyle}&hairProbability=100`;
      if (this.selectedMicahEyeStyle !== "any")
        extra += `&eyes=${this.selectedMicahEyeStyle}`;
      if (this.selectedMicahMouthStyle !== "any")
        extra += `&mouth=${this.selectedMicahMouthStyle}`;
      return this._buildUrl(extra);
    },

    generateGlassesPreviewUrl(glassesValue) {
      if (!this.isMicahStyle) return "";
      let extra = "";
      if (glassesValue !== "none") {
        extra += `&glasses=${glassesValue}&glassesProbability=100`;
        extra += `&glassesColor=${this.selectedMicahGlassesColor}`;
      }
      if (this.selectedMicahHairStyle !== "any")
        extra += `&hair=${this.selectedMicahHairStyle}&hairProbability=100`;
      if (this.selectedMicahEyeStyle !== "any")
        extra += `&eyes=${this.selectedMicahEyeStyle}`;
      return this._buildUrl(extra);
    },

    generateEarringPreviewUrl(earringValue) {
      if (!this.isMicahStyle) return "";
      let extra = "";
      if (earringValue !== "none") {
        extra += `&earrings=${earringValue}&earringsProbability=100`;
        extra += `&earringColor=${this.selectedMicahEarringColor}`;
      }
      if (this.selectedMicahHairStyle !== "any")
        extra += `&hair=${this.selectedMicahHairStyle}&hairProbability=100`;
      return this._buildUrl(extra);
    },

    generateShirtPreviewUrl(shirtValue) {
      if (!this.isMicahStyle) return "";
      let extra = "";
      if (shirtValue !== "any") extra += `&shirt=${shirtValue}`;
      extra += `&shirtColor=${this.selectedMicahShirtColor}`;
      if (this.selectedMicahHairStyle !== "any")
        extra += `&hair=${this.selectedMicahHairStyle}&hairProbability=100`;
      return this._buildUrl(extra);
    },
  },
};
</script>

<style scoped>
.micah-customizer {
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
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
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

.hair-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.hair-preview-item {
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

.hair-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.hair-preview-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

.avatar-preview-with-hair {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-preview-with-hair img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.hair-label {
  font-size: 0.75rem;
  text-align: center;
  color: #495057;
}

.eye-preview-container,
.mouth-preview-container,
.brow-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.eye-preview-item,
.mouth-preview-item,
.brow-preview-item {
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
.brow-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.eye-preview-item.active,
.mouth-preview-item.active,
.brow-preview-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

.avatar-preview-with-eye,
.avatar-preview-with-mouth,
.avatar-preview-with-brow {
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
.avatar-preview-with-brow img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.glasses-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.glasses-preview-item {
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

.glasses-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.glasses-preview-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

.avatar-preview-with-glasses {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-preview-with-glasses img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}
</style>
