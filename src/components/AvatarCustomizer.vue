<template>
  <div class="avatar-customizer">
    <div class="customizer-header">
      <h2><i class="fas fa-user-edit"></i> Personalizar Avatar</h2>
      <p>Personalize seu avatar com as opções abaixo</p>
    </div>

    <!-- Preview do avatar -->
    <div class="avatar-preview-container">
      <div class="avatar-preview">
        <img
          :src="currentAvatarUrl"
          :alt="`Avatar personalizado`"
          class="preview-image"
          :class="{ loading: isLoading }"
        />
        <div v-if="isLoading" class="loading-overlay">
          <div class="spinner"></div>
        </div>
      </div>
      <div class="avatar-url-display">
        <input
          type="text"
          :value="currentAvatarUrl"
          readonly
          class="url-input"
        />
        <button @click="copyToClipboard" class="btn-copy">
          <i class="fas fa-copy"></i> Copiar URL
        </button>
      </div>
    </div>

    <!-- Tabs de personalização -->
    <div class="tabs-container">
      <div class="tabs">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
          class="tab-button"
        >
          <i :class="tab.icon"></i> {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Conteúdo das abas -->
    <div class="tab-content">
      <!-- Aba: Estilo -->
      <div v-show="activeTab === 'style'" class="tab-pane">
        <div class="step-section">
          <h3><i class="fas fa-paint-brush"></i> Estilo do Avatar</h3>
          <div class="style-options">
            <div
              v-for="style in avatarStyles"
              :key="style.value"
              class="style-option"
              :class="{ active: selectedStyle === style.value }"
              @click="selectStyle(style.value)"
            >
              <img
                :src="generatePreviewUrl(style.value)"
                :alt="style.label"
                class="style-preview"
              />
              <span>{{ style.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Aba: Aparência -->
      <div v-show="activeTab === 'appearance'" class="tab-pane">
        <!-- Sexo/Gênero -->
        <div class="step-section">
          <h3><i class="fas fa-venus-mars"></i> Gênero</h3>
          <div class="gender-options">
            <button
              v-for="gender in genderOptions"
              :key="gender.value"
              class="gender-btn"
              :class="{ active: selectedGender === gender.value }"
              @click="selectGender(gender.value)"
            >
              <i :class="gender.icon"></i> {{ gender.label }}
            </button>
          </div>
        </div>

        <!-- Cor de pele -->
        <div class="step-section">
          <h3><i class="fas fa-palette"></i> Cor de Pele</h3>
          <div class="color-options">
            <div
              v-for="color in skinColors"
              :key="color.value"
              class="color-option"
              :class="{ active: selectedSkinColor === color.value }"
              :style="{ backgroundColor: color.value }"
              @click="selectSkinColor(color.value)"
              :title="color.label"
            ></div>
          </div>
        </div>

        <!-- Cor de cabelo -->
        <div class="step-section">
          <h3><i class="fas fa-cut"></i> Cor do Cabelo</h3>
          <div class="color-options">
            <div
              v-for="color in hairColors"
              :key="color.value"
              class="color-option"
              :class="{ active: selectedHairColor === color.value }"
              :style="{ backgroundColor: color.value }"
              @click="selectHairColor(color.value)"
              :title="color.label"
            ></div>
          </div>
        </div>
      </div>

      <!-- Aba: Estilo -->
      <div v-show="activeTab === 'features'" class="tab-pane">
        <!-- Cabelo -->
        <div class="step-section" v-if="showHairOptions">
          <h3><i class="fas fa-cut"></i> Estilo de Cabelo</h3>
          <div class="hair-options">
            <div
              v-for="hair in getHairStylesForCurrentStyle"
              :key="hair.value"
              class="hair-option"
              :class="{ active: selectedHairStyle === hair.value }"
              @click="selectHairStyle(hair.value)"
            >
              <span>{{ hair.label }}</span>
            </div>
          </div>
        </div>

        <!-- Olhos -->
        <div class="step-section" v-if="showEyeOptions">
          <h3><i class="fas fa-eye"></i> Estilo dos Olhos</h3>
          <div class="eye-options">
            <div
              v-for="eye in getEyeStylesForCurrentStyle"
              :key="eye.value"
              class="eye-option"
              :class="{ active: selectedEyeStyle === eye.value }"
              @click="selectEyeStyle(eye.value)"
            >
              <span>{{ eye.label }}</span>
            </div>
          </div>
        </div>

        <!-- Boca -->
        <div class="step-section" v-if="showMouthOptions">
          <h3><i class="fas fa-smile"></i> Estilo da Boca</h3>
          <div class="mouth-options">
            <div
              v-for="mouth in getMouthStylesForCurrentStyle"
              :key="mouth.value"
              class="mouth-option"
              :class="{ active: selectedMouthStyle === mouth.value }"
              @click="selectMouthStyle(mouth.value)"
            >
              <span>{{ mouth.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Aba: Acessórios -->
      <div v-show="activeTab === 'accessories'" class="tab-pane">
        <div class="step-section">
          <h3><i class="fas fa-glasses"></i> Acessórios</h3>
          <div class="accessory-options">
            <div
              v-for="accessory in accessories"
              :key="accessory.value"
              class="accessory-option"
              :class="{ active: selectedAccessories.includes(accessory.value) }"
              @click="toggleAccessory(accessory.value)"
            >
              <span>{{ accessory.label }}</span>
            </div>
          </div>
        </div>

        <!-- Fundo -->
        <div class="step-section">
          <h3><i class="fas fa-fill-drip"></i> Cor de Fundo</h3>
          <div class="color-options">
            <div
              v-for="color in backgroundColors"
              :key="color.value"
              class="color-option"
              :class="{ active: selectedBackgroundColor === color.value }"
              :style="{ backgroundColor: color.value }"
              @click="selectBackgroundColor(color.value)"
              :title="color.label"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botões de ação -->
    <div class="action-buttons">
      <button @click="resetToDefaults" class="btn-reset">
        <i class="fas fa-redo"></i> Resetar
      </button>
      <button @click="downloadAvatar" class="btn-download">
        <i class="fas fa-download"></i> Baixar
      </button>
      <button @click="shareAvatar" class="btn-share">
        <i class="fas fa-share-alt"></i> Compartilhar
      </button>
      <button @click="saveAvatar" class="btn-save">
        <i class="fas fa-save"></i> Salvar Avatar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AvatarCustomizer",
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue", "avatar-saved"],
  data() {
    return {
      // Configurações atuais do avatar
      selectedStyle: "adventurer",
      selectedGender: "neutral",
      selectedSkinColor: "f3d2bd",
      selectedHairColor: "2c1b0f",
      selectedHairStyle: "any",
      selectedEyeStyle: "any",
      selectedMouthStyle: "any",
      selectedAccessories: [],
      selectedBackgroundColor: "d1d4f9",
      isLoading: false,
      activeTab: "style",
      tabs: [
        { id: "style", label: "Estilo", icon: "fas fa-paint-brush" },
        { id: "appearance", label: "Aparência", icon: "fas fa-user" },
        { id: "features", label: "Características", icon: "fas fa-sliders-h" },
        { id: "accessories", label: "Acessórios", icon: "fas fa-gem" },
      ],

      // Opções disponíveis
      avatarStyles: [
        { value: "adventurer", label: "Aventureiro" },
        { value: "avataaars", label: "Avataaars" },
        { value: "lorelei", label: "Lorelei" },
        { value: "micah", label: "Micah" },
        { value: "notionists", label: "Notionists" },
        { value: "open-peeps", label: "Open Peeps" },
        { value: "toonloop", label: "ToonLoop" }, // ToonHead é representado como toonloop na API DiceBear
      ],

      genderOptions: [
        { value: "male", label: "Masculino", icon: "fas fa-mars" },
        { value: "female", label: "Feminino", icon: "fas fa-venus" },
        { value: "neutral", label: "Neutro", icon: "fas fa-genderless" },
      ],

      skinColors: [
        { value: "f3d2bd", label: "Clara" },
        { value: "e0bb95", label: "Média" },
        { value: "cfa162", label: "Morena Claro" },
        { value: "bfa984", label: "Morena" },
        { value: "8b5a3c", label: "Escura" },
        { value: "5e3825", label: "Muito Escura" },
      ],

      hairColors: [
        { value: "2c1b0f", label: "Preto" },
        { value: "3d2b1f", label: "Castanho Escuro" },
        { value: "7a5c46", label: "Castanho" },
        { value: "b58143", label: "Loiro Escuro" },
        { value: "eac0a9", label: "Loiro Claro" },
        { value: "d3d3d3", label: "Cinza" },
        { value: "ffffff", label: "Branco" },
        { value: "ff0000", label: "Vermelho" },
        { value: "800080", label: "Roxo" },
        { value: "0000ff", label: "Azul" },
        { value: "008000", label: "Verde" },
        { value: "ffff00", label: "Amarelo" },
      ],

      accessories: [
        { value: "eyewear", label: "Óculos" },
        { value: "glasses", label: "Óculos de Sol" },
        { value: "hat", label: "Chapéu" },
        { value: "headband", label: "Tiara" },
        { value: "earrings", label: "Brincos" },
        { value: "mask", label: "Máscara" },
      ],

      // Estilos de cabelo específicos para cada tipo de avatar
      hairStyles: {
        adventurer: [
          { value: "any", label: "Qualquer um" },
          { value: "long", label: "Longo" },
          { value: "short", label: "Curto" },
          { value: "bald", label: "Careca" },
          { value: "curly", label: "Cacheado" },
          { value: "straight", label: "Liso" },
          { value: "afro", label: "Afro" },
          { value: "bobcut", label: "Bob Cut" },
          { value: "pixie", label: "Pixie" },
        ],
        avataaars: [
          { value: "any", label: "Qualquer um" },
          { value: "big-hair", label: "Cabelo Grande" },
          { value: "bob", label: "Bob" },
          { value: "bun", label: "Coque" },
          { value: "curly", label: "Cacheado" },
          { value: "curvy", label: "Ondulado" },
          { value: "dreads", label: "Tranças" },
          { value: "frizzle", label: "Frizz" },
          { value: "fro", label: "Afro" },
          { value: "fro-beard", label: "Afro com Barba" },
          { value: "hat", label: "Chapéu" },
          { value: "hoodie", label: "Capuz" },
          { value: "long-bun", label: "Coque Longo" },
          { value: "long-hair", label: "Cabelo Longo" },
          { value: "messy", label: "Bagunçado" },
          { value: "shaggy", label: "Desgrenhado" },
          { value: "shaved-sides", label: "Laterais Rapadas" },
          { value: "short-curly", label: "Cabelo Curto Cacheado" },
          { value: "short-hair", label: "Cabelo Curto" },
          { value: "short-waved", label: "Cabelo Curto Ondulado" },
          { value: "sides", label: "Laterais" },
          { value: "straight", label: "Liso" },
          { value: "straight-and-straight", label: "Liso e Reto" },
          { value: "the-hustle", label: "The Hustle" },
          { value: "vampire", label: "Vampiro" },
        ],
        lorelei: [
          { value: "any", label: "Qualquer um" },
          { value: "bangs", label: "Franja" },
          { value: "braided", label: "Trançado" },
          { value: "curly", label: "Cacheado" },
          { value: "flowing", label: "Fluido" },
          { value: "long", label: "Longo" },
          { value: "medium", label: "Médio" },
          { value: "pixie", label: "Pixie" },
          { value: "short", label: "Curto" },
          { value: "wavy", label: "Ondulado" },
        ],
        micah: [
          { value: "any", label: "Qualquer um" },
          { value: "bangs", label: "Franja" },
          { value: "braids", label: "Tranças" },
          { value: "curly", label: "Cacheado" },
          { value: "flowing", label: "Fluido" },
          { value: "long", label: "Longo" },
          { value: "medium", label: "Médio" },
          { value: "pixie", label: "Pixie" },
          { value: "short", label: "Curto" },
          { value: "wavy", label: "Ondulado" },
        ],
        notionists: [
          { value: "any", label: "Qualquer um" },
          { value: "bangs", label: "Franja" },
          { value: "braided", label: "Trançado" },
          { value: "curly", label: "Cacheado" },
          { value: "flowing", label: "Fluido" },
          { value: "long", label: "Longo" },
          { value: "medium", label: "Médio" },
          { value: "pixie", label: "Pixie" },
          { value: "short", label: "Curto" },
          { value: "wavy", label: "Ondulado" },
        ],
        openPeeps: [
          { value: "any", label: "Qualquer um" },
          { value: "bangs", label: "Franja" },
          { value: "braided", label: "Trançado" },
          { value: "curly", label: "Cacheado" },
          { value: "flowing", label: "Fluido" },
          { value: "long", label: "Longo" },
          { value: "medium", label: "Médio" },
          { value: "pixie", label: "Pixie" },
          { value: "short", label: "Curto" },
          { value: "wavy", label: "Ondulado" },
        ],
        toonloop: [
          { value: "any", label: "Qualquer um" },
          { value: "bangs", label: "Franja" },
          { value: "braided", label: "Trançado" },
          { value: "curly", label: "Cacheado" },
          { value: "flowing", label: "Fluido" },
          { value: "long", label: "Longo" },
          { value: "medium", label: "Médio" },
          { value: "pixie", label: "Pixie" },
          { value: "short", label: "Curto" },
          { value: "wavy", label: "Ondulado" },
        ],
      },

      // Estilos de olhos específicos para cada tipo de avatar
      eyeStyles: {
        adventurer: [
          { value: "any", label: "Qualquer um" },
          { value: "variant01", label: "Variante 1" },
          { value: "variant02", label: "Variante 2" },
          { value: "variant03", label: "Variante 3" },
          { value: "variant04", label: "Variante 4" },
          { value: "variant05", label: "Variante 5" },
          { value: "happy", label: "Feliz" },
          { value: "hearts", label: "Corações" },
          { value: "squint", label: "Semi-cerrado" },
          { value: "winkWacky", label: "Piscando Loucamente" },
        ],
        avataaars: [
          { value: "any", label: "Qualquer um" },
          { value: "close", label: "Fechado" },
          { value: "cry", label: "Chorando" },
          { value: "default", label: "Padrão" },
          { value: "dizzy", label: "Tonto" },
          { value: "eyeRoll", label: "Olhar Revirado" },
          { value: "happy", label: "Feliz" },
          { value: "hearts", label: "Corações" },
          { value: "side", label: "Lado" },
          { value: "squint", label: "Semi-cerrado" },
          { value: "surprised", label: "Surpreso" },
          { value: "wink", label: "Piscando" },
          { value: "winkWacky", label: "Piscando Loucamente" },
        ],
        lorelei: [
          { value: "any", label: "Qualquer um" },
          { value: "closed", label: "Fechado" },
          { value: "default", label: "Padrão" },
          { value: "dizzy", label: "Tonto" },
          { value: "eyeRoll", label: "Olhar Revirado" },
          { value: "happy", label: "Feliz" },
          { value: "hearts", label: "Corações" },
          { value: "side", label: "Lado" },
          { value: "squint", label: "Semi-cerrado" },
          { value: "surprised", label: "Surpreso" },
          { value: "wink", label: "Piscando" },
        ],
        micah: [
          { value: "any", label: "Qualquer um" },
          { value: "closed", label: "Fechado" },
          { value: "default", label: "Padrão" },
          { value: "dizzy", label: "Tonto" },
          { value: "eyeRoll", label: "Olhar Revirado" },
          { value: "happy", label: "Feliz" },
          { value: "hearts", label: "Corações" },
          { value: "side", label: "Lado" },
          { value: "squint", label: "Semi-cerrado" },
          { value: "surprised", label: "Surpreso" },
          { value: "wink", label: "Piscando" },
        ],
        notionists: [
          { value: "any", label: "Qualquer um" },
          { value: "closed", label: "Fechado" },
          { value: "default", label: "Padrão" },
          { value: "dizzy", label: "Tonto" },
          { value: "eyeRoll", label: "Olhar Revirado" },
          { value: "happy", label: "Feliz" },
          { value: "hearts", label: "Corações" },
          { value: "side", label: "Lado" },
          { value: "squint", label: "Semi-cerrado" },
          { value: "surprised", label: "Surpreso" },
          { value: "wink", label: "Piscando" },
        ],
        openPeeps: [
          { value: "any", label: "Qualquer um" },
          { value: "closed", label: "Fechado" },
          { value: "default", label: "Padrão" },
          { value: "dizzy", label: "Tonto" },
          { value: "eyeRoll", label: "Olhar Revirado" },
          { value: "happy", label: "Feliz" },
          { value: "hearts", label: "Corações" },
          { value: "side", label: "Lado" },
          { value: "squint", label: "Semi-cerrado" },
          { value: "surprised", label: "Surpreso" },
          { value: "wink", label: "Piscando" },
        ],
        toonloop: [
          { value: "any", label: "Qualquer um" },
          { value: "closed", label: "Fechado" },
          { value: "default", label: "Padrão" },
          { value: "dizzy", label: "Tonto" },
          { value: "eyeRoll", label: "Olhar Revirado" },
          { value: "happy", label: "Feliz" },
          { value: "hearts", label: "Corações" },
          { value: "side", label: "Lado" },
          { value: "squint", label: "Semi-cerrado" },
          { value: "surprised", label: "Surpreso" },
          { value: "wink", label: "Piscando" },
        ],
      },

      // Estilos de boca específicos para cada tipo de avatar
      mouthStyles: {
        adventurer: [
          { value: "any", label: "Qualquer uma" },
          { value: "variant01", label: "Variante 1" },
          { value: "variant02", label: "Variante 2" },
          { value: "variant03", label: "Variante 3" },
          { value: "variant04", label: "Variante 4" },
          { value: "variant05", label: "Variante 5" },
          { value: "concerned", label: "Preocupado" },
          { value: "default", label: "Padrão" },
          { value: "eating", label: "Comendo" },
          { value: "gulp", label: "Engolindo" },
          { value: "lol", label: "Rindo" },
          { value: "relaxed", label: "Relaxado" },
          { value: "sad", label: "Triste" },
          { value: "smile", label: "Sorrindo" },
        ],
        avataaars: [
          { value: "any", label: "Qualquer uma" },
          { value: "concerned", label: "Preocupado" },
          { value: "default", label: "Padrão" },
          { value: "disbelief", label: "Incrédulo" },
          { value: "eating", label: "Comendo" },
          { value: "grimace", label: "Careta" },
          { value: "sad", label: "Triste" },
          { value: "screamOpen", label: "Grito Aberto" },
          { value: "serious", label: "Sério" },
          { value: "smile", label: "Sorrindo" },
          { value: "tongue", label: "Língua" },
          { value: "twinkle", label: "Brilho" },
        ],
        lorelei: [
          { value: "any", label: "Qualquer uma" },
          { value: "concerned", label: "Preocupado" },
          { value: "default", label: "Padrão" },
          { value: "disbelief", label: "Incrédulo" },
          { value: "eating", label: "Comendo" },
          { value: "grimace", label: "Careta" },
          { value: "sad", label: "Triste" },
          { value: "screamOpen", label: "Grito Aberto" },
          { value: "serious", label: "Sério" },
          { value: "smile", label: "Sorrindo" },
          { value: "tongue", label: "Língua" },
          { value: "twinkle", label: "Brilho" },
        ],
        micah: [
          { value: "any", label: "Qualquer uma" },
          { value: "concerned", label: "Preocupado" },
          { value: "default", label: "Padrão" },
          { value: "disbelief", label: "Incrédulo" },
          { value: "eating", label: "Comendo" },
          { value: "grimace", label: "Careta" },
          { value: "sad", label: "Triste" },
          { value: "screamOpen", label: "Grito Aberto" },
          { value: "serious", label: "Sério" },
          { value: "smile", label: "Sorrindo" },
          { value: "tongue", label: "Língua" },
          { value: "twinkle", label: "Brilho" },
        ],
        notionists: [
          { value: "any", label: "Qualquer uma" },
          { value: "concerned", label: "Preocupado" },
          { value: "default", label: "Padrão" },
          { value: "disbelief", label: "Incrédulo" },
          { value: "eating", label: "Comendo" },
          { value: "grimace", label: "Careta" },
          { value: "sad", label: "Triste" },
          { value: "screamOpen", label: "Grito Aberto" },
          { value: "serious", label: "Sério" },
          { value: "smile", label: "Sorrindo" },
          { value: "tongue", label: "Língua" },
          { value: "twinkle", label: "Brilho" },
        ],
        openPeeps: [
          { value: "any", label: "Qualquer uma" },
          { value: "concerned", label: "Preocupado" },
          { value: "default", label: "Padrão" },
          { value: "disbelief", label: "Incrédulo" },
          { value: "eating", label: "Comendo" },
          { value: "grimace", label: "Careta" },
          { value: "sad", label: "Triste" },
          { value: "screamOpen", label: "Grito Aberto" },
          { value: "serious", label: "Sério" },
          { value: "smile", label: "Sorrindo" },
          { value: "tongue", label: "Língua" },
          { value: "twinkle", label: "Brilho" },
        ],
        toonloop: [
          { value: "any", label: "Qualquer uma" },
          { value: "concerned", label: "Preocupado" },
          { value: "default", label: "Padrão" },
          { value: "disbelief", label: "Incrédulo" },
          { value: "eating", label: "Comendo" },
          { value: "grimace", label: "Careta" },
          { value: "sad", label: "Triste" },
          { value: "screamOpen", label: "Grito Aberto" },
          { value: "serious", label: "Sério" },
          { value: "smile", label: "Sorrindo" },
          { value: "tongue", label: "Língua" },
          { value: "twinkle", label: "Brilho" },
        ],
      },

      backgroundColors: [
        { value: "d1d4f9", label: "Azul Claro" },
        { value: "b6e3f4", label: "Azul Céu" },
        { value: "c0aede", label: "Roxo Claro" },
        { value: "f093fb", label: "Rosa" },
        { value: "f5576c", label: "Vermelho Claro" },
        { value: "4facfe", label: "Azul Brilhante" },
        { value: "00f2fe", label: "Ciano" },
        { value: "43e97b", label: "Verde Claro" },
        { value: "38f9d7", label: "Verde Água" },
        { value: "fa709a", label: "Laranja Rosa" },
        { value: "fee140", label: "Amarelo" },
        { value: "ffffff", label: "Branco" },
        { value: "000000", label: "Preto" },
      ],
    };
  },
  computed: {
    currentAvatarUrl() {
      // Gerar URL do avatar com base nas opções selecionadas
      const baseUrl = `https://api.dicebear.com/9.x/${this.selectedStyle}/svg`;

      // Parâmetros da URL
      const params = new URLSearchParams();
      params.append("seed", this.userId); // Usar ID do usuário como seed

      // Adicionar parâmetros com base nas opções selecionadas
      if (this.selectedGender !== "neutral") {
        params.append("face", this.selectedGender);
      }

      params.append("backgroundColor", this.selectedBackgroundColor);
      params.append("skinColor", this.selectedSkinColor);
      params.append("hairColor", this.selectedHairColor);
      params.append("radius", "50");
      params.append("size", "256");

      // Adicionar acessórios se selecionados
      if (this.selectedAccessories.length > 0) {
        params.append("accessories", this.selectedAccessories.join(","));
      }

      // Adicionar mais opções de personalização baseadas no estilo
      if (this.selectedStyle === "adventurer") {
        if (this.selectedHairStyle !== "any") {
          params.append("hair", this.selectedHairStyle);
        }
        if (this.selectedEyeStyle !== "any") {
          params.append("eyes", this.selectedEyeStyle);
        }
        if (this.selectedMouthStyle !== "any") {
          params.append("mouth", this.selectedMouthStyle);
        }
      } else if (this.selectedStyle === "avataaars") {
        if (this.selectedHairStyle !== "any") {
          params.append("top", this.selectedHairStyle);
        }
        if (this.selectedEyeStyle !== "any") {
          params.append("eyes", this.selectedEyeStyle);
        }
        if (this.selectedMouthStyle !== "any") {
          params.append("mouth", this.selectedMouthStyle);
        }
      } else if (this.selectedStyle === "lorelei") {
        if (this.selectedHairStyle !== "any") {
          params.append("hair", this.selectedHairStyle);
        }
        if (this.selectedEyeStyle !== "any") {
          params.append("eyes", this.selectedEyeStyle);
        }
        if (this.selectedMouthStyle !== "any") {
          params.append("mouth", this.selectedMouthStyle);
        }
      } else if (this.selectedStyle === "micah") {
        if (this.selectedHairStyle !== "any") {
          params.append("hair", this.selectedHairStyle);
        }
        if (this.selectedEyeStyle !== "any") {
          params.append("eyes", this.selectedEyeStyle);
        }
        if (this.selectedMouthStyle !== "any") {
          params.append("mouth", this.selectedMouthStyle);
        }
      } else if (this.selectedStyle === "notionists") {
        if (this.selectedHairStyle !== "any") {
          params.append("top", this.selectedHairStyle);
        }
        if (this.selectedEyeStyle !== "any") {
          params.append("eyes", this.selectedEyeStyle);
        }
        if (this.selectedMouthStyle !== "any") {
          params.append("mouth", this.selectedMouthStyle);
        }
      } else if (this.selectedStyle === "open-peeps") {
        if (this.selectedHairStyle !== "any") {
          params.append("top", this.selectedHairStyle);
        }
        if (this.selectedEyeStyle !== "any") {
          params.append("eyes", this.selectedEyeStyle);
        }
        if (this.selectedMouthStyle !== "any") {
          params.append("mouth", this.selectedMouthStyle);
        }
      } else if (this.selectedStyle === "toonloop") {
        if (this.selectedHairStyle !== "any") {
          params.append("top", this.selectedHairStyle);
        }
        if (this.selectedEyeStyle !== "any") {
          params.append("eyes", this.selectedEyeStyle);
        }
        if (this.selectedMouthStyle !== "any") {
          params.append("mouth", this.selectedMouthStyle);
        }
      }

      return `${baseUrl}?${params.toString()}`;
    },

    showHairOptions() {
      return [
        "adventurer",
        "avataaars",
        "lorelei",
        "micah",
        "notionists",
        "open-peeps",
        "toonloop",
      ].includes(this.selectedStyle);
    },

    showEyeOptions() {
      return [
        "adventurer",
        "avataaars",
        "lorelei",
        "micah",
        "notionists",
        "open-peeps",
        "toonloop",
      ].includes(this.selectedStyle);
    },

    showMouthOptions() {
      return [
        "adventurer",
        "avataaars",
        "lorelei",
        "micah",
        "notionists",
        "open-peeps",
        "toonloop",
      ].includes(this.selectedStyle);
    },

    getHairStylesForCurrentStyle() {
      return this.hairStyles[this.selectedStyle] || this.hairStyles.adventurer;
    },

    getEyeStylesForCurrentStyle() {
      return this.eyeStyles[this.selectedStyle] || this.eyeStyles.adventurer;
    },

    getMouthStylesForCurrentStyle() {
      return (
        this.mouthStyles[this.selectedStyle] || this.mouthStyles.adventurer
      );
    },
  },
  methods: {
    generatePreviewUrl(style) {
      // Gerar URL de preview para estilos
      const baseUrl = `https://api.dicebear.com/9.x/${style}/svg`;
      const params = new URLSearchParams();
      params.append("seed", "preview");
      params.append("backgroundColor", "d1d4f9");
      params.append("radius", "50");
      params.append("size", "64");

      // Adicionar parâmetros específicos para cada estilo para melhor preview
      if (
        style === "avataaars" ||
        style === "notionists" ||
        style === "open-peeps" ||
        style === "toonloop"
      ) {
        params.append("top", "shortHair");
        params.append("eyes", "default");
        params.append("mouth", "smile");
      } else if (style === "lorelei") {
        params.append("hair", "flowing");
        params.append("eyes", "default");
        params.append("mouth", "smile");
      } else if (style === "micah") {
        params.append("hair", "medium");
        params.append("eyes", "default");
        params.append("mouth", "smile");
      }

      return `${baseUrl}?${params.toString()}`;
    },

    selectStyle(style) {
      this.selectedStyle = style;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },

    selectGender(gender) {
      this.selectedGender = gender;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },

    selectSkinColor(color) {
      this.selectedSkinColor = color;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },

    selectHairColor(color) {
      this.selectedHairColor = color;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },

    toggleAccessory(accessory) {
      const index = this.selectedAccessories.indexOf(accessory);
      if (index > -1) {
        // Remover acessório
        this.selectedAccessories.splice(index, 1);
      } else {
        // Adicionar acessório
        this.selectedAccessories.push(accessory);
      }
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },

    selectBackgroundColor(color) {
      this.selectedBackgroundColor = color;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },

    selectHairStyle(style) {
      this.selectedHairStyle = style;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },

    selectEyeStyle(style) {
      this.selectedEyeStyle = style;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },

    selectMouthStyle(style) {
      this.selectedMouthStyle = style;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },

    resetToDefaults() {
      this.isLoading = true;
      this.selectedStyle = "adventurer";
      this.selectedGender = "neutral";
      this.selectedSkinColor = "f3d2bd";
      this.selectedHairColor = "2c1b0f";
      this.selectedHairStyle = "any";
      this.selectedEyeStyle = "any";
      this.selectedMouthStyle = "any";
      this.selectedAccessories = [];
      this.selectedBackgroundColor = "d1d4f9";

      // Garantir que as opções sejam atualizadas após o reset
      this.$nextTick(() => {
        // Forçar atualização das opções
        this.selectedHairStyle = "any";
        this.selectedEyeStyle = "any";
        this.selectedMouthStyle = "any";
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      });
    },

    copyToClipboard() {
      this.isLoading = true;
      navigator.clipboard
        .writeText(this.currentAvatarUrl)
        .then(() => {
          // Mostrar feedback de sucesso
          this.showToast("URL copiada para a área de transferência!");
        })
        .catch((err) => {
          console.error("Erro ao copiar URL:", err);
          this.showToast("Erro ao copiar URL!", "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    },

    saveAvatar() {
      this.isLoading = true;
      // Emitir evento com a URL do avatar personalizado
      this.$emit("update:modelValue", this.currentAvatarUrl);
      this.$emit("avatar-saved", {
        avatarUrl: this.currentAvatarUrl,
        userId: this.userId,
        customization: {
          style: this.selectedStyle,
          gender: this.selectedGender,
          skinColor: this.selectedSkinColor,
          hairColor: this.selectedHairColor,
          accessories: this.selectedAccessories,
          backgroundColor: this.selectedBackgroundColor,
        },
      });

      this.showToast("Avatar salvo com sucesso!");
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },

    showToast(message, type = "success") {
      // Criar toast simples se não existir
      if (!this.$toast) {
        // Simular toast se não estiver disponível
        console.log(message);
        return;
      }

      if (type === "success") {
        this.$toast.success(message);
      } else {
        this.$toast.error(message);
      }
    },

    async shareAvatar() {
      this.isLoading = true;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Meu Avatar Personalizado",
            text: "Confira meu avatar personalizado!",
            url: this.currentAvatarUrl,
          });
        } catch (error) {
          console.log("Erro ao compartilhar:", error);
          // Fallback para copiar a URL
          this.copyToClipboard();
          this.showToast("Link copiado! Compartilhe manualmente.", "info");
        }
      } else {
        // Fallback para copiar a URL
        this.copyToClipboard();
        this.showToast("Link copiado! Cole e compartilhe!", "info");
      }

      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },

    async downloadAvatar() {
      this.isLoading = true;

      try {
        const response = await fetch(this.currentAvatarUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `avatar-${this.userId}.svg`;
        document.body.appendChild(link);
        link.click();

        // Limpar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.showToast("Avatar baixado com sucesso!", "success");
      } catch (error) {
        console.error("Erro ao baixar avatar:", error);
        this.showToast("Erro ao baixar avatar", "error");
      }

      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },
  },

  mounted() {
    // Se já houver um avatar personalizado, carregar as configurações correspondentes
    if (this.modelValue) {
      // Aqui poderíamos tentar extrair as configurações da URL existente
      // Por simplicidade, vamos manter as configurações padrão
    }

    // Garantir que a aba ativa seja a primeira por padrão
    this.activeTab = "style";
  },
};
</script>

<style scoped>
.avatar-customizer {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.customizer-header {
  text-align: center;
  margin-bottom: 30px;
}

.customizer-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.8rem;
}

.customizer-header p {
  color: #7f8c8d;
  font-size: 1rem;
}

.avatar-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  gap: 15px;
}

.avatar-preview {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #e9ecef;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.avatar-preview:hover {
  transform: scale(1.05);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-url-display {
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 500px;
}

.url-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #f8f9fa;
  overflow-x: auto;
  white-space: nowrap;
}

.btn-copy {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s ease;
  flex-shrink: 0;
}

.btn-copy:hover {
  background: #5a6fd8;
}

.customization-steps {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.step-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.step-section:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.step-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
}

.style-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
}

.style-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.style-option:hover {
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.style-option.active {
  border-color: #667eea;
  background: #f8f9ff;
  position: relative;
}

.style-option.active::after {
  content: "✓";
  position: absolute;
  top: -8px;
  right: -8px;
  background: #27ae60;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.style-preview {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}

.gender-options {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.gender-btn {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  min-width: 120px;
  font-weight: 500;
}

.gender-btn:hover {
  border-color: #667eea;
  background: #f8f9fa;
}

.gender-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
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

.color-option:hover {
  transform: scale(1.1);
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.color-option.active {
  border-color: #2c3e50;
  box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.3);
  position: relative;
}

.color-option.active::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}

.accessory-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.accessory-option {
  padding: 8px 16px;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  font-size: 0.9rem;
}

.accessory-option:hover {
  border-color: #667eea;
  background: #f8f9fa;
}

.accessory-option.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.btn-reset,
.btn-download,
.btn-share,
.btn-save {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 150px;
  justify-content: center;
}

.btn-reset {
  background: #e9ecef;
  color: #495057;
}

.btn-reset:hover {
  background: #dee2e6;
}

.btn-share {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  color: white;
}

.btn-share:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 154, 158, 0.3);
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

/* Responsividade para dispositivos móveis */
@media (max-width: 768px) {
  .avatar-customizer {
    padding: 10px;
  }

  .customizer-header h2 {
    font-size: 1.3rem;
  }

  .avatar-preview {
    width: 120px;
    height: 120px;
  }

  .avatar-url-display {
    flex-direction: column;
    display: none;
  }

  .btn-copy {
    align-self: stretch;
  }

  .style-options {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .style-preview {
    width: 50px;
    height: 50px;
  }

  .gender-options {
    flex-direction: row;
    gap: 8px;
    flex-wrap: wrap;
  }

  .gender-btn {
    min-width: auto;
    padding: 10px 14px;
    font-size: 0.85rem;
  }

  .color-options {
    gap: 8px;
  }

  .color-option {
    width: 44px;
    height: 44px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-reset,
  .btn-save {
    width: 100%;
    justify-content: center;
    padding: 14px;
    border-radius: 12px;
  }

  .step-section {
    padding: 12px;
  }

  .step-section h3 {
    font-size: 0.95rem;
  }
}

@media (max-width: 400px) {
  .avatar-preview {
    width: 100px;
    height: 100px;
  }

  .style-options {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .style-preview {
    width: 44px;
    height: 44px;
  }

  .customizer-header h2 {
    font-size: 1.1rem;
  }
}

.tabs-container {
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  gap: 5px;
  background: #f8f9fa;
  padding: 5px;
  border-radius: 10px;
  overflow-x: auto;
}

.tab-button {
  flex: 1;
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 120px;
  white-space: nowrap;
}

.tab-button:hover {
  background: #e9ecef;
}

.tab-button.active {
  background: #667eea;
  color: white;
}

.tab-content {
  min-height: 300px;
}

.tab-pane {
  padding: 10px 0;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.preview-image.loading {
  opacity: 0.3;
}
</style>
