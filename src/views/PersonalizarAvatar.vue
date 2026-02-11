<template>
  <div class="avatar-customizer-page">
    <div class="page-header">
      <button @click="goBack" class="btn-back">
        <i class="fas fa-arrow-left"></i> Voltar
      </button>
      <h1>Personalizar Avatar</h1>
    </div>

    <div class="avatar-customizer">
      <div class="customizer-header">
        <h2><i class="fas fa-user-edit"></i> Personalize seu avatar</h2>
        <p>Personalize seu avatar com as opções abaixo</p>
      </div>

      <!-- Preview do avatar -->
      <div class="avatar-preview-container">
        <div
          class="avatar-preview"
          :style="{ backgroundColor: '#' + selectedBackgroundColor }"
        >
          <img
            :src="currentAvatarUrl"
            :alt="`Avatar personalizado`"
            class="preview-image"
          />
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

      <!-- Sistema de abas para personalização -->
      <div class="tabs-container">
        <div class="tabs-header">
          <button
            v-for="tab in activeTabs"
            :key="tab.id"
            class="tab-button"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon"></i> {{ tab.title }}
          </button>
        </div>

        <div class="tab-content">
          <!-- Aba: Estilo -->
          <div v-if="activeTab === 'estilo'" class="tab-pane">
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

          <!-- Aba: Fundo (disponível para todos os estilos) -->
          <div v-if="activeTab === 'background'" class="tab-pane">
            <h3><i class="fas fa-fill-drip"></i> Cor de Fundo</h3>
            <div class="background-preview-container">
              <div
                v-for="color in backgroundColors"
                :key="color.value"
                class="background-preview-item"
                :class="{ active: selectedBackgroundColor === color.value }"
                @click="selectBackgroundColor(color.value)"
              >
                <div
                  class="avatar-preview-with-bg"
                  :style="{ backgroundColor: '#' + color.value }"
                >
                  <img
                    :src="generatePreviewUrl(selectedStyle, color.value)"
                    :alt="`Avatar com fundo ${color.label}`"
                    class="preview-image"
                  />
                </div>
                <span class="bg-label">{{ color.label }}</span>
              </div>
            </div>
          </div>

          <!-- Aba: Brincos (apenas para estilo aventureiro) -->
          <div
            v-if="selectedStyle === 'adventurer' && activeTab === 'brincos'"
            class="tab-pane"
          >
            <h3><i class="fas fa-gem"></i> Brincos</h3>
            <div class="earring-preview-container">
              <div
                v-for="earring in earringVariants"
                :key="earring.value"
                class="earring-preview-item"
                :class="{ active: selectedEarringVariant === earring.value }"
                @click="selectEarringVariant(earring.value)"
              >
                <div class="avatar-preview-with-earring">
                  <img
                    :src="generateEarringPreviewUrl(earring.value)"
                    :alt="`Avatar com ${earring.label.toLowerCase()}`"
                    class="preview-image"
                  />
                </div>
                <span class="earring-label">{{ earring.label }}</span>
              </div>
              <div
                class="earring-preview-item"
                :class="{ active: !selectedEarringVariant }"
                @click="selectEarringVariant(null)"
              >
                <div class="avatar-preview-with-earring">
                  <img
                    :src="generateEarringPreviewUrl(null)"
                    alt="Avatar sem brincos"
                    class="preview-image"
                  />
                </div>
                <span class="earring-label">Nenhum</span>
              </div>
            </div>
          </div>

          <!-- Aba: Sobrancelhas (apenas para estilo aventureiro) -->
          <div
            v-if="
              selectedStyle === 'adventurer' && activeTab === 'sobrancelhas'
            "
            class="tab-pane"
          >
            <h3><i class="fas fa-low-vision"></i> Estilo das Sobrancelhas</h3>
            <div class="brow-preview-container">
              <div
                v-for="brow in eyebrowVariants"
                :key="brow.value"
                class="brow-preview-item"
                :class="{ active: selectedBrowStyle === brow.value }"
                @click="selectBrowStyle(brow.value)"
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

          <!-- Aba: Olhos (disponível para estilo aventureiro) -->
          <div
            v-if="selectedStyle === 'adventurer' && activeTab === 'olhos'"
            class="tab-pane"
          >
            <h3><i class="fas fa-eye"></i> Estilo dos Olhos</h3>
            <div class="eye-preview-container">
              <div
                v-for="eye in eyeStyles"
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

          <!-- Aba: Acessórios (para estilo aventureiro) -->
          <div
            v-if="selectedStyle === 'adventurer' && activeTab === 'recursos'"
            class="tab-pane"
          >
            <h3><i class="fas fa-star"></i> Acessórios</h3>

            <!-- Categoria: Óculos -->
            <div class="accessory-category">
              <h4><i class="fas fa-glasses"></i> Óculos</h4>
              <div class="glasses-preview-container">
                <div
                  v-for="glasses in glassesVariants"
                  :key="glasses.value"
                  class="glasses-preview-item"
                  :class="{ active: selectedGlassesVariant === glasses.value }"
                  @click="selectGlassesVariant(glasses.value)"
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

            <!-- Categoria: Features (Recursos faciais) -->
            <div class="accessory-category">
              <h4><i class="fas fa-smile"></i> Recursos Faciais</h4>
              <div class="features-preview-container">
                <div
                  v-for="feature in faceFeaturesExtended"
                  :key="feature.value"
                  class="feature-preview-item"
                  :class="{ active: selectedFaceFeature === feature.value }"
                  @click="selectFaceFeature(feature.value)"
                  :title="feature.label"
                >
                  <div class="avatar-preview-with-feature">
                    <img
                      :src="generateFeaturePreviewUrl(feature.value)"
                      :alt="`Avatar com ${feature.label.toLowerCase()}`"
                      class="preview-image"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Categoria: Brincos -->
            <div class="accessory-category">
              <h4><i class="fas fa-gem"></i> Brincos</h4>
              <div class="earrings-preview-container">
                <div
                  v-for="earrings in earringVariantsExtended"
                  :key="earrings.value"
                  class="earrings-preview-item"
                  :class="{ active: selectedEarringVariant === earrings.value }"
                  @click="selectEarringVariant(earrings.value)"
                  :title="earrings.label"
                >
                  <div class="avatar-preview-with-earrings">
                    <img
                      :src="generateEarringsPreviewUrl(earrings.value)"
                      :alt="`Avatar com ${earrings.label.toLowerCase()}`"
                      class="preview-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Aba: Óculos (disponível para estilo aventureiro) -->
          <div
            v-if="selectedStyle === 'adventurer' && activeTab === 'oculos'"
            class="tab-pane"
          >
            <h3><i class="fas fa-glasses"></i> Estilo dos Óculos</h3>
            <div class="glasses-options">
              <div
                v-for="glasses in glassesStyles"
                :key="glasses.value"
                class="glasses-option"
                :class="{ active: selectedGlassesStyle === glasses.value }"
                @click="selectGlassesStyle(glasses.value)"
              >
                <span>{{ glasses.label }}</span>
              </div>
            </div>
          </div>

          <!-- Aba: Cabelo (disponível para estilo aventureiro) -->
          <div
            v-if="selectedStyle === 'adventurer' && activeTab === 'cabelo'"
            class="tab-pane"
          >
            <h3><i class="fas fa-cut"></i> Estilo de Cabelo</h3>

            <!-- Seleção de cor do cabelo -->
            <div class="color-section">
              <h4><i class="fas fa-palette"></i> Cor do Cabelo</h4>
              <div class="color-options">
                <div
                  v-for="color in hairColors"
                  :key="color.value"
                  class="color-option"
                  :class="{ active: selectedHairColor === color.value }"
                  :style="{ backgroundColor: '#' + color.value }"
                  @click="selectHairColor(color.value)"
                  :title="color.label"
                ></div>
                <!-- Seletor de cor personalizado -->
                <div class="custom-color-picker">
                  <input
                    type="color"
                    id="hairColorPicker"
                    :value="'#' + selectedHairColor"
                    @input="selectCustomHairColor"
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
                @click="selectHairStyle(hair.value)"
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


          <!-- Aba: Boca (disponível para estilo aventureiro) -->
          <div
            v-if="selectedStyle === 'adventurer' && activeTab === 'boca'"
            class="tab-pane"
          >
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

          <!-- Aba: Cor da Pele (disponível para estilo aventureiro) -->
          <div
            v-if="selectedStyle === 'adventurer' && activeTab === 'cor_pele'"
            class="tab-pane"
          >
            <h3><i class="fas fa-tint"></i> Cor da Pele</h3>
            <div class="color-section">
              <div class="color-options">
                <div
                  v-for="color in skinColors"
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
        </div>
      </div>

      <!-- Botões de ação -->
      <div class="action-buttons">
        <button @click="resetToDefaults" class="btn-reset">
          <i class="fas fa-redo"></i> Resetar
        </button>
        <button @click="saveAvatar" class="btn-save">
          <i class="fas fa-save"></i> Salvar Avatar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserSessionStore } from "@/store/userSessionStore.js";
import { useRouter } from "vue-router";

export default {
  name: "PersonalizarAvatar",
  props: {
    userId: {
      type: String,
      default: null,
    },
  },
  setup() {
    const userSessionStore = useUserSessionStore();
    const router = useRouter();
    return { userSessionStore, router };
  },
  data() {
    return {
      // Configurações visuais padrão para cada estilo
      defaultVisualSettings: {
        adventurer: {
          skinColor: "f3d2bd",
          hairColor: "2c1b0f",
          gender: "neutral",
          hairStyle: "any",
          eyeStyle: "any",
          mouthStyle: "any",
          accessories: [],
        },
        avataaars: {
          skinColor: "e0bb95",
          hairColor: "3d2b1f",
          gender: "neutral",
          hairStyle: "any",
          eyeStyle: "any",
          mouthStyle: "any",
          accessories: ["eyewear"],
        },
        "croodles-neutral": {
          skinColor: "cfa162",
          hairColor: "7a5c46",
          gender: "neutral",
          hairStyle: "any",
          eyeStyle: "any",
          mouthStyle: "any",
          accessories: [],
        },
        Lorelei: {
          skinColor: "8b5a3c",
          hairColor: "b58143",
          gender: "neutral",
          hairStyle: "any",
          eyeStyle: "any",
          mouthStyle: "any",
          accessories: [],
        },
        "croodles-default": {
          skinColor: "bfa984",
          hairColor: "eac0a9",
          gender: "neutral",
          hairStyle: "any",
          eyeStyle: "any",
          mouthStyle: "any",
          accessories: [],
        },
        micah: {
          skinColor: "5e3825",
          hairColor: "2c1b0f",
          gender: "neutral",
          hairStyle: "any",
          eyeStyle: "any",
          mouthStyle: "any",
          accessories: ["hat"],
        },
        notionists: {
          skinColor: "f3d2bd",
          hairColor: "d3d3d3",
          gender: "neutral",
          hairStyle: "any",
          eyeStyle: "any",
          mouthStyle: "any",
          accessories: [],
        },
        "toon-head": {
          skinColor: "e0bb95",
          hairColor: "ff0000",
          gender: "neutral",
          hairStyle: "any",
          eyeStyle: "any",
          mouthStyle: "any",
          accessories: ["glasses"],
        },
      },

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

      // Aba ativa no editor
      activeTab: "estilo",

      // Opções disponíveis
      avatarStyles: [
        { value: "adventurer", label: "Aventureiro" },
        { value: "avataaars", label: "Avataaars" },
        { value: "croodles-neutral", label: "Big Ears" },
        { value: "Lorelei", label: "Robôs" },
        { value: "croodles-default", label: "Croodles" },
        { value: "micah", label: "Micah" },
        { value: "notionists", label: "Notionists" },
        { value: "toon-head", label: "Open Peeps" },
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

      // Estados para as novas opções
      selectedBeardStyle: "none",
      selectedBodyStyle: "default",
      selectedIconStyle: "default",
      selectedBrowStyle: "flat",
      selectedGestureStyle: "open",
      selectedGlassesStyle: "none",
      selectedGlassesVariant: "none", // Nova variante para os óculos específicos
      selectedLipStyle: "default",
      selectedNoseStyle: "default",
      selectedFaceFeature: "none",
      selectedEarringVariant: null,

      // Opções para as novas abas
      earringVariants: [
        { value: "earrings", label: "Brincos Simples" },
        { value: "hoop-earrings", label: "Brincos de Arco" },
        { value: "stud-earrings", label: "Brincos de Pérola" },
        { value: "drop-earrings", label: "Brincos de Gota" },
        { value: "chandelier-earrings", label: "Brincos Dangle" },
        { value: "button-earrings", label: "Brincos Botão" },
      ],

      // Variantes estendidas para acessórios
      glassesVariants: [
        { value: "none", label: "Nenhum" },
        { value: "variant01", label: "Óculos 01" },
        { value: "variant02", label: "Óculos 02" },
        { value: "variant03", label: "Óculos 03" },
        { value: "variant04", label: "Óculos 04" },
        { value: "variant05", label: "Óculos 05" },
      ],

      faceFeatures: [
        { value: "none", label: "Nenhum" },
        { value: "mole", label: "Pinta" },
        { value: "scar", label: "Cicatriz" },
        { value: "tattoo", label: "Tatuagem Facial" },
      ],

      // Recursos faciais estendidos
      faceFeaturesExtended: [
        { value: "none", label: "Nenhum" },
        { value: "birthmark", label: "Sinal de Nascença" },
        { value: "blush", label: "Rubor" },
        { value: "freckles", label: "Sardas" },
        { value: "mustache", label: "Bigode" },
      ],

      // Brincos estendidos
      earringVariantsExtended: [
        { value: "none", label: "Nenhum" },
        { value: "variant01", label: "Brincos 01" },
        { value: "variant02", label: "Brincos 02" },
        { value: "variant03", label: "Brincos 03" },
        { value: "variant04", label: "Brincos 04" },
        { value: "variant05", label: "Brincos 05" },
        { value: "variant06", label: "Brincos 06" },
      ],

      beardStyles: [
        { value: "none", label: "Sem barba" },
        { value: "normal", label: "Normal" },
        { value: "majestic", label: "Majestosa" },
        { value: "magnum", label: "Grande" },
        { value: "shaved", label: "Raspada" },
      ],

      bodyStyles: [
        { value: "default", label: "Padrão" },
        { value: "thin", label: "Magro" },
        { value: "fat", label: "Gordo" },
      ],

      iconStyles: [
        { value: "default", label: "Padrão" },
        { value: "circle", label: "Círculo" },
        { value: "square", label: "Quadrado" },
      ],

      browStyles: [
        { value: "flat", label: "Plana" },
        { value: "raised", label: "Elevada" },
        { value: "angled", label: "Angulosa" },
        { value: "arched", label: "Arqueada" },
      ],

      // Variantes estendidas para sobrancelhas
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

      gestureStyles: [
        { value: "open", label: "Aberta" },
        { value: "peace", label: "Paz" },
        { value: "point", label: "Apontando" },
        { value: "thumbUp", label: "Joinha para cima" },
        { value: "thumbDown", label: "Joinha para baixo" },
      ],

      glassesStyles: [
        { value: "none", label: "Nenhum" },
        { value: "round", label: "Redondo" },
        { value: "wayfarer", label: "Wayfarer" },
        { value: "aviator", label: "Aviador" },
        { value: "square", label: "Quadrado" },
        { value: "heart", label: "Coração" },
      ],

      lipStyles: [
        { value: "default", label: "Padrão" },
        { value: "smile", label: "Sorriso" },
        { value: "vomit", label: "Vomitando" },
        { value: "surprised", label: "Surpreso" },
        { value: "twinkle", label: "Brilhante" },
      ],

      noseStyles: [
        { value: "default", label: "Padrão" },
        { value: "large", label: "Grande" },
        { value: "small", label: "Pequeno" },
        { value: "rounded", label: "Arredondado" },
        { value: "pointed", label: "Pontudo" },
      ],

      adventurerEyeStyles: [
        { value: "variant01", label: "Olhar Afiado" },
        { value: "variant02", label: "Olhos Aventureiros" },
        { value: "happy", label: "Olhos Sorridentes" },
        { value: "squint", label: "Olhos Perspicazes" },
        { value: "winkWacky", label: "Olho Esperto" },
        { value: "variant03", label: "Olhar Corajoso" },
        { value: "variant04", label: "Olhos Concentrados" },
        { value: "variant05", label: "Olhar Determinado" },
      ],

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
      // Determinar o estilo real da API com base na seleção do usuário
      let apiStyle = this.selectedStyle;
      if (
        this.selectedStyle === "croodles-neutral" ||
        this.selectedStyle === "croodles-default"
      ) {
        apiStyle = "croodles";
      } else if (this.selectedStyle === "Lorelei") {
        apiStyle = "lorelei";
      }

      // Gerar URL do avatar com base nas opções selecionadas
      const baseUrl = `https://api.dicebear.com/9.x/${apiStyle}/svg`;

      // Parâmetros da URL
      const params = new URLSearchParams();
      params.append("seed", this.userSessionStore.getUsuarioId); // Usar ID do usuário como seed

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
      let allAccessories = [...this.selectedAccessories];
      if (this.selectedEarringVariant) {
        allAccessories.push(this.selectedEarringVariant);
      }
      if (allAccessories.length > 0) {
        params.append("accessories", allAccessories.join(","));
      }

      // Adicionar mais opções de personalização baseadas no estilo
      if (this.selectedStyle === "adventurer") {
        if (this.selectedHairStyle !== "any" && this.selectedHairStyle !== "bald") {
          params.append("hair", this.selectedHairStyle);
        } else if (this.selectedHairStyle === "bald") {
          // Para o estilo bald, não adicionamos o parâmetro hair, o que resultará em um avatar careca
        }
        if (this.selectedEyeStyle !== "any") {
          params.append("eyes", this.selectedEyeStyle);
        }
        if (this.selectedMouthStyle !== "any") {
          params.append("mouth", this.selectedMouthStyle);
        }
        // Adicionando outras opções específicas do estilo adventurer
        if (this.selectedBeardStyle !== "none") {
          params.append("beard", this.selectedBeardStyle);
        }
        // Adicionar o parâmetro eyebrows se não for o padrão
        if (this.selectedBrowStyle !== "flat") {
          params.append("eyebrows", this.selectedBrowStyle);
        }
        // Usar o novo parâmetro de óculos específicos se estiver selecionado
        if (this.selectedGlassesVariant !== "none") {
          params.append("glasses", this.selectedGlassesVariant);
        } else if (this.selectedGlassesStyle !== "none") {
          params.append("glasses", this.selectedGlassesStyle);
        }
        // Adicionando outras opções
        if (this.selectedBodyStyle !== "default") {
          params.append("body", this.selectedBodyStyle);
        }
        if (this.selectedIconStyle !== "default") {
          params.append("icon", this.selectedIconStyle);
        }
        if (this.selectedGestureStyle !== "open") {
          params.append("gesture", this.selectedGestureStyle);
        }
        if (this.selectedLipStyle !== "default") {
          params.append("lip", this.selectedLipStyle);
        }
        if (this.selectedNoseStyle !== "default") {
          params.append("nose", this.selectedNoseStyle);
        }
        // Adicionando recursos faciais
        if (this.selectedFaceFeature !== "none") {
          params.append("faceFeature", this.selectedFaceFeature);
        }
        // Adicionando brincos específicos se estiverem selecionados
        if (this.selectedEarringVariant && this.selectedEarringVariant !== "none") {
          params.append("earrings", this.selectedEarringVariant);
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
        // Adicionando outras opções específicas do estilo avataaars
        if (this.selectedBeardStyle !== "none") {
          params.append("facialHair", this.selectedBeardStyle);
        }
        // Adicionar o parâmetro eyebrows se não for o padrão
        if (this.selectedBrowStyle !== "flat") {
          params.append("eyebrows", this.selectedBrowStyle);
        }
        if (this.selectedGlassesStyle !== "none") {
          params.append("glasses", this.selectedGlassesStyle);
        }
        // Adicionando outras opções
        if (this.selectedBodyStyle !== "default") {
          params.append("body", this.selectedBodyStyle);
        }
        if (this.selectedIconStyle !== "default") {
          params.append("icon", this.selectedIconStyle);
        }
        if (this.selectedGestureStyle !== "open") {
          params.append("gesture", this.selectedGestureStyle);
        }
        if (this.selectedLipStyle !== "default") {
          params.append("lip", this.selectedLipStyle);
        }
        if (this.selectedNoseStyle !== "default") {
          params.append("nose", this.selectedNoseStyle);
        }
      } else if (this.selectedStyle === "Lorelei") {
        if (this.selectedEyeStyle !== "any") {
          params.append("eyes", this.selectedEyeStyle);
        }
        if (this.selectedMouthStyle !== "any") {
          params.append("mouth", this.selectedMouthStyle);
        }
        // Adicionando outras opções
        if (this.selectedBodyStyle !== "default") {
          params.append("body", this.selectedBodyStyle);
        }
        if (this.selectedIconStyle !== "default") {
          params.append("icon", this.selectedIconStyle);
        }
        if (this.selectedGestureStyle !== "open") {
          params.append("gesture", this.selectedGestureStyle);
        }
        if (this.selectedLipStyle !== "default") {
          params.append("lip", this.selectedLipStyle);
        }
        if (this.selectedNoseStyle !== "default") {
          params.append("nose", this.selectedNoseStyle);
        }
      } else if (this.selectedStyle === "micah") {
        if (this.selectedHairStyle !== "any") {
          params.append("hair", this.selectedHairStyle);
        }
        // Adicionando outras opções
        if (this.selectedBodyStyle !== "default") {
          params.append("body", this.selectedBodyStyle);
        }
        if (this.selectedIconStyle !== "default") {
          params.append("icon", this.selectedIconStyle);
        }
        if (this.selectedGestureStyle !== "open") {
          params.append("gesture", this.selectedGestureStyle);
        }
        if (this.selectedLipStyle !== "default") {
          params.append("lip", this.selectedLipStyle);
        }
        if (this.selectedNoseStyle !== "default") {
          params.append("nose", this.selectedNoseStyle);
        }
      } else if (
        ["croodles", "croodles-default", "croodles-neutral"].includes(
          this.selectedStyle,
        )
      ) {
        if (this.selectedHairStyle !== "any") {
          params.append("hair", this.selectedHairStyle);
        }
        if (this.selectedEyeStyle !== "any") {
          params.append("eyes", this.selectedEyeStyle);
        }
        if (this.selectedMouthStyle !== "any") {
          params.append("mouth", this.selectedMouthStyle);
        }
        // Adicionando outras opções
        if (this.selectedBodyStyle !== "default") {
          params.append("body", this.selectedBodyStyle);
        }
        if (this.selectedIconStyle !== "default") {
          params.append("icon", this.selectedIconStyle);
        }
        if (this.selectedGestureStyle !== "open") {
          params.append("gesture", this.selectedGestureStyle);
        }
        if (this.selectedLipStyle !== "default") {
          params.append("lip", this.selectedLipStyle);
        }
        if (this.selectedNoseStyle !== "default") {
          params.append("nose", this.selectedNoseStyle);
        }
      }

      return `${baseUrl}?${params.toString()}`;
    },

    showHairOptions() {
      return [
        "adventurer",
        "avataaars",
        "micah",
        "croodles",
        "croodles-default",
        "croodles-neutral",
      ].includes(this.selectedStyle);
    },

    showEyeOptions() {
      return [
        "adventurer",
        "avataaars",
        "Lorelei",
        "croodles",
        "croodles-default",
        "croodles-neutral",
      ].includes(this.selectedStyle);
    },

    showMouthOptions() {
      return [
        "adventurer",
        "avataaars",
        "Lorelei",
        "croodles",
        "croodles-default",
        "croodles-neutral",
      ].includes(this.selectedStyle);
    },

    // Computed property para determinar as abas com base no estilo selecionado
    activeTabs() {
      if (this.selectedStyle === "adventurer") {
        return [
          { id: "estilo", title: "Estilo", icon: "fas fa-paint-brush" },
          { id: "cabelo", title: "Cabelo", icon: "fas fa-cut" }, // <-- Cabelo logo após Estilo
          { id: "background", title: "Fundo", icon: "fas fa-fill-drip" },
          { id: "boca", title: "Boca", icon: "fas fa-smile" }, // <-- Boca após Fundo
          { id: "brincos", title: "Brincos", icon: "fas fa-gem" },
          {
            id: "sobrancelhas",
            title: "Sobrancelhas",
            icon: "fas fa-low-vision",
          },
          { id: "olhos", title: "Olhos", icon: "fas fa-eye" },
          { id: "recursos", title: "Recursos", icon: "fas fa-star" },
          { id: "oculos", title: "Óculos", icon: "fas fa-glasses" },
          { id: "cor_pele", title: "Cor da Pele", icon: "fas fa-tint" },
        ];
      } else {
        // Para outros estilos, retornar abas genéricas
        return [
          { id: "estilo", title: "Estilo", icon: "fas fa-paint-brush" },
          { id: "background", title: "Fundo", icon: "fas fa-fill-drip" },
          { id: "boca", title: "Boca", icon: "fas fa-smile" }, // <-- Boca após Fundo
          {
            id: "sobrancelhas",
            title: "Sobrancelhas",
            icon: "fas fa-low-vision",
          },
          { id: "olhos", title: "Olhos", icon: "fas fa-eye" },
          { id: "oculos", title: "Óculos", icon: "fas fa-glasses" },
          { id: "cabelo", title: "Cabelo", icon: "fas fa-cut" },
          { id: "cor_pele", title: "Cor da Pele", icon: "fas fa-tint" },
        ];
      }
    },
  },
  methods: {
    generatePreviewUrl(style, bgColor = null) {
      // Gerar URL de preview para estilos
      // Mapear variantes especiais para os estilos reais da API
      let apiStyle = style;
      if (style === "croodles-neutral" || style === "croodles-default") {
        apiStyle = "croodles";
      } else if (style === "Lorelei") {
        apiStyle = "lorelei";
      }

      // Obter configurações padrão para este estilo para criar uma prévia mais representativa
      const defaultSettings = this.defaultVisualSettings[style];
      let previewParams = `seed=preview&radius=50&size=64`;

      // Usar a cor de fundo fornecida ou a padrão
      const backgroundToUse = bgColor || "d1d4f9";
      previewParams += `&backgroundColor=${backgroundToUse}`;

      if (defaultSettings) {
        previewParams += `&skinColor=${defaultSettings.skinColor}&hairColor=${defaultSettings.hairColor}`;

        // Adicionar acessórios padrão, se houver
        if (
          defaultSettings.accessories &&
          defaultSettings.accessories.length > 0
        ) {
          previewParams += `&accessories=${defaultSettings.accessories.join(",")}`;
        }
      }

      // Para o estilo adventurer, adicionar também as configurações atuais se estivermos visualizando o mesmo estilo
      if (style === "adventurer" && this.selectedStyle === "adventurer") {
        previewParams += `&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;

        // Adicionar acessórios combinados
        let combinedAccessories = [...this.selectedAccessories];
        if (this.selectedEarringVariant) {
          combinedAccessories.push(this.selectedEarringVariant);
        }
        if (combinedAccessories.length > 0) {
          previewParams += `&accessories=${combinedAccessories.join(",")}`;
        }

        if (this.selectedHairStyle !== "any" && this.selectedHairStyle !== "bald") {
          previewParams += `&hair=${this.selectedHairStyle}`;
        }
        if (this.selectedEyeStyle !== "any") {
          previewParams += `&eyes=${this.selectedEyeStyle}`;
        }
        if (this.selectedMouthStyle !== "any") {
          previewParams += `&mouth=${this.selectedMouthStyle}`;
        }
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}`;
        }
        if (this.selectedBrowStyle !== "flat") {
          previewParams += `&eyebrows=${this.selectedBrowStyle}`;
        }
        if (this.selectedGlassesStyle !== "none") {
          previewParams += `&glasses=${this.selectedGlassesStyle}`;
        }
        if (this.selectedFaceFeature !== "none") {
          previewParams += `&faceFeature=${this.selectedFaceFeature}`;
        }
      }

      return `https://api.dicebear.com/9.x/${apiStyle}/svg?${previewParams}`;
    },

    selectStyle(style) {
      this.selectedStyle = style;

      // Aplicar configurações visuais padrão para o estilo selecionado
      const defaultSettings = this.defaultVisualSettings[style];
      if (defaultSettings) {
        this.selectedGender = defaultSettings.gender;
        this.selectedSkinColor = defaultSettings.skinColor;
        this.selectedHairColor = defaultSettings.hairColor;
        this.selectedHairStyle = defaultSettings.hairStyle;
        this.selectedEyeStyle = defaultSettings.eyeStyle;
        this.selectedMouthStyle = defaultSettings.mouthStyle;
        this.selectedAccessories = [...defaultSettings.accessories]; // Cópia do array para evitar referência direta

        // Redefinir as novas opções para valores padrão
        this.selectedBeardStyle = "none";
        this.selectedBodyStyle = "default";
        this.selectedIconStyle = "default";
        this.selectedBrowStyle = "flat";
        this.selectedGestureStyle = "open";
        this.selectedGlassesStyle = "none";
        this.selectedLipStyle = "default";
        this.selectedNoseStyle = "default";
        this.selectedFaceFeature = "none";
        this.selectedEarringVariant = null;

        // Limpar brincos dos acessórios se estiverem presentes
        this.selectedAccessories = this.selectedAccessories.filter(
          (acc) => !acc.includes("earring"),
        );
      }

      // Garantir que a aba de estilo permaneça ativa após seleção
      this.activeTab = "estilo";

      // Verificar se a aba atual ainda é válida para o novo estilo
      if (!this.activeTabs.some((tab) => tab.id === this.activeTab)) {
        this.activeTab = "estilo"; // Voltar para a aba de estilo se a atual não for mais válida
      }
    },

    selectGender(gender) {
      this.selectedGender = gender;
    },

    selectSkinColor(color) {
      this.selectedSkinColor = color;
    },

    selectHairColor(color) {
      this.selectedHairColor = color;
    },

    selectCustomHairColor(event) {
      // Extrai a cor hexadecimal do evento e remove o '#'
      const hexColor = event.target.value.replace('#', '');
      this.selectedHairColor = hexColor;
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
    },

    selectBackgroundColor(color) {
      this.selectedBackgroundColor = color;
    },

    selectHairStyle(style) {
      this.selectedHairStyle = style;
    },

    selectEyeStyle(style) {
      this.selectedEyeStyle = style;
    },

    selectMouthStyle(style) {
      this.selectedMouthStyle = style;
    },

    selectBeardStyle(style) {
      this.selectedBeardStyle = style;
    },

    selectBodyStyle(style) {
      this.selectedBodyStyle = style;
    },

    selectIconStyle(style) {
      this.selectedIconStyle = style;
    },

    selectBrowStyle(style) {
      this.selectedBrowStyle = style;
    },

    selectGestureStyle(style) {
      this.selectedGestureStyle = style;
    },

    selectGlassesStyle(style) {
      this.selectedGlassesStyle = style;
    },

    selectLipStyle(style) {
      this.selectedLipStyle = style;
    },

    selectNoseStyle(style) {
      this.selectedNoseStyle = style;
    },

    selectFaceFeature(feature) {
      this.selectedFaceFeature = feature;
    },

    selectEarringVariant(variant) {
      this.selectedEarringVariant = variant;
    },

    selectGlassesVariant(variant) {
      this.selectedGlassesVariant = variant;
    },

    generateEarringPreviewUrl(variant) {
      // Gerar URL de preview para brincos com base nas configurações atuais do avatar
      let previewParams = `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=${this.selectedBackgroundColor}`;

      // Adicionar outras configurações atuais do avatar
      previewParams += `&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;

      // Adicionar acessórios (exceto brincos temporariamente para esta prévia)
      let previewAccessories = [...this.selectedAccessories];
      if (variant) {
        previewAccessories.push(variant);
      }
      if (previewAccessories.length > 0) {
        previewParams += `&accessories=${previewAccessories.join(",")}`;
      }

      // Adicionar mais configurações com base no estilo
      if (this.selectedStyle === "adventurer") {
        if (this.selectedHairStyle !== "any" && this.selectedHairStyle !== "bald") {
          previewParams += `&hair=${this.selectedHairStyle}`;
        }
        if (this.selectedEyeStyle !== "any") {
          previewParams += `&eyes=${this.selectedEyeStyle}`;
        }
        if (this.selectedMouthStyle !== "any") {
          previewParams += `&mouth=${this.selectedMouthStyle}`;
        }
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}`;
        }
        if (this.selectedBrowStyle !== "flat") {
          previewParams += `&eyebrows=${this.selectedBrowStyle}`;
        }
        // Usar o novo parâmetro de óculos específicos se estiver selecionado
        if (this.selectedGlassesVariant !== "none") {
          previewParams += `&glasses=${this.selectedGlassesVariant}`;
        } else if (this.selectedGlassesStyle !== "none") {
          previewParams += `&glasses=${this.selectedGlassesStyle}`;
        }
        if (this.selectedFaceFeature !== "none") {
          previewParams += `&faceFeature=${this.selectedFaceFeature}`;
        }
        // Adicionando brincos específicos se estiverem selecionados
        if (this.selectedEarringVariant && this.selectedEarringVariant !== "none") {
          previewParams += `&earrings=${this.selectedEarringVariant}`;
        }
      }

      return `https://api.dicebear.com/9.x/adventurer/svg?${previewParams}`;
    },

    generateGlassesPreviewUrl(glassesValue) {
      // Gerar URL de preview para óculos com base nas configurações atuais do avatar
      let previewParams = `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=${this.selectedBackgroundColor}`;

      // Adicionar outras configurações atuais do avatar
      previewParams += `&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;

      // Adicionar o tipo de óculos específico
      if (glassesValue !== "none") {
        previewParams += `&glasses=${glassesValue}`;
      }

      // Adicionar outras configurações com base no estilo
      if (this.selectedStyle === "adventurer") {
        if (this.selectedHairStyle !== "any" && this.selectedHairStyle !== "bald") {
          previewParams += `&hair=${this.selectedHairStyle}`;
        }
        if (this.selectedEyeStyle !== "any") {
          previewParams += `&eyes=${this.selectedEyeStyle}`;
        }
        if (this.selectedMouthStyle !== "any") {
          previewParams += `&mouth=${this.selectedMouthStyle}`;
        }
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}`;
        }
        if (this.selectedBrowStyle !== "flat") {
          previewParams += `&eyebrows=${this.selectedBrowStyle}`;
        }
        if (this.selectedFaceFeature !== "none") {
          previewParams += `&faceFeature=${this.selectedFaceFeature}`;
        }
      }

      return `https://api.dicebear.com/9.x/adventurer/svg?${previewParams}`;
    },

    generateFeaturePreviewUrl(featureValue) {
      // Gerar URL de preview para recursos faciais com base nas configurações atuais do avatar
      let previewParams = `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=${this.selectedBackgroundColor}`;

      // Adicionar outras configurações atuais do avatar
      previewParams += `&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;

      // Adicionar o recurso facial específico
      if (featureValue !== "none") {
        previewParams += `&faceFeature=${featureValue}`;
      }

      // Adicionar outras configurações com base no estilo
      if (this.selectedStyle === "adventurer") {
        if (this.selectedHairStyle !== "any" && this.selectedHairStyle !== "bald") {
          previewParams += `&hair=${this.selectedHairStyle}`;
        }
        if (this.selectedEyeStyle !== "any") {
          previewParams += `&eyes=${this.selectedEyeStyle}`;
        }
        if (this.selectedMouthStyle !== "any") {
          previewParams += `&mouth=${this.selectedMouthStyle}`;
        }
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}`;
        }
        if (this.selectedBrowStyle !== "flat") {
          previewParams += `&eyebrows=${this.selectedBrowStyle}`;
        }
        // Usar o novo parâmetro de óculos específicos se estiver selecionado
        if (this.selectedGlassesVariant !== "none") {
          previewParams += `&glasses=${this.selectedGlassesVariant}`;
        } else if (this.selectedGlassesStyle !== "none") {
          previewParams += `&glasses=${this.selectedGlassesStyle}`;
        }
        // Adicionando brincos específicos se estiverem selecionados
        if (this.selectedEarringVariant && this.selectedEarringVariant !== "none") {
          previewParams += `&earrings=${this.selectedEarringVariant}`;
        }
      }

      return `https://api.dicebear.com/9.x/adventurer/svg?${previewParams}`;
    },

    generateEarringsPreviewUrl(earringsValue) {
      // Gerar URL de preview para brincos com base nas configurações atuais do avatar
      let previewParams = `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=${this.selectedBackgroundColor}`;

      // Adicionar outras configurações atuais do avatar
      previewParams += `&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;

      // Adicionar os brincos específicos
      if (earringsValue !== "none") {
        previewParams += `&earrings=${earringsValue}`;
      }

      // Adicionar outras configurações com base no estilo
      if (this.selectedStyle === "adventurer") {
        if (this.selectedHairStyle !== "any" && this.selectedHairStyle !== "bald") {
          previewParams += `&hair=${this.selectedHairStyle}`;
        }
        if (this.selectedEyeStyle !== "any") {
          previewParams += `&eyes=${this.selectedEyeStyle}`;
        }
        if (this.selectedMouthStyle !== "any") {
          previewParams += `&mouth=${this.selectedMouthStyle}`;
        }
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}`;
        }
        if (this.selectedBrowStyle !== "flat") {
          previewParams += `&eyebrows=${this.selectedBrowStyle}`;
        }
        // Usar o novo parâmetro de óculos específicos se estiver selecionado
        if (this.selectedGlassesVariant !== "none") {
          previewParams += `&glasses=${this.selectedGlassesVariant}`;
        } else if (this.selectedGlassesStyle !== "none") {
          previewParams += `&glasses=${this.selectedGlassesStyle}`;
        }
        if (this.selectedFaceFeature !== "none") {
          previewParams += `&faceFeature=${this.selectedFaceFeature}`;
        }
      }

      return `https://api.dicebear.com/9.x/adventurer/svg?${previewParams}`;
    },

    generateEyebrowPreviewUrl(eyebrowValue) {
      // Gerar URL de preview para estilos de sobrancelhas com base nas configurações atuais do avatar
      let previewParams = `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=${this.selectedBackgroundColor}`;

      // Adicionar outras configurações atuais do avatar
      previewParams += `&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;

      // Adicionar o estilo de sobrancelha específico
      if (eyebrowValue !== "flat") { // Usando flat como valor padrão
        previewParams += `&eyebrows=${eyebrowValue}`;
      }

      // Adicionar outras configurações com base no estilo
      if (this.selectedStyle === "adventurer") {
        if (this.selectedHairStyle !== "any" && this.selectedHairStyle !== "bald") {
          previewParams += `&hair=${this.selectedHairStyle}`;
        }
        if (this.selectedEyeStyle !== "any") {
          previewParams += `&eyes=${this.selectedEyeStyle}`;
        }
        if (this.selectedMouthStyle !== "any") {
          previewParams += `&mouth=${this.selectedMouthStyle}`;
        }
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}`;
        }
        if (this.selectedGlassesStyle !== "none") {
          previewParams += `&glasses=${this.selectedGlassesStyle}`;
        }
        if (this.selectedFaceFeature !== "none") {
          previewParams += `&faceFeature=${this.selectedFaceFeature}`;
        }
      }

      return `https://api.dicebear.com/9.x/adventurer/svg?${previewParams}`;
    },

    generateHairPreviewUrl(hairValue) {
      // Gerar URL de preview para estilos de cabelo com base nas configurações atuais do avatar
      let previewParams = `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=${this.selectedBackgroundColor}`;

      // Adicionar outras configurações atuais do avatar
      previewParams += `&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;

      // Adicionar o estilo de cabelo específico
      if (hairValue !== "any") {
        previewParams += `&hair=${hairValue}`;
      }

      // Adicionar outras configurações com base no estilo, exceto o próprio cabelo que estamos testando
      if (this.selectedStyle === "adventurer") {
        if (this.selectedEyeStyle !== "any") {
          previewParams += `&eyes=${this.selectedEyeStyle}`;
        }
        if (this.selectedMouthStyle !== "any") {
          previewParams += `&mouth=${this.selectedMouthStyle}`;
        }
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}`;
        }
        if (this.selectedBrowStyle !== "flat") {
          previewParams += `&eyebrows=${this.selectedBrowStyle}`;
        }
        if (this.selectedGlassesStyle !== "none") {
          previewParams += `&glasses=${this.selectedGlassesStyle}`;
        }
        if (this.selectedFaceFeature !== "none") {
          previewParams += `&faceFeature=${this.selectedFaceFeature}`;
        }
      }

      return `https://api.dicebear.com/9.x/adventurer/svg?${previewParams}`;
    },

    generateMouthPreviewUrl(mouthValue) {
      // Gerar URL de preview para estilos de boca com base nas configurações atuais do avatar
      let previewParams = `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=${this.selectedBackgroundColor}`;

      // Adicionar outras configurações atuais do avatar
      previewParams += `&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;

      // Adicionar o estilo de boca específico
      if (mouthValue !== "any") {
        previewParams += `&mouth=${mouthValue}`;
      }

      // Adicionar outras configurações com base no estilo, exceto a própria boca que estamos testando
      if (this.selectedStyle === "adventurer") {
        if (this.selectedHairStyle !== "any" && this.selectedHairStyle !== "bald") {
          previewParams += `&hair=${this.selectedHairStyle}`;
        }
        if (this.selectedEyeStyle !== "any") {
          previewParams += `&eyes=${this.selectedEyeStyle}`;
        }
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}`;
        }
        if (this.selectedBrowStyle !== "flat") {
          previewParams += `&eyebrows=${this.selectedBrowStyle}`;
        }
        if (this.selectedGlassesStyle !== "none") {
          previewParams += `&glasses=${this.selectedGlassesStyle}`;
        }
        if (this.selectedFaceFeature !== "none") {
          previewParams += `&faceFeature=${this.selectedFaceFeature}`;
        }
      }

      return `https://api.dicebear.com/9.x/adventurer/svg?${previewParams}`;
    },

    generateEyePreviewUrl(eyeValue) {
      // Gerar URL de preview para estilos de olhos com base nas configurações atuais do avatar
      let previewParams = `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=${this.selectedBackgroundColor}`;

      // Adicionar outras configurações atuais do avatar
      previewParams += `&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;

      // Adicionar o estilo de olhos específico
      if (eyeValue !== "any") {
        previewParams += `&eyes=${eyeValue}`;
      }

      // Adicionar outras configurações com base no estilo, exceto os próprios olhos que estamos testando
      if (this.selectedStyle === "adventurer") {
        if (this.selectedHairStyle !== "any" && this.selectedHairStyle !== "bald") {
          previewParams += `&hair=${this.selectedHairStyle}`;
        }
        if (this.selectedMouthStyle !== "any") {
          previewParams += `&mouth=${this.selectedMouthStyle}`;
        }
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}`;
        }
        if (this.selectedBrowStyle !== "flat") {
          previewParams += `&eyebrows=${this.selectedBrowStyle}`;
        }
        if (this.selectedGlassesStyle !== "none") {
          previewParams += `&glasses=${this.selectedGlassesStyle}`;
        }
        if (this.selectedFaceFeature !== "none") {
          previewParams += `&faceFeature=${this.selectedFaceFeature}`;
        }
      }

      return `https://api.dicebear.com/9.x/adventurer/svg?${previewParams}`;
    },

    resetToDefaults() {
      this.selectedStyle = "adventurer";
      // Aplicar as configurações padrão para o estilo inicial
      const defaultSettings = this.defaultVisualSettings[this.selectedStyle];
      if (defaultSettings) {
        this.selectedGender = defaultSettings.gender;
        this.selectedSkinColor = defaultSettings.skinColor;
        this.selectedHairColor = defaultSettings.hairColor;
        this.selectedHairStyle = defaultSettings.hairStyle;
        this.selectedEyeStyle = defaultSettings.eyeStyle;
        this.selectedMouthStyle = defaultSettings.mouthStyle;
        this.selectedAccessories = [...defaultSettings.accessories];
      }
      this.selectedBackgroundColor = "d1d4f9";

      // Redefinir as novas opções para valores padrão
      this.selectedBeardStyle = "none";
      this.selectedBodyStyle = "default";
      this.selectedIconStyle = "default";
      this.selectedBrowStyle = "flat";
      this.selectedGestureStyle = "open";
      this.selectedGlassesStyle = "none";
      this.selectedLipStyle = "default";
      this.selectedNoseStyle = "default";
      this.selectedFaceFeature = "none";
      this.selectedEarringVariant = null;

      // Limpar brincos dos acessórios se estiverem presentes
      this.selectedAccessories = this.selectedAccessories.filter(
        (acc) => !acc.includes("earring"),
      );
    },

    copyToClipboard() {
      navigator.clipboard
        .writeText(this.currentAvatarUrl)
        .then(() => {
          // Mostrar feedback de sucesso
          this.showToast("URL copiada para a área de transferência!");
        })
        .catch((err) => {
          console.error("Erro ao copiar URL:", err);
          this.showToast("Erro ao copiar URL!", "error");
        });
    },

    async saveAvatar() {
      // Usar o userId passado como propriedade, ou o ID do usuário logado como fallback
      const userId = this.userId || this.userSessionStore.getUsuarioId;

      console.log("Salvando avatar com URL:", this.currentAvatarUrl);
      console.log("ID do usuário:", userId);

      try {
        // Atualizar o avatar do usuário no backend
        const response = await fetch(
          `http://localhost:3000/api/usuarios/${userId}/cover`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              selectedAvatar: this.currentAvatarUrl,
            }),
          },
        );

        console.log("Resposta do servidor:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Dados recebidos do servidor:", data);

          // Atualizar o avatar no store do usuário logado se for o mesmo usuário
          if (this.userSessionStore.getUsuarioId === this.userId) {
            // Atualizar o avatar do usuário logado no localStorage para persistência
            const usuarioLogado = JSON.parse(
              localStorage.getItem("usuarioComum") || "{}",
            );
            if (usuarioLogado) {
              usuarioLogado.foto = data.usuario.foto;
              localStorage.setItem(
                "usuarioComum",
                JSON.stringify(usuarioLogado),
              );
            }
          }

          // Mostrar animação de sucesso e redirecionar
          this.showSuccessAndRedirect();
        } else {
          const errorData = await response.json();
          console.error("Erro do servidor:", errorData);
          throw new Error(errorData.erro || "Falha ao salvar avatar");
        }
      } catch (error) {
        console.error("Erro ao salvar avatar:", error);
        this.showToast(`Erro ao salvar avatar: ${error.message}`, "error");
      }
    },

    goBack() {
      // Tenta voltar para a página anterior, senão vai para o perfil do usuário
      if (window.history.state && window.history.state.back) {
        this.router.go(-1);
      } else {
        // Se não houver página anterior, redireciona para o perfil do usuário
        this.router.push(
          `/perfil/${this.userId || this.userSessionStore.getUsuarioId}`,
        );
      }
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

    // Método para mostrar animação de sucesso e redirecionar
    showSuccessAndRedirect() {
      // Exibir mensagem de sucesso
      this.showToast("Avatar criado com sucesso! 🎉", "success");

      // Salvar as configurações atuais no localStorage
      this.saveAvatarSettings();

      // Adicionar classe de animação ao componente
      document.body.classList.add("success-animation");

      // Remover a classe após um tempo
      setTimeout(() => {
        document.body.classList.remove("success-animation");
      }, 2000);

      // Redirecionar após um pequeno delay
      setTimeout(() => {
        // Tenta voltar para a página anterior, senão vai para o perfil do usuário
        if (window.history.state && window.history.state.back) {
          this.router.go(-1);
        } else {
          // Se não houver página anterior, redireciona para o perfil do usuário
          this.router.push(
            `/perfil/${this.userId || this.userSessionStore.getUsuarioId}`,
          );
        }
      }, 2000);
    },

    // Método para salvar as configurações do avatar no localStorage
    saveAvatarSettings() {
      const userId = this.userId || this.userSessionStore.getUsuarioId;
      const settings = {
        selectedStyle: this.selectedStyle,
        selectedGender: this.selectedGender,
        selectedSkinColor: this.selectedSkinColor,
        selectedHairColor: this.selectedHairColor,
        selectedHairStyle: this.selectedHairStyle,
        selectedEyeStyle: this.selectedEyeStyle,
        selectedMouthStyle: this.selectedMouthStyle,
        selectedAccessories: this.selectedAccessories,
        selectedBackgroundColor: this.selectedBackgroundColor,
        selectedBeardStyle: this.selectedBeardStyle,
        selectedBodyStyle: this.selectedBodyStyle,
        selectedIconStyle: this.selectedIconStyle,
        selectedBrowStyle: this.selectedBrowStyle,
        selectedGestureStyle: this.selectedGestureStyle,
        selectedGlassesStyle: this.selectedGlassesStyle,
        selectedLipStyle: this.selectedLipStyle,
        selectedNoseStyle: this.selectedNoseStyle,
        selectedFaceFeature: this.selectedFaceFeature,
        selectedEarringVariant: this.selectedEarringVariant,
        activeTab: this.activeTab,
      };

      localStorage.setItem(`avatar_settings_${userId}`, JSON.stringify(settings));
    },

    // Método para carregar as configurações do avatar do localStorage
    loadAvatarSettings() {
      const userId = this.userId || this.userSessionStore.getUsuarioId;
      const savedSettings = localStorage.getItem(`avatar_settings_${userId}`);

      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);

          // Restaurar todas as configurações salvas
          this.selectedStyle = settings.selectedStyle || this.selectedStyle;
          this.selectedGender = settings.selectedGender || this.selectedGender;
          this.selectedSkinColor = settings.selectedSkinColor || this.selectedSkinColor;
          this.selectedHairColor = settings.selectedHairColor || this.selectedHairColor;
          this.selectedHairStyle = settings.selectedHairStyle || this.selectedHairStyle;
          this.selectedEyeStyle = settings.selectedEyeStyle || this.selectedEyeStyle;
          this.selectedMouthStyle = settings.selectedMouthStyle || this.selectedMouthStyle;
          this.selectedAccessories = settings.selectedAccessories || this.selectedAccessories;
          this.selectedBackgroundColor = settings.selectedBackgroundColor || this.selectedBackgroundColor;
          this.selectedBeardStyle = settings.selectedBeardStyle || this.selectedBeardStyle;
          this.selectedBodyStyle = settings.selectedBodyStyle || this.selectedBodyStyle;
          this.selectedIconStyle = settings.selectedIconStyle || this.selectedIconStyle;
          this.selectedBrowStyle = settings.selectedBrowStyle || this.selectedBrowStyle;
          this.selectedGestureStyle = settings.selectedGestureStyle || this.selectedGestureStyle;
          this.selectedGlassesStyle = settings.selectedGlassesStyle || this.selectedGlassesStyle;
          this.selectedLipStyle = settings.selectedLipStyle || this.selectedLipStyle;
          this.selectedNoseStyle = settings.selectedNoseStyle || this.selectedNoseStyle;
          this.selectedFaceFeature = settings.selectedFaceFeature || this.selectedFaceFeature;
          this.selectedEarringVariant = settings.selectedEarringVariant || this.selectedEarringVariant;
          this.activeTab = settings.activeTab || this.activeTab;

          return true;
        } catch (error) {
          console.error('Erro ao carregar configurações do avatar:', error);
          return false;
        }
      }
      return false;
    },
  },

  mounted() {
    // Tentar carregar configurações salvas antes de aplicar os padrões
    const loaded = this.loadAvatarSettings();

    if (!loaded) {
      // Se não houver configurações salvas, aplicar configurações visuais padrão para o estilo inicial
      const defaultSettings = this.defaultVisualSettings[this.selectedStyle];
      if (defaultSettings) {
        this.selectedGender = defaultSettings.gender;
        this.selectedSkinColor = defaultSettings.skinColor;
        this.selectedHairColor = defaultSettings.hairColor;
        this.selectedHairStyle = defaultSettings.hairStyle;
        this.selectedEyeStyle = defaultSettings.eyeStyle;
        this.selectedMouthStyle = defaultSettings.mouthStyle;
        this.selectedAccessories = [...defaultSettings.accessories];
      }

      // Inicializar as novas opções com seus valores padrão
      this.selectedBeardStyle = "none";
      this.selectedBodyStyle = "default";
      this.selectedIconStyle = "default";
      this.selectedBrowStyle = "flat";
      this.selectedGestureStyle = "open";
      this.selectedGlassesStyle = "none";
      this.selectedLipStyle = "default";
      this.selectedNoseStyle = "default";
      this.selectedFaceFeature = "none";
      this.selectedEarringVariant = null;

      // Limpar brincos dos acessórios se estiverem presentes
      this.selectedAccessories = this.selectedAccessories.filter(
        (acc) => !acc.includes("earring"),
      );
    }
  },
};
</script>

<style scoped>
.avatar-customizer-page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.btn-back {
  background: #e9ecef;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  margin-right: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  color: #495057;
}

.btn-back:hover {
  background: #dee2e6;
}

.page-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.avatar-customizer {
  padding: 20px 0;
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
}

.btn-copy:hover {
  background: #5a6fd8;
}

.tabs-container {
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.tab-button {
  flex: 1;
  padding: 15px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  background: #e9ecef;
  color: #2c3e50;
}

.tab-button.active {
  background: white;
  color: #667eea;
  border-bottom: 3px solid #667eea;
}

.tab-content {
  padding: 20px;
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

.beard-options,
.body-options,
.icon-options,
.brow-options,
.gesture-options,
.glasses-options,
.lip-options,
.nose-options,
.earring-options,
.feature-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.beard-option,
.body-option,
.icon-option,
.brow-option,
.gesture-option,
.glasses-option,
.lip-option,
.nose-option,
.earring-option,
.feature-option {
  padding: 8px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  font-size: 0.85rem;
}

.beard-option:hover,
.body-option:hover,
.icon-option:hover,
.brow-option:hover,
.gesture-option:hover,
.glasses-option:hover,
.lip-option:hover,
.nose-option:hover,
.earring-option:hover,
.feature-option:hover {
  border-color: #667eea;
  background: #f8f9fa;
}

.beard-option.active,
.body-option.active,
.icon-option.active,
.brow-option.active,
.gesture-option.active,
.glasses-option.active,
.lip-option.active,
.nose-option.active,
.earring-option.active,
.feature-option.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

/* Estilo específico para o card de olhos do aventureiro */
.adventurer-eyes-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  border: 1px solid #b8d4f0;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
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
}

.style-option:hover {
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.style-option.active {
  border-color: #667eea;
  background: #f8f9ff;
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

/* Estilo especial para opções de cor de fundo */
.background-color-option {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.background-color-option::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.background-color-option:hover {
  transform: scale(1.05);
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.background-color-option.active {
  border-color: #2c3e50;
  box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.3);
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

/* Estilos para a prévia de fundo */
.background-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.background-preview-item {
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

.background-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.background-preview-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

.avatar-preview-with-bg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-preview-with-bg img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.bg-label {
  font-size: 0.75rem;
  text-align: center;
  color: #495057;
}

/* Estilos para a prévia de brincos */
.earring-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

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

.earring-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.earring-preview-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

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

.avatar-preview-with-earring img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.earring-label {
  font-size: 0.75rem;
  text-align: center;
  color: #495057;
}

/* Estilos para a prévia de cabelo */
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

/* Estilos para o seletor de cor personalizado */
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

.gradient-color-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: inherit;
  mask: conic-gradient(from 0deg, #000 0deg 90deg, #fff 90deg 180deg, #000 180deg 270deg, #fff 270deg 360deg);
  -webkit-mask: conic-gradient(from 0deg, #000 0deg 90deg, #fff 90deg 180deg, #000 180deg 270deg, #fff 270deg 360deg);
}

.gradient-color-circle::-webkit-color-swatch {
  opacity: 0;
}

.gradient-color-circle::-webkit-color-swatch-wrapper {
  padding: 0;
  border: none;
  border-radius: 50%;
  width: 100%;
  height: 100%;
}

/* Estilos para a prévia de boca */
.mouth-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.mouth-preview-item {
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

.mouth-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.mouth-preview-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

.avatar-preview-with-mouth {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-preview-with-mouth img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.mouth-label {
  font-size: 0.75rem;
  text-align: center;
  color: #495057;
}

/* Estilos para a prévia de olhos */
.eye-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.eye-preview-item {
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

.eye-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.eye-preview-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

.avatar-preview-with-eye {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-preview-with-eye img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

/* Estilos para categorias de acessórios */
.accessory-category {
  margin-bottom: 25px;
}

.accessory-category h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 8px;
}

/* Estilos para a prévia de óculos */
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

/* Estilos para a prévia de recursos faciais */
.features-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

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

.feature-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-preview-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

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

.avatar-preview-with-feature img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

/* Estilos para a prévia de brincos */
.earrings-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.earrings-preview-item {
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

.earrings-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.earrings-preview-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

.avatar-preview-with-earrings {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-preview-with-earrings img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

/* Estilos para a prévia de sobrancelhas */
.brow-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

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

.brow-preview-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.brow-preview-item.active {
  border-color: #667eea;
  background: #f8f9ff;
}

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

.avatar-preview-with-brow img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.btn-reset,
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
}

.btn-reset {
  background: #e9ecef;
  color: #495057;
}

.btn-reset:hover {
  background: #dee2e6;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}
</style>

<style>
/* Animação de sucesso */
body.success-animation::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(102, 126, 234, 0.3) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  pointer-events: none;
  z-index: 9999;
  animation: successPulse 0.6s ease-out;
}

@keyframes successPulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  70% {
    transform: scale(1.5);
    opacity: 0.7;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Confetti effect para sucesso */
.confetti-success {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10000;
}
</style>
