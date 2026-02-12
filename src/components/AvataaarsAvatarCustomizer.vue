<template>
  <div class="avataaars-customizer">
    <!-- Aba: Cabelo/Top -->
    <div v-if="activeTab === 'cabelo'" class="tab-pane">
      <h3><i class="fas fa-cut"></i> Estilo de Cabelo</h3>

      <!-- Seleção de cor do cabelo -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor do Cabelo</h4>
        <div class="color-options">
          <div
            v-for="color in hairColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedHairColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectHairColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <div class="hair-preview-container">
        <div
          v-for="hair in topStyles"
          :key="hair.value"
          class="hair-preview-item"
          :class="{ active: selectedTopStyle === hair.value }"
          @click="selectTopStyle(hair.value)"
        >
          <div class="avatar-preview-with-hair">
            <img
              :src="generateTopPreviewUrl(hair.value)"
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
          v-for="eye in eyesStyles"
          :key="eye.value"
          class="eye-preview-item"
          :class="{ active: selectedEyeStyle === eye.value }"
          @click="selectEyeStyle(eye.value)"
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
          v-for="brow in eyebrowStyles"
          :key="brow.value"
          class="brow-preview-item"
          :class="{ active: selectedEyebrowStyle === brow.value }"
          @click="selectEyebrowStyle(brow.value)"
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
          @click="selectMouthStyle(mouth.value)"
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

    <!-- Aba: Barba Facial -->
    <div v-if="activeTab === 'barba'" class="tab-pane">
      <h3><i class="fas fa-user"></i> Barba / Bigode</h3>

      <!-- Seleção de cor da barba -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor da Barba</h4>
        <div class="color-options">
          <div
            v-for="color in facialHairColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedFacialHairColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectFacialHairColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <div class="brow-preview-container">
        <div
          v-for="facial in facialHairStyles"
          :key="facial.value"
          class="brow-preview-item"
          :class="{ active: selectedFacialHairStyle === facial.value }"
          @click="selectFacialHairStyle(facial.value)"
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

    <!-- Aba: Acessórios -->
    <div v-if="activeTab === 'acessorios'" class="tab-pane">
      <h3><i class="fas fa-glasses"></i> Acessórios</h3>

      <!-- Seleção de cor dos acessórios -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor dos Acessórios</h4>
        <div class="color-options">
          <div
            v-for="color in accessoriesColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedAccessoriesColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectAccessoriesColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <div class="glasses-preview-container">
        <div
          v-for="acc in accessoriesStyles"
          :key="acc.value"
          class="glasses-preview-item"
          :class="{ active: selectedAccessoryStyle === acc.value }"
          @click="selectAccessoryStyle(acc.value)"
          :title="acc.label"
        >
          <div class="avatar-preview-with-glasses">
            <img
              :src="generateAccessoryPreviewUrl(acc.value)"
              :alt="`Avatar com ${acc.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Aba: Roupas -->
    <div v-if="activeTab === 'roupas'" class="tab-pane">
      <h3><i class="fas fa-tshirt"></i> Roupas</h3>

      <!-- Seleção de cor da roupa -->
      <div class="color-section">
        <h4><i class="fas fa-palette"></i> Cor da Roupa</h4>
        <div class="color-options">
          <div
            v-for="color in clothesColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedClothesColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectClothesColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>

      <div class="hair-preview-container">
        <div
          v-for="cloth in clothingStyles"
          :key="cloth.value"
          class="hair-preview-item"
          :class="{ active: selectedClothingStyle === cloth.value }"
          @click="selectClothingStyle(cloth.value)"
          :title="cloth.label"
        >
          <div class="avatar-preview-with-hair">
            <img
              :src="generateClothingPreviewUrl(cloth.value)"
              :alt="`Avatar com ${cloth.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
          <span class="hair-label">{{ cloth.label }}</span>
        </div>
      </div>

      <!-- Estampas (só aparece para graphicShirt) -->
      <div
        v-if="selectedClothingStyle === 'graphicShirt'"
        class="color-section"
        style="margin-top: 20px"
      >
        <h4><i class="fas fa-image"></i> Estampa da Camiseta</h4>
        <div class="hair-preview-container">
          <div
            v-for="graphic in clothingGraphicStyles"
            :key="graphic.value"
            class="hair-preview-item"
            :class="{ active: selectedClothingGraphic === graphic.value }"
            @click="selectClothingGraphic(graphic.value)"
            :title="graphic.label"
          >
            <div class="avatar-preview-with-hair">
              <img
                :src="generateClothingGraphicPreviewUrl(graphic.value)"
                :alt="`Estampa ${graphic.label.toLowerCase()}`"
                class="preview-image"
              />
            </div>
            <span class="hair-label">{{ graphic.label }}</span>
          </div>
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
            @click="selectSkinColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>
    </div>

    <!-- Aba: Cor do Chapéu -->
    <div v-if="activeTab === 'chapeu'" class="tab-pane">
      <h3><i class="fas fa-hat-wizard"></i> Cor do Chapéu</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in hatColorOptions"
            :key="color.value"
            class="color-option"
            :class="{ active: selectedHatColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="selectHatColor(color.value)"
            :title="color.label"
          ></div>
        </div>
      </div>
    </div>

    <!-- Aba: Estilo Visual (circle/default) -->
    <div v-if="activeTab === 'visual'" class="tab-pane">
      <h3><i class="fas fa-shapes"></i> Estilo Visual</h3>
      <div class="glasses-preview-container">
        <div
          v-for="st in avatarStyleOptions"
          :key="st.value"
          class="glasses-preview-item"
          :class="{ active: selectedAvatarStyle === st.value }"
          @click="selectAvatarStyle(st.value)"
          :title="st.label"
        >
          <div class="avatar-preview-with-glasses">
            <img
              :src="generateAvatarStylePreviewUrl(st.value)"
              :alt="`Estilo ${st.label.toLowerCase()}`"
              class="preview-image"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AvataaarsAvatarCustomizer",
  props: {
    activeTab: { type: String, required: true },
    selectedStyle: { type: String, required: true },
    selectedSkinColor: { type: String, required: true },
    selectedHairColor: { type: String, required: true },
    selectedTopStyle: { type: String, required: true },
    selectedEyeStyle: { type: String, required: true },
    selectedEyebrowStyle: { type: String, required: true },
    selectedMouthStyle: { type: String, required: true },
    selectedFacialHairStyle: { type: String, required: true },
    selectedFacialHairColor: { type: String, required: true },
    selectedAccessoryStyle: { type: String, required: true },
    selectedAccessoriesColor: { type: String, required: true },
    selectedClothingStyle: { type: String, required: true },
    selectedClothesColor: { type: String, required: true },
    selectedClothingGraphic: { type: String, required: true },
    selectedHatColor: { type: String, required: true },
    selectedAvatarStyle: { type: String, required: true },
    userSessionStore: { type: Object, required: true },
  },
  emits: [
    "update:selectedSkinColor",
    "update:selectedHairColor",
    "update:selectedTopStyle",
    "update:selectedEyeStyle",
    "update:selectedEyebrowStyle",
    "update:selectedMouthStyle",
    "update:selectedFacialHairStyle",
    "update:selectedFacialHairColor",
    "update:selectedAccessoryStyle",
    "update:selectedAccessoriesColor",
    "update:selectedClothingStyle",
    "update:selectedClothesColor",
    "update:selectedClothingGraphic",
    "update:selectedHatColor",
    "update:selectedAvatarStyle",
  ],
  data() {
    return {
      // Cores de pele (conforme documentação)
      skinColorOptions: [
        { value: "614335", label: "Muito Escura" },
        { value: "ae5d29", label: "Escura" },
        { value: "d08b5b", label: "Morena" },
        { value: "edb98a", label: "Média" },
        { value: "f8d25c", label: "Dourada" },
        { value: "fd9841", label: "Bronzeada" },
        { value: "ffdbb4", label: "Clara" },
      ],

      // Cores de cabelo (conforme documentação)
      hairColorOptions: [
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

      // Estilos de cabelo/top (conforme documentação)
      topStyles: [
        { value: "any", label: "Qualquer um" },
        { value: "bigHair", label: "Cabelo Grande" },
        { value: "bob", label: "Bob" },
        { value: "bun", label: "Coque" },
        { value: "curly", label: "Cacheado" },
        { value: "curvy", label: "Ondulado" },
        { value: "dreads", label: "Dreads" },
        { value: "dreads01", label: "Dreads 01" },
        { value: "dreads02", label: "Dreads 02" },
        { value: "frida", label: "Frida" },
        { value: "frizzle", label: "Frisado" },
        { value: "fro", label: "Afro" },
        { value: "froBand", label: "Afro com Faixa" },
        { value: "hat", label: "Chapéu" },
        { value: "hijab", label: "Hijab" },
        { value: "longButNotTooLong", label: "Longo Médio" },
        { value: "miaWallace", label: "Mia Wallace" },
        { value: "shaggy", label: "Desgrenhado" },
        { value: "shaggyMullet", label: "Mullet" },
        { value: "shavedSides", label: "Laterais Raspadas" },
        { value: "shortCurly", label: "Curto Cacheado" },
        { value: "shortFlat", label: "Curto Liso" },
        { value: "shortRound", label: "Curto Arredondado" },
        { value: "shortWaved", label: "Curto Ondulado" },
        { value: "sides", label: "Laterais" },
        { value: "straight01", label: "Liso 01" },
        { value: "straight02", label: "Liso 02" },
        { value: "straightAndStrand", label: "Liso com Mecha" },
        { value: "theCaesar", label: "César" },
        { value: "theCaesarAndSidePart", label: "César Lateral" },
        { value: "turban", label: "Turbante" },
        { value: "winterHat1", label: "Gorro 01" },
        { value: "winterHat02", label: "Gorro 02" },
        { value: "winterHat03", label: "Gorro 03" },
        { value: "winterHat04", label: "Gorro 04" },
      ],

      // Estilos de olhos (conforme documentação)
      eyesStyles: [
        { value: "any", label: "Qualquer um" },
        { value: "closed", label: "Fechados" },
        { value: "cry", label: "Chorando" },
        { value: "default", label: "Padrão" },
        { value: "eyeRoll", label: "Revirando" },
        { value: "happy", label: "Feliz" },
        { value: "hearts", label: "Corações" },
        { value: "side", label: "Lateral" },
        { value: "squint", label: "Semicerrados" },
        { value: "surprised", label: "Surpreso" },
        { value: "wink", label: "Piscando" },
        { value: "winkWacky", label: "Piscando Louco" },
        { value: "xDizzy", label: "Tonto" },
      ],

      // Estilos de sobrancelhas (conforme documentação)
      eyebrowStyles: [
        { value: "any", label: "Qualquer uma" },
        { value: "angry", label: "Bravo" },
        { value: "angryNatural", label: "Bravo Natural" },
        { value: "default", label: "Padrão" },
        { value: "defaultNatural", label: "Padrão Natural" },
        { value: "flatNatural", label: "Reta Natural" },
        { value: "frownNatural", label: "Franzida Natural" },
        { value: "raisedExcited", label: "Elevada Animada" },
        { value: "raisedExcitedNatural", label: "Elevada Animada Natural" },
        { value: "sadConcerned", label: "Triste Preocupada" },
        { value: "sadConcernedNatural", label: "Triste Preocupada Natural" },
        { value: "unibrowNatural", label: "Monocelha" },
        { value: "upDown", label: "Cima e Baixo" },
        { value: "upDownNatural", label: "Cima e Baixo Natural" },
      ],

      // Estilos de boca (conforme documentação)
      mouthStyles: [
        { value: "any", label: "Qualquer uma" },
        { value: "concerned", label: "Preocupado" },
        { value: "default", label: "Padrão" },
        { value: "disbelief", label: "Descrente" },
        { value: "eating", label: "Comendo" },
        { value: "grimace", label: "Careta" },
        { value: "sad", label: "Triste" },
        { value: "screamOpen", label: "Gritando" },
        { value: "serious", label: "Sério" },
        { value: "smile", label: "Sorrindo" },
        { value: "tongue", label: "Língua" },
        { value: "twinkle", label: "Brilhante" },
        { value: "vomit", label: "Vomitando" },
      ],

      // Estilos de barba facial (conforme documentação)
      facialHairStyles: [
        { value: "none", label: "Nenhuma" },
        { value: "beardLight", label: "Barba Leve" },
        { value: "beardMajestic", label: "Barba Majestosa" },
        { value: "beardMedium", label: "Barba Média" },
        { value: "moustacheFancy", label: "Bigode Elegante" },
        { value: "moustacheMagnum", label: "Bigode Magnum" },
      ],

      // Cores de barba facial (conforme documentação)
      facialHairColorOptions: [
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

      // Estilos de acessórios (conforme documentação)
      accessoriesStyles: [
        { value: "none", label: "Nenhum" },
        { value: "eyepatch", label: "Tapa-olho" },
        { value: "kurt", label: "Kurt" },
        { value: "prescription01", label: "Óculos Grau 01" },
        { value: "prescription02", label: "Óculos Grau 02" },
        { value: "round", label: "Óculos Redondo" },
        { value: "sunglasses", label: "Óculos de Sol" },
        { value: "wayfarers", label: "Wayfarers" },
      ],

      // Cores dos acessórios (conforme documentação)
      accessoriesColorOptions: [
        { value: "3c4f5c", label: "Azul Escuro" },
        { value: "65c9ff", label: "Azul Claro" },
        { value: "262e33", label: "Preto" },
        { value: "5199e4", label: "Azul" },
        { value: "25557c", label: "Azul Marinho" },
        { value: "929598", label: "Cinza" },
        { value: "a7ffc4", label: "Verde Claro" },
        { value: "b1e2ff", label: "Azul Bebê" },
        { value: "e6e6e6", label: "Cinza Claro" },
        { value: "ff5c5c", label: "Vermelho" },
        { value: "ff488e", label: "Rosa" },
        { value: "ffafb9", label: "Rosa Claro" },
        { value: "ffdeb5", label: "Bege" },
        { value: "ffffb1", label: "Amarelo Claro" },
        { value: "ffffff", label: "Branco" },
      ],

      // Estilos de roupas (conforme documentação)
      clothingStyles: [
        { value: "any", label: "Qualquer uma" },
        { value: "blazerAndShirt", label: "Blazer e Camisa" },
        { value: "blazerAndSweater", label: "Blazer e Suéter" },
        { value: "collarAndSweater", label: "Gola e Suéter" },
        { value: "graphicShirt", label: "Camiseta Estampada" },
        { value: "hoodie", label: "Moletom" },
        { value: "overall", label: "Macacão" },
        { value: "shirtCrewNeck", label: "Camisa Gola Redonda" },
        { value: "shirtScoopNeck", label: "Camisa Gola Canoa" },
        { value: "shirtVNeck", label: "Camisa Gola V" },
      ],

      // Cores das roupas (conforme documentação)
      clothesColorOptions: [
        { value: "3c4f5c", label: "Azul Escuro" },
        { value: "65c9ff", label: "Azul Claro" },
        { value: "262e33", label: "Preto" },
        { value: "5199e4", label: "Azul" },
        { value: "25557c", label: "Azul Marinho" },
        { value: "929598", label: "Cinza" },
        { value: "a7ffc4", label: "Verde Claro" },
        { value: "b1e2ff", label: "Azul Bebê" },
        { value: "e6e6e6", label: "Cinza Claro" },
        { value: "ff5c5c", label: "Vermelho" },
        { value: "ff488e", label: "Rosa" },
        { value: "ffafb9", label: "Rosa Claro" },
        { value: "ffffb1", label: "Amarelo Claro" },
        { value: "ffffff", label: "Branco" },
      ],

      // Estampas das roupas (conforme documentação)
      clothingGraphicStyles: [
        { value: "bat", label: "Morcego" },
        { value: "bear", label: "Urso" },
        { value: "cumbia", label: "Cumbia" },
        { value: "deer", label: "Cervo" },
        { value: "diamond", label: "Diamante" },
        { value: "hola", label: "Hola" },
        { value: "pizza", label: "Pizza" },
        { value: "resist", label: "Resist" },
        { value: "skull", label: "Caveira" },
        { value: "skullOutline", label: "Caveira Contorno" },
      ],

      // Cores do chapéu (conforme documentação)
      hatColorOptions: [
        { value: "3c4f5c", label: "Azul Escuro" },
        { value: "65c9ff", label: "Azul Claro" },
        { value: "262e33", label: "Preto" },
        { value: "5199e4", label: "Azul" },
        { value: "25557c", label: "Azul Marinho" },
        { value: "929598", label: "Cinza" },
        { value: "a7ffc4", label: "Verde Claro" },
        { value: "b1e2ff", label: "Azul Bebê" },
        { value: "e6e6e6", label: "Cinza Claro" },
        { value: "ff5c5c", label: "Vermelho" },
        { value: "ff488e", label: "Rosa" },
        { value: "ffafb9", label: "Rosa Claro" },
        { value: "ffdeb5", label: "Bege" },
        { value: "ffffb1", label: "Amarelo Claro" },
        { value: "ffffff", label: "Branco" },
      ],

      // Estilo visual do avatar
      avatarStyleOptions: [
        { value: "circle", label: "Círculo" },
        { value: "default", label: "Padrão" },
      ],
    };
  },
  computed: {
    isAvataaarsStyle() {
      return this.selectedStyle === "avataaars";
    },
  },
  methods: {
    // Emit methods
    selectSkinColor(color) {
      this.$emit("update:selectedSkinColor", color);
    },
    selectHairColor(color) {
      this.$emit("update:selectedHairColor", color);
    },
    selectTopStyle(style) {
      this.$emit("update:selectedTopStyle", style);
    },
    selectEyeStyle(style) {
      this.$emit("update:selectedEyeStyle", style);
    },
    selectEyebrowStyle(style) {
      this.$emit("update:selectedEyebrowStyle", style);
    },
    selectMouthStyle(style) {
      this.$emit("update:selectedMouthStyle", style);
    },
    selectFacialHairStyle(style) {
      this.$emit("update:selectedFacialHairStyle", style);
    },
    selectFacialHairColor(color) {
      this.$emit("update:selectedFacialHairColor", color);
    },
    selectAccessoryStyle(style) {
      this.$emit("update:selectedAccessoryStyle", style);
    },
    selectAccessoriesColor(color) {
      this.$emit("update:selectedAccessoriesColor", color);
    },
    selectClothingStyle(style) {
      this.$emit("update:selectedClothingStyle", style);
    },
    selectClothesColor(color) {
      this.$emit("update:selectedClothesColor", color);
    },
    selectClothingGraphic(graphic) {
      this.$emit("update:selectedClothingGraphic", graphic);
    },
    selectHatColor(color) {
      this.$emit("update:selectedHatColor", color);
    },
    selectAvatarStyle(style) {
      this.$emit("update:selectedAvatarStyle", style);
    },

    // Helper para construir base params
    _baseParams() {
      return `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=f0f0f0&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;
    },

    // Helper para construir URL completa de preview
    _buildUrl(extraParams) {
      return `https://api.dicebear.com/9.x/avataaars/svg?${this._baseParams()}${extraParams}&_t=${Date.now()}`;
    },

    // Gerar preview URLs
    generateTopPreviewUrl(topValue) {
      if (!this.isAvataaarsStyle) return "";
      let extra = "";
      if (topValue !== "any") extra += `&top=${topValue}`;
      if (this.selectedHatColor) extra += `&hatColor=${this.selectedHatColor}`;
      return this._buildUrl(extra);
    },

    generateEyePreviewUrl(eyeValue) {
      if (!this.isAvataaarsStyle) return "";
      let extra = "";
      if (eyeValue !== "any") extra += `&eyes=${eyeValue}`;
      if (this.selectedTopStyle !== "any")
        extra += `&top=${this.selectedTopStyle}`;
      return this._buildUrl(extra);
    },

    generateEyebrowPreviewUrl(eyebrowValue) {
      if (!this.isAvataaarsStyle) return "";
      let extra = "";
      if (eyebrowValue !== "any") extra += `&eyebrows=${eyebrowValue}`;
      if (this.selectedTopStyle !== "any")
        extra += `&top=${this.selectedTopStyle}`;
      if (this.selectedEyeStyle !== "any")
        extra += `&eyes=${this.selectedEyeStyle}`;
      return this._buildUrl(extra);
    },

    generateMouthPreviewUrl(mouthValue) {
      if (!this.isAvataaarsStyle) return "";
      let extra = "";
      if (mouthValue !== "any") extra += `&mouth=${mouthValue}`;
      if (this.selectedTopStyle !== "any")
        extra += `&top=${this.selectedTopStyle}`;
      if (this.selectedEyeStyle !== "any")
        extra += `&eyes=${this.selectedEyeStyle}`;
      return this._buildUrl(extra);
    },

    generateFacialHairPreviewUrl(facialHairValue) {
      if (!this.isAvataaarsStyle) return "";
      let extra = "";
      if (facialHairValue !== "none") {
        extra += `&facialHair=${facialHairValue}&facialHairProbability=100`;
        extra += `&facialHairColor=${this.selectedFacialHairColor}`;
      }
      if (this.selectedTopStyle !== "any")
        extra += `&top=${this.selectedTopStyle}`;
      if (this.selectedEyeStyle !== "any")
        extra += `&eyes=${this.selectedEyeStyle}`;
      if (this.selectedMouthStyle !== "any")
        extra += `&mouth=${this.selectedMouthStyle}`;
      return this._buildUrl(extra);
    },

    generateAccessoryPreviewUrl(accValue) {
      if (!this.isAvataaarsStyle) return "";
      let extra = "";
      if (accValue !== "none") {
        extra += `&accessories=${accValue}&accessoriesProbability=100`;
        extra += `&accessoriesColor=${this.selectedAccessoriesColor}`;
      }
      if (this.selectedTopStyle !== "any")
        extra += `&top=${this.selectedTopStyle}`;
      if (this.selectedEyeStyle !== "any")
        extra += `&eyes=${this.selectedEyeStyle}`;
      return this._buildUrl(extra);
    },

    generateClothingPreviewUrl(clothValue) {
      if (!this.isAvataaarsStyle) return "";
      let extra = "";
      if (clothValue !== "any") {
        extra += `&clothing=${clothValue}`;
        extra += `&clothesColor=${this.selectedClothesColor}`;
      }
      if (this.selectedTopStyle !== "any")
        extra += `&top=${this.selectedTopStyle}`;
      return this._buildUrl(extra);
    },

    generateClothingGraphicPreviewUrl(graphicValue) {
      if (!this.isAvataaarsStyle) return "";
      let extra = `&clothing=graphicShirt&clothesColor=${this.selectedClothesColor}&clothingGraphic=${graphicValue}`;
      if (this.selectedTopStyle !== "any")
        extra += `&top=${this.selectedTopStyle}`;
      return this._buildUrl(extra);
    },

    generateAvatarStylePreviewUrl(styleValue) {
      if (!this.isAvataaarsStyle) return "";
      let extra = `&style=${styleValue}`;
      if (this.selectedTopStyle !== "any")
        extra += `&top=${this.selectedTopStyle}`;
      if (this.selectedEyeStyle !== "any")
        extra += `&eyes=${this.selectedEyeStyle}`;
      if (this.selectedMouthStyle !== "any")
        extra += `&mouth=${this.selectedMouthStyle}`;
      return this._buildUrl(extra);
    },
  },
};
</script>

<style scoped>
.avataaars-customizer {
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
