<template>
  <div class="avatar-customizer-page">
    <div class="page-header">
      <button @click="goBack" class="btn-back">
        <i class="fas fa-arrow-left"></i> Voltar
      </button>
      <button @click="saveAvatar" class="btn-save-header">
        <i class="fas fa-save"></i> Salvar
      </button>
    </div>

    <div class="avatar-customizer">
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
      </div>

      <!-- Sistema de abas para personalização -->
      <div class="tabs-container">
        <div class="tabs-nav-wrapper">
          <button
            class="tabs-arrow tabs-arrow-left"
            :class="{ hidden: !canScrollLeft }"
            @click="scrollTabsLeft"
            aria-label="Rolar abas para a esquerda"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="tabs-header" ref="tabsHeader" @scroll="updateArrows">
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
          <button
            class="tabs-arrow tabs-arrow-right"
            :class="{ hidden: !canScrollRight }"
            @click="scrollTabsRight"
            aria-label="Rolar abas para a direita"
          >
            <i class="fas fa-chevron-right"></i>
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

          <!-- Componente de personalização para o estilo Adventurer -->
          <AdventurerAvatarCustomizer
            v-if="selectedStyle === 'adventurer'"
            :active-tab="activeTab"
            :selected-style="selectedStyle"
            :selected-skin-color="selectedSkinColor"
            :selected-hair-color="selectedHairColor"
            :selected-hair-style="selectedHairStyle"
            :selected-eye-style="selectedEyeStyle"
            :selected-mouth-style="selectedMouthStyle"
            :selected-brow-style="selectedBrowStyle"
            :selected-glasses-style="selectedGlassesStyle"
            :selected-glasses-variant="selectedGlassesVariant"
            :selected-face-feature="selectedFaceFeature"
            :selected-earring-variant="selectedEarringVariant"
            :selected-beard-style="selectedBeardStyle"
            :selected-background-color="selectedBackgroundColor"
            :user-session-store="userSessionStore"
            @update:selectedSkinColor="selectedSkinColor = $event"
            @update:selectedHairColor="selectedHairColor = $event"
            @update:selectedHairStyle="selectedHairStyle = $event"
            @update:selectedEyeStyle="selectedEyeStyle = $event"
            @update:selectedMouthStyle="selectedMouthStyle = $event"
            @update:selectedBrowStyle="selectedBrowStyle = $event"
            @update:selectedGlassesStyle="selectedGlassesStyle = $event"
            @update:selectedGlassesVariant="selectedGlassesVariant = $event"
            @update:selectedFaceFeature="selectedFaceFeature = $event"
            @update:selectedEarringVariant="selectedEarringVariant = $event"
            @update:selectedBeardStyle="selectedBeardStyle = $event"
          />

          <!-- Componente de personalização para o estilo Notionists -->
          <NotionistsAvatarCustomizer
            v-if="selectedStyle === 'notionists'"
            :active-tab="activeTab"
            :selected-style="selectedStyle"
            :selected-hair-style="selectedHairStyle"
            :selected-lips-style="selectedLipsStyle"
            :selected-nose-style="selectedNoseStyle"
            :selected-brow-style="selectedBrowStyle"
            :selected-eye-style="selectedEyeStyle"
            :selected-beard-style="selectedBeardStyle"
            :selected-gesture-style="selectedGestureStyle"
            :selected-glasses-variant="selectedGlassesVariant"
            :selected-body-style="selectedBodyStyle"
            :selected-body-icon="selectedBodyIcon"
            :user-session-store="userSessionStore"
            @update:selectedHairStyle="selectedHairStyle = $event"
            @update:selectedLipsStyle="selectedLipsStyle = $event"
            @update:selectedNoseStyle="selectedNoseStyle = $event"
            @update:selectedBrowStyle="selectedBrowStyle = $event"
            @update:selectedEyeStyle="selectedEyeStyle = $event"
            @update:selectedBeardStyle="selectedBeardStyle = $event"
            @update:selectedGestureStyle="selectedGestureStyle = $event"
            @update:selectedGlassesVariant="selectedGlassesVariant = $event"
            @update:selectedBodyStyle="selectedBodyStyle = $event"
            @update:selectedBodyIcon="selectedBodyIcon = $event"
          />

          <!-- Componente de personalização para o estilo Avataaars -->
          <AvataaarsAvatarCustomizer
            v-if="selectedStyle === 'avataaars'"
            :active-tab="activeTab"
            :selected-style="selectedStyle"
            :selected-skin-color="selectedSkinColor"
            :selected-hair-color="selectedHairColor"
            :selected-top-style="selectedTopStyle"
            :selected-eye-style="selectedEyeStyle"
            :selected-eyebrow-style="selectedEyebrowStyle"
            :selected-mouth-style="selectedMouthStyle"
            :selected-facial-hair-style="selectedFacialHairStyle"
            :selected-facial-hair-color="selectedFacialHairColor"
            :selected-accessory-style="selectedAccessoryStyle"
            :selected-accessories-color="selectedAccessoriesColor"
            :selected-clothing-style="selectedClothingStyle"
            :selected-clothes-color="selectedClothesColor"
            :selected-clothing-graphic="selectedClothingGraphic"
            :selected-hat-color="selectedHatColor"
            :selected-avatar-style="selectedAvatarStyle"
            :user-session-store="userSessionStore"
            @update:selectedSkinColor="selectedSkinColor = $event"
            @update:selectedHairColor="selectedHairColor = $event"
            @update:selectedTopStyle="selectedTopStyle = $event"
            @update:selectedEyeStyle="selectedEyeStyle = $event"
            @update:selectedEyebrowStyle="selectedEyebrowStyle = $event"
            @update:selectedMouthStyle="selectedMouthStyle = $event"
            @update:selectedFacialHairStyle="selectedFacialHairStyle = $event"
            @update:selectedFacialHairColor="selectedFacialHairColor = $event"
            @update:selectedAccessoryStyle="selectedAccessoryStyle = $event"
            @update:selectedAccessoriesColor="selectedAccessoriesColor = $event"
            @update:selectedClothingStyle="selectedClothingStyle = $event"
            @update:selectedClothesColor="selectedClothesColor = $event"
            @update:selectedClothingGraphic="selectedClothingGraphic = $event"
            @update:selectedHatColor="selectedHatColor = $event"
            @update:selectedAvatarStyle="selectedAvatarStyle = $event"
          />

          <!-- Componente de personalização para o estilo Micah -->
          <MicahAvatarCustomizer
            v-if="selectedStyle === 'micah'"
            :active-tab="activeTab"
            :selected-style="selectedStyle"
            :selected-micah-base-color="selectedMicahBaseColor"
            :selected-micah-hair-style="selectedMicahHairStyle"
            :selected-micah-hair-color="selectedMicahHairColor"
            :selected-micah-eye-style="selectedMicahEyeStyle"
            :selected-micah-eyes-color="selectedMicahEyesColor"
            :selected-micah-eye-shadow-color="selectedMicahEyeShadowColor"
            :selected-micah-eyebrow-style="selectedMicahEyebrowStyle"
            :selected-micah-eyebrows-color="selectedMicahEyebrowsColor"
            :selected-micah-mouth-style="selectedMicahMouthStyle"
            :selected-micah-mouth-color="selectedMicahMouthColor"
            :selected-micah-nose-style="selectedMicahNoseStyle"
            :selected-micah-ear-style="selectedMicahEarStyle"
            :selected-micah-facial-hair-style="selectedMicahFacialHairStyle"
            :selected-micah-facial-hair-color="selectedMicahFacialHairColor"
            :selected-micah-glasses-style="selectedMicahGlassesStyle"
            :selected-micah-glasses-color="selectedMicahGlassesColor"
            :selected-micah-earring-style="selectedMicahEarringStyle"
            :selected-micah-earring-color="selectedMicahEarringColor"
            :selected-micah-shirt-style="selectedMicahShirtStyle"
            :selected-micah-shirt-color="selectedMicahShirtColor"
            :user-session-store="userSessionStore"
            @update:selectedMicahBaseColor="selectedMicahBaseColor = $event"
            @update:selectedMicahHairStyle="selectedMicahHairStyle = $event"
            @update:selectedMicahHairColor="selectedMicahHairColor = $event"
            @update:selectedMicahEyeStyle="selectedMicahEyeStyle = $event"
            @update:selectedMicahEyesColor="selectedMicahEyesColor = $event"
            @update:selectedMicahEyeShadowColor="
              selectedMicahEyeShadowColor = $event
            "
            @update:selectedMicahEyebrowStyle="
              selectedMicahEyebrowStyle = $event
            "
            @update:selectedMicahEyebrowsColor="
              selectedMicahEyebrowsColor = $event
            "
            @update:selectedMicahMouthStyle="selectedMicahMouthStyle = $event"
            @update:selectedMicahMouthColor="selectedMicahMouthColor = $event"
            @update:selectedMicahNoseStyle="selectedMicahNoseStyle = $event"
            @update:selectedMicahEarStyle="selectedMicahEarStyle = $event"
            @update:selectedMicahFacialHairStyle="
              selectedMicahFacialHairStyle = $event
            "
            @update:selectedMicahFacialHairColor="
              selectedMicahFacialHairColor = $event
            "
            @update:selectedMicahGlassesStyle="
              selectedMicahGlassesStyle = $event
            "
            @update:selectedMicahGlassesColor="
              selectedMicahGlassesColor = $event
            "
            @update:selectedMicahEarringStyle="
              selectedMicahEarringStyle = $event
            "
            @update:selectedMicahEarringColor="
              selectedMicahEarringColor = $event
            "
            @update:selectedMicahShirtStyle="selectedMicahShirtStyle = $event"
            @update:selectedMicahShirtColor="selectedMicahShirtColor = $event"
          />

          <!-- Componente de personalização para o estilo Open Peeps -->
          <OpenPeepsAvatarCustomizer
            v-if="selectedStyle === 'toon-head'"
            :active-tab="activeTab"
            :selected-style="selectedStyle"
            :selected-head-style="selectedOpenPeepsHead"
            :selected-head-contrast-color="selectedOpenPeepsHeadContrastColor"
            :selected-face-style="selectedOpenPeepsFace"
            :selected-open-peeps-facial-hair="selectedOpenPeepsFacialHair"
            :selected-open-peeps-accessory="selectedOpenPeepsAccessory"
            :selected-open-peeps-mask="selectedOpenPeepsMask"
            :selected-open-peeps-skin-color="selectedOpenPeepsSkinColor"
            :selected-open-peeps-clothing-color="selectedOpenPeepsClothingColor"
            :user-session-store="userSessionStore"
            @update:selectedHeadStyle="selectedOpenPeepsHead = $event"
            @update:selectedHeadContrastColor="
              selectedOpenPeepsHeadContrastColor = $event
            "
            @update:selectedFaceStyle="selectedOpenPeepsFace = $event"
            @update:selectedOpenPeepsFacialHair="
              selectedOpenPeepsFacialHair = $event
            "
            @update:selectedOpenPeepsAccessory="
              selectedOpenPeepsAccessory = $event
            "
            @update:selectedOpenPeepsMask="selectedOpenPeepsMask = $event"
            @update:selectedOpenPeepsSkinColor="
              selectedOpenPeepsSkinColor = $event
            "
            @update:selectedOpenPeepsClothingColor="
              selectedOpenPeepsClothingColor = $event
            "
          />

          <!-- Componente de personalização para o estilo Croodles -->
          <CroodlesAvatarCustomizer
            v-if="selectedStyle === 'croodles-default'"
            :active-tab="activeTab"
            :selected-style="selectedStyle"
            :selected-croodles-top="selectedCroodlesTop"
            :selected-croodles-top-color="selectedCroodlesTopColor"
            :selected-croodles-face="selectedCroodlesFace"
            :selected-croodles-eyes="selectedCroodlesEyes"
            :selected-croodles-mouth="selectedCroodlesMouth"
            :selected-croodles-nose="selectedCroodlesNose"
            :selected-croodles-beard="selectedCroodlesBeard"
            :selected-croodles-mustache="selectedCroodlesMustache"
            :selected-croodles-base-color="selectedCroodlesBaseColor"
            :user-session-store="userSessionStore"
            @update:selectedCroodlesTop="selectedCroodlesTop = $event"
            @update:selectedCroodlesTopColor="selectedCroodlesTopColor = $event"
            @update:selectedCroodlesFace="selectedCroodlesFace = $event"
            @update:selectedCroodlesEyes="selectedCroodlesEyes = $event"
            @update:selectedCroodlesMouth="selectedCroodlesMouth = $event"
            @update:selectedCroodlesNose="selectedCroodlesNose = $event"
            @update:selectedCroodlesBeard="selectedCroodlesBeard = $event"
            @update:selectedCroodlesMustache="selectedCroodlesMustache = $event"
            @update:selectedCroodlesBaseColor="
              selectedCroodlesBaseColor = $event
            "
          />

          <!-- Componente de personalização para o estilo Lorelei -->
          <LoreleiAvatarCustomizer
            v-if="selectedStyle === 'Lorelei'"
            :active-tab="activeTab"
            :selected-style="selectedStyle"
            :selected-lorelei-hair="selectedLoreleiHair"
            :selected-lorelei-hair-color="selectedLoreleiHairColor"
            :selected-lorelei-head="selectedLoreleiHead"
            :selected-lorelei-eyes="selectedLoreleiEyes"
            :selected-lorelei-eyes-color="selectedLoreleiEyesColor"
            :selected-lorelei-eyebrows="selectedLoreleiEyebrows"
            :selected-lorelei-eyebrows-color="selectedLoreleiEyebrowsColor"
            :selected-lorelei-mouth="selectedLoreleiMouth"
            :selected-lorelei-mouth-color="selectedLoreleiMouthColor"
            :selected-lorelei-nose="selectedLoreleiNose"
            :selected-lorelei-nose-color="selectedLoreleiNoseColor"
            :selected-lorelei-beard="selectedLoreleiBeard"
            :selected-lorelei-glasses="selectedLoreleiGlasses"
            :selected-lorelei-glasses-color="selectedLoreleiGlassesColor"
            :selected-lorelei-earrings="selectedLoreleiEarrings"
            :selected-lorelei-earrings-color="selectedLoreleiEarringsColor"
            :selected-lorelei-freckles="selectedLoreleiFreckles"
            :selected-lorelei-freckles-color="selectedLoreleiFrecklesColor"
            :selected-lorelei-hair-accessories="selectedLoreleiHairAccessories"
            :selected-lorelei-hair-accessories-color="
              selectedLoreleiHairAccessoriesColor
            "
            :selected-lorelei-skin-color="selectedLoreleiSkinColor"
            :user-session-store="userSessionStore"
            @update:selectedLoreleiHair="selectedLoreleiHair = $event"
            @update:selectedLoreleiHairColor="selectedLoreleiHairColor = $event"
            @update:selectedLoreleiHead="selectedLoreleiHead = $event"
            @update:selectedLoreleiEyes="selectedLoreleiEyes = $event"
            @update:selectedLoreleiEyesColor="selectedLoreleiEyesColor = $event"
            @update:selectedLoreleiEyebrows="selectedLoreleiEyebrows = $event"
            @update:selectedLoreleiEyebrowsColor="
              selectedLoreleiEyebrowsColor = $event
            "
            @update:selectedLoreleiMouth="selectedLoreleiMouth = $event"
            @update:selectedLoreleiMouthColor="
              selectedLoreleiMouthColor = $event
            "
            @update:selectedLoreleiNose="selectedLoreleiNose = $event"
            @update:selectedLoreleiNoseColor="selectedLoreleiNoseColor = $event"
            @update:selectedLoreleiBeard="selectedLoreleiBeard = $event"
            @update:selectedLoreleiGlasses="selectedLoreleiGlasses = $event"
            @update:selectedLoreleiGlassesColor="
              selectedLoreleiGlassesColor = $event
            "
            @update:selectedLoreleiEarrings="selectedLoreleiEarrings = $event"
            @update:selectedLoreleiEarringsColor="
              selectedLoreleiEarringsColor = $event
            "
            @update:selectedLoreleiFreckles="selectedLoreleiFreckles = $event"
            @update:selectedLoreleiFrecklesColor="
              selectedLoreleiFrecklesColor = $event
            "
            @update:selectedLoreleiHairAccessories="
              selectedLoreleiHairAccessories = $event
            "
            @update:selectedLoreleiHairAccessoriesColor="
              selectedLoreleiHairAccessoriesColor = $event
            "
            @update:selectedLoreleiSkinColor="selectedLoreleiSkinColor = $event"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserSessionStore } from "@/store/userSessionStore.js";
import { useRouter } from "vue-router";
import NotionistsAvatarCustomizer from "@/components/NotionistsAvatarCustomizer.vue";
import AvataaarsAvatarCustomizer from "@/components/AvataaarsAvatarCustomizer.vue";
import MicahAvatarCustomizer from "@/components/MicahAvatarCustomizer.vue";
import AdventurerAvatarCustomizer from "@/components/AdventurerAvatarCustomizer.vue";
import OpenPeepsAvatarCustomizer from "@/components/OpenPeepsAvatarCustomizer.vue";
import CroodlesAvatarCustomizer from "@/components/CroodlesAvatarCustomizer.vue";
import LoreleiAvatarCustomizer from "@/components/LoreleiAvatarCustomizer.vue";

export default {
  name: "PersonalizarAvatar",
  components: {
    NotionistsAvatarCustomizer,
    AvataaarsAvatarCustomizer,
    MicahAvatarCustomizer,
    OpenPeepsAvatarCustomizer,
    CroodlesAvatarCustomizer,
    LoreleiAvatarCustomizer,
    AdventurerAvatarCustomizer,
  },
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
          accessories: [],
        },
        Lorelei: {
          skinColor: "ffffff",
          hairColor: "2c1b18",
          gender: "neutral",
          hairStyle: "variant01",
          eyeStyle: "variant01",
          mouthStyle: "happy01",
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
          top: "variant01",
          topColor: "000000",
          face: "variant01",
          eyes: "variant01",
          mouth: "variant01",
          nose: "variant01",
          beard: "none",
          mustache: "none",
          baseColor: "ffffff",
        },
        micah: {
          skinColor: "5e3825",
          hairColor: "2c1b0f",
          gender: "neutral",
          hairStyle: "any",
          eyeStyle: "any",
          mouthStyle: "any",
          accessories: [],
        },
        notionists: {
          skinColor: "f3d2bd",
          hairColor: "d3d3d3",
          gender: "neutral",
          hairStyle: "variant01",
          eyeStyle: "variant01",
          mouthStyle: "variant01",
          accessories: [],
        },
        "toon-head": {
          skinColor: "edb98a",
          hairColor: "2c1b18",
          gender: "neutral",
          hairStyle: "short1",
          eyeStyle: "smile",
          mouthStyle: "smile",
          accessories: [],
          head: "short1",
          headContrastColor: "2c1b18",
          face: "smile",
          facialHair: "none",
          accessory: "none",
          mask: "none",
          clothingColor: "8fa7df",
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
        { value: "Lorelei", label: "Lorelei" },
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
      // Controle das setas de navegação das abas
      canScrollLeft: false,
      canScrollRight: false,

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

      // Opção para o estilo Notionists
      selectedLipsStyle: "variant01",
      selectedBodyIcon: "none",

      // Novas opções para o estilo Avataaars
      selectedTopStyle: "any",
      selectedEyebrowStyle: "any",
      selectedFacialHairStyle: "none",
      selectedFacialHairColor: "2c1b18",
      selectedAccessoryStyle: "none",
      selectedAccessoriesColor: "262e33",
      selectedClothingStyle: "any",
      selectedClothesColor: "262e33",
      selectedClothingGraphic: "bat",
      selectedHatColor: "262e33",
      selectedAvatarStyle: "default",

      // Opções para o estilo Micah
      selectedMicahBaseColor: "f9c9b6",
      selectedMicahHairStyle: "any",
      selectedMicahHairColor: "000000",
      selectedMicahEyeStyle: "any",
      selectedMicahEyesColor: "000000",
      selectedMicahEyeShadowColor: "ffffff",
      selectedMicahEyebrowStyle: "any",
      selectedMicahEyebrowsColor: "000000",
      selectedMicahMouthStyle: "any",
      selectedMicahMouthColor: "000000",
      selectedMicahNoseStyle: "any",
      selectedMicahEarStyle: "any",
      selectedMicahFacialHairStyle: "none",
      selectedMicahFacialHairColor: "000000",
      selectedMicahGlassesStyle: "none",
      selectedMicahGlassesColor: "000000",
      selectedMicahEarringStyle: "none",
      selectedMicahEarringColor: "000000",
      selectedMicahShirtStyle: "any",
      selectedMicahShirtColor: "6bd9e9",

      // Opções para o estilo Open Peeps
      selectedOpenPeepsHead: "short1",
      selectedOpenPeepsFace: "smile",
      selectedOpenPeepsFacialHair: "none",
      selectedOpenPeepsAccessory: "none",
      selectedOpenPeepsMask: "none",
      selectedOpenPeepsSkinColor: "edb98a",
      selectedOpenPeepsHeadContrastColor: "2c1b18",
      selectedOpenPeepsClothingColor: "8fa7df",

      // Opções para o estilo Lorelei
      selectedLoreleiHair: "variant01",
      selectedLoreleiHairColor: "2c1b18",
      selectedLoreleiHead: "variant01",
      selectedLoreleiEyes: "variant01",
      selectedLoreleiEyesColor: "000000",
      selectedLoreleiEyebrows: "variant01",
      selectedLoreleiEyebrowsColor: "000000",
      selectedLoreleiMouth: "happy01",
      selectedLoreleiMouthColor: "000000",
      selectedLoreleiNose: "variant01",
      selectedLoreleiNoseColor: "000000",
      selectedLoreleiBeard: "none",
      selectedLoreleiGlasses: "none",
      selectedLoreleiGlassesColor: "000000",
      selectedLoreleiEarrings: "none",
      selectedLoreleiEarringsColor: "000000",
      selectedLoreleiFreckles: "none",
      selectedLoreleiFrecklesColor: "000000",
      selectedLoreleiHairAccessories: "none",
      selectedLoreleiHairAccessoriesColor: "000000",
      selectedLoreleiSkinColor: "ffffff",

      // Opções para o estilo Croodles
      selectedCroodlesTop: "variant01",
      selectedCroodlesTopColor: "000000",
      selectedCroodlesFace: "variant01",
      selectedCroodlesEyes: "variant01",
      selectedCroodlesMouth: "variant01",
      selectedCroodlesNose: "variant01",
      selectedCroodlesBeard: "none",
      selectedCroodlesMustache: "none",
      selectedCroodlesBaseColor: "ffffff",

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
      } else if (this.selectedStyle === "toon-head") {
        apiStyle = "open-peeps";
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
        if (
          this.selectedHairStyle !== "any" &&
          this.selectedHairStyle !== "bald"
        ) {
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
        if (
          this.selectedEarringVariant &&
          this.selectedEarringVariant !== "none"
        ) {
          params.append("earrings", this.selectedEarringVariant);
        }
      } else if (this.selectedStyle === "avataaars") {
        // Cabelo / Top
        if (this.selectedTopStyle !== "any") {
          params.append("top", this.selectedTopStyle);
        }
        // Olhos
        if (this.selectedEyeStyle !== "any") {
          params.append("eyes", this.selectedEyeStyle);
        }
        // Sobrancelhas
        if (this.selectedEyebrowStyle !== "any") {
          params.append("eyebrows", this.selectedEyebrowStyle);
        }
        // Boca
        if (this.selectedMouthStyle !== "any") {
          params.append("mouth", this.selectedMouthStyle);
        }
        // Barba facial
        if (this.selectedFacialHairStyle !== "none") {
          params.append("facialHair", this.selectedFacialHairStyle);
          params.append("facialHairProbability", "100");
          params.append("facialHairColor", this.selectedFacialHairColor);
        }
        // Acessórios (óculos etc)
        if (this.selectedAccessoryStyle !== "none") {
          params.append("accessories", this.selectedAccessoryStyle);
          params.append("accessoriesProbability", "100");
          params.append("accessoriesColor", this.selectedAccessoriesColor);
        }
        // Roupas
        if (this.selectedClothingStyle !== "any") {
          params.append("clothing", this.selectedClothingStyle);
          params.append("clothesColor", this.selectedClothesColor);
          if (this.selectedClothingStyle === "graphicShirt") {
            params.append("clothingGraphic", this.selectedClothingGraphic);
          }
        }
        // Cor do chapéu
        params.append("hatColor", this.selectedHatColor);
        // Estilo visual (circle / default)
        if (this.selectedAvatarStyle !== "default") {
          params.append("style", this.selectedAvatarStyle);
        }
      } else if (this.selectedStyle === "Lorelei") {
        // Lorelei API params
        params.append("hair", this.selectedLoreleiHair);
        params.append("hairColor", this.selectedLoreleiHairColor);
        params.append("head", this.selectedLoreleiHead);
        params.append("eyes", this.selectedLoreleiEyes);
        params.append("eyesColor", this.selectedLoreleiEyesColor);
        params.append("eyebrows", this.selectedLoreleiEyebrows);
        params.append("eyebrowsColor", this.selectedLoreleiEyebrowsColor);
        params.append("mouth", this.selectedLoreleiMouth);
        params.append("mouthColor", this.selectedLoreleiMouthColor);
        params.append("nose", this.selectedLoreleiNose);
        params.append("noseColor", this.selectedLoreleiNoseColor);
        params.append("skinColor", this.selectedLoreleiSkinColor);

        // Barba (com probabilidade)
        if (this.selectedLoreleiBeard !== "none") {
          params.append("beard", this.selectedLoreleiBeard);
          params.append("beardProbability", "100");
        } else {
          params.append("beardProbability", "0");
        }

        // Óculos (com probabilidade)
        if (this.selectedLoreleiGlasses !== "none") {
          params.append("glasses", this.selectedLoreleiGlasses);
          params.append("glassesProbability", "100");
          params.append("glassesColor", this.selectedLoreleiGlassesColor);
        } else {
          params.append("glassesProbability", "0");
        }

        // Brincos (com probabilidade)
        if (this.selectedLoreleiEarrings !== "none") {
          params.append("earrings", this.selectedLoreleiEarrings);
          params.append("earringsProbability", "100");
          params.append("earringsColor", this.selectedLoreleiEarringsColor);
        } else {
          params.append("earringsProbability", "0");
        }

        // Sardas (com probabilidade)
        if (this.selectedLoreleiFreckles !== "none") {
          params.append("freckles", this.selectedLoreleiFreckles);
          params.append("frecklesProbability", "100");
          params.append("frecklesColor", this.selectedLoreleiFrecklesColor);
        } else {
          params.append("frecklesProbability", "0");
        }

        // Acessórios de cabelo (com probabilidade)
        if (this.selectedLoreleiHairAccessories !== "none") {
          params.append("hairAccessories", this.selectedLoreleiHairAccessories);
          params.append("hairAccessoriesProbability", "100");
          params.append(
            "hairAccessoriesColor",
            this.selectedLoreleiHairAccessoriesColor,
          );
        } else {
          params.append("hairAccessoriesProbability", "0");
        }
      } else if (this.selectedStyle === "micah") {
        params.append("baseColor", this.selectedMicahBaseColor);
        if (this.selectedMicahHairStyle !== "any") {
          params.append("hair", this.selectedMicahHairStyle);
          params.append("hairProbability", "100");
        }
        params.append("hairColor", this.selectedMicahHairColor);
        if (this.selectedMicahEyeStyle !== "any") {
          params.append("eyes", this.selectedMicahEyeStyle);
        }
        params.append("eyesColor", this.selectedMicahEyesColor);
        params.append("eyeShadowColor", this.selectedMicahEyeShadowColor);
        if (this.selectedMicahEyebrowStyle !== "any") {
          params.append("eyebrows", this.selectedMicahEyebrowStyle);
        }
        params.append("eyebrowsColor", this.selectedMicahEyebrowsColor);
        if (this.selectedMicahMouthStyle !== "any") {
          params.append("mouth", this.selectedMicahMouthStyle);
        }
        params.append("mouthColor", this.selectedMicahMouthColor);
        if (this.selectedMicahNoseStyle !== "any") {
          params.append("nose", this.selectedMicahNoseStyle);
        }
        if (this.selectedMicahEarStyle !== "any") {
          params.append("ears", this.selectedMicahEarStyle);
        }
        if (this.selectedMicahFacialHairStyle !== "none") {
          params.append("facialHair", this.selectedMicahFacialHairStyle);
          params.append("facialHairProbability", "100");
          params.append("facialHairColor", this.selectedMicahFacialHairColor);
        }
        if (this.selectedMicahGlassesStyle !== "none") {
          params.append("glasses", this.selectedMicahGlassesStyle);
          params.append("glassesProbability", "100");
          params.append("glassesColor", this.selectedMicahGlassesColor);
        }
        if (this.selectedMicahEarringStyle !== "none") {
          params.append("earrings", this.selectedMicahEarringStyle);
          params.append("earringsProbability", "100");
          params.append("earringColor", this.selectedMicahEarringColor);
        }
        params.append(
          "shirt",
          this.selectedMicahShirtStyle !== "any"
            ? this.selectedMicahShirtStyle
            : "crew",
        );
        params.append("shirtColor", this.selectedMicahShirtColor);
      } else if (this.selectedStyle === "notionists") {
        // Params conforme API DiceBear Notionists
        params.append("hair", this.selectedHairStyle);
        params.append("lips", this.selectedLipsStyle);
        params.append("nose", this.selectedNoseStyle);
        params.append("brows", this.selectedBrowStyle);
        params.append("eyes", this.selectedEyeStyle);
        params.append("body", this.selectedBodyStyle);

        // Barba (com probabilidade)
        if (this.selectedBeardStyle !== "none") {
          params.append("beard", this.selectedBeardStyle);
          params.append("beardProbability", "100");
        } else {
          params.append("beardProbability", "0");
        }

        // Gesto (com probabilidade)
        if (this.selectedGestureStyle !== "none") {
          params.append("gesture", this.selectedGestureStyle);
          params.append("gestureProbability", "100");
        } else {
          params.append("gestureProbability", "0");
        }

        // Óculos (com probabilidade)
        if (this.selectedGlassesVariant !== "none") {
          params.append("glasses", this.selectedGlassesVariant);
          params.append("glassesProbability", "100");
        } else {
          params.append("glassesProbability", "0");
        }

        // Ícone do corpo (com probabilidade)
        if (this.selectedBodyIcon !== "none") {
          params.append("bodyIcon", this.selectedBodyIcon);
          params.append("bodyIconProbability", "100");
        } else {
          params.append("bodyIconProbability", "0");
        }
      } else if (this.selectedStyle === "toon-head") {
        // Open Peeps API params
        params.append("head", this.selectedOpenPeepsHead);
        params.append(
          "headContrastColor",
          this.selectedOpenPeepsHeadContrastColor,
        );
        params.append("face", this.selectedOpenPeepsFace);
        params.append("skinColor", this.selectedOpenPeepsSkinColor);
        params.append("clothingColor", this.selectedOpenPeepsClothingColor);

        // Barba (com probabilidade)
        if (this.selectedOpenPeepsFacialHair !== "none") {
          params.append("facialHair", this.selectedOpenPeepsFacialHair);
          params.append("facialHairProbability", "100");
        } else {
          params.append("facialHairProbability", "0");
        }

        // Acessórios (com probabilidade)
        if (this.selectedOpenPeepsAccessory !== "none") {
          params.append("accessories", this.selectedOpenPeepsAccessory);
          params.append("accessoriesProbability", "100");
        } else {
          params.append("accessoriesProbability", "0");
        }

        // Máscara (com probabilidade)
        if (this.selectedOpenPeepsMask !== "none") {
          params.append("mask", this.selectedOpenPeepsMask);
          params.append("maskProbability", "100");
        } else {
          params.append("maskProbability", "0");
        }
      } else if (this.selectedStyle === "croodles-default") {
        // Croodles API params
        params.append("top", this.selectedCroodlesTop);
        params.append("topColor", this.selectedCroodlesTopColor);
        params.append("face", this.selectedCroodlesFace);
        params.append("eyes", this.selectedCroodlesEyes);
        params.append("mouth", this.selectedCroodlesMouth);
        params.append("nose", this.selectedCroodlesNose);
        params.append("baseColor", this.selectedCroodlesBaseColor);

        // Barba (com probabilidade)
        if (this.selectedCroodlesBeard !== "none") {
          params.append("beard", this.selectedCroodlesBeard);
          params.append("beardProbability", "100");
        } else {
          params.append("beardProbability", "0");
        }

        // Bigode (com probabilidade)
        if (this.selectedCroodlesMustache !== "none") {
          params.append("mustache", this.selectedCroodlesMustache);
          params.append("mustacheProbability", "100");
        } else {
          params.append("mustacheProbability", "0");
        }
      } else if (["croodles"].includes(this.selectedStyle)) {
        if (this.selectedHairStyle !== "any") {
          params.append("hair", this.selectedHairStyle);
        }
        if (this.selectedEyeStyle !== "any") {
          params.append("eyes", this.selectedEyeStyle);
        }
        if (this.selectedMouthStyle !== "any") {
          params.append("mouth", this.selectedMouthStyle);
        }
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
      ].includes(this.selectedStyle);
    },

    showEyeOptions() {
      return [
        "adventurer",
        "avataaars",
        "croodles",
        "croodles-default",
      ].includes(this.selectedStyle);
    },

    showMouthOptions() {
      return [
        "adventurer",
        "avataaars",
        "croodles",
        "croodles-default",
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
      } else if (this.selectedStyle === "notionists") {
        return [
          { id: "estilo", title: "Estilo", icon: "fas fa-paint-brush" },
          { id: "background", title: "Fundo", icon: "fas fa-fill-drip" },
          { id: "cabelo", title: "Cabelo", icon: "fas fa-cut" },
          { id: "labios", title: "Lábios", icon: "fas fa-kiss-wink-heart" },
          { id: "nariz", title: "Nariz", icon: "fas fa-meh-blank" },
          {
            id: "sobrancelhas",
            title: "Sobrancelhas",
            icon: "fas fa-low-vision",
          },
          { id: "olhos", title: "Olhos", icon: "fas fa-eye" },
          { id: "barba", title: "Barba", icon: "fas fa-user-tie" },
          { id: "gestos", title: "Gestos", icon: "fas fa-hand-paper" },
          { id: "oculos", title: "Óculos", icon: "fas fa-glasses" },
          { id: "corpo", title: "Corpo", icon: "fas fa-user" },
          { id: "icone_corpo", title: "Ícone Corpo", icon: "fas fa-bolt" },
        ];
      } else if (this.selectedStyle === "avataaars") {
        return [
          { id: "estilo", title: "Estilo", icon: "fas fa-paint-brush" },
          { id: "background", title: "Fundo", icon: "fas fa-fill-drip" },
          { id: "cabelo", title: "Cabelo", icon: "fas fa-cut" },
          { id: "olhos", title: "Olhos", icon: "fas fa-eye" },
          {
            id: "sobrancelhas",
            title: "Sobrancelhas",
            icon: "fas fa-low-vision",
          },
          { id: "boca", title: "Boca", icon: "fas fa-smile" },
          { id: "barba", title: "Barba", icon: "fas fa-user" },
          { id: "acessorios", title: "Acessórios", icon: "fas fa-glasses" },
          { id: "roupas", title: "Roupas", icon: "fas fa-tshirt" },
          { id: "chapeu", title: "Chapéu", icon: "fas fa-hat-wizard" },
          { id: "cor_pele", title: "Cor da Pele", icon: "fas fa-tint" },
          { id: "visual", title: "Visual", icon: "fas fa-shapes" },
        ];
      } else if (this.selectedStyle === "micah") {
        return [
          { id: "estilo", title: "Estilo", icon: "fas fa-paint-brush" },
          { id: "background", title: "Fundo", icon: "fas fa-fill-drip" },
          { id: "cabelo", title: "Cabelo", icon: "fas fa-cut" },
          { id: "olhos", title: "Olhos", icon: "fas fa-eye" },
          {
            id: "sobrancelhas",
            title: "Sobrancelhas",
            icon: "fas fa-low-vision",
          },
          { id: "boca", title: "Boca", icon: "fas fa-smile" },
          { id: "nariz", title: "Nariz", icon: "fas fa-otter" },
          { id: "orelhas", title: "Orelhas", icon: "fas fa-deaf" },
          { id: "barba", title: "Barba", icon: "fas fa-user" },
          { id: "oculos", title: "Óculos", icon: "fas fa-glasses" },
          { id: "brincos", title: "Brincos", icon: "fas fa-gem" },
          { id: "camisa", title: "Camisa", icon: "fas fa-tshirt" },
          { id: "cor_pele", title: "Cor da Pele", icon: "fas fa-tint" },
        ];
      } else if (this.selectedStyle === "toon-head") {
        return [
          { id: "estilo", title: "Estilo", icon: "fas fa-paint-brush" },
          { id: "background", title: "Fundo", icon: "fas fa-fill-drip" },
          { id: "cabelo", title: "Cabeça", icon: "fas fa-cut" },
          { id: "cor_cabelo", title: "Cor Cabelo", icon: "fas fa-palette" },
          { id: "rosto", title: "Rosto", icon: "fas fa-smile" },
          { id: "barba", title: "Barba", icon: "fas fa-user-tie" },
          { id: "acessorios", title: "Acessórios", icon: "fas fa-glasses" },
          { id: "mascara", title: "Máscara", icon: "fas fa-head-side-mask" },
          { id: "cor_pele", title: "Cor da Pele", icon: "fas fa-tint" },
          { id: "cor_roupa", title: "Cor Roupa", icon: "fas fa-tshirt" },
        ];
      } else if (this.selectedStyle === "croodles-default") {
        return [
          { id: "estilo", title: "Estilo", icon: "fas fa-paint-brush" },
          { id: "background", title: "Fundo", icon: "fas fa-fill-drip" },
          { id: "cabelo", title: "Cabelo", icon: "fas fa-cut" },
          { id: "cor_cabelo", title: "Cor Cabelo", icon: "fas fa-palette" },
          { id: "rosto", title: "Rosto", icon: "fas fa-meh" },
          { id: "olhos", title: "Olhos", icon: "fas fa-eye" },
          { id: "boca", title: "Boca", icon: "fas fa-smile" },
          { id: "nariz", title: "Nariz", icon: "fas fa-meh-blank" },
          { id: "barba", title: "Barba", icon: "fas fa-user-tie" },
          { id: "bigode", title: "Bigode", icon: "fas fa-user-secret" },
          { id: "cor_base", title: "Cor Base", icon: "fas fa-tint" },
        ];
      } else if (this.selectedStyle === "Lorelei") {
        return [
          { id: "estilo", title: "Estilo", icon: "fas fa-paint-brush" },
          { id: "background", title: "Fundo", icon: "fas fa-fill-drip" },
          { id: "cabelo", title: "Cabelo", icon: "fas fa-cut" },
          { id: "cor_cabelo", title: "Cor Cabelo", icon: "fas fa-palette" },
          { id: "cabeca", title: "Cabeça", icon: "fas fa-user-circle" },
          { id: "olhos", title: "Olhos", icon: "fas fa-eye" },
          { id: "cor_olhos", title: "Cor Olhos", icon: "fas fa-palette" },
          {
            id: "sobrancelhas",
            title: "Sobrancelhas",
            icon: "fas fa-low-vision",
          },
          {
            id: "cor_sobrancelhas",
            title: "Cor Sobrancelhas",
            icon: "fas fa-palette",
          },
          { id: "boca", title: "Boca", icon: "fas fa-smile" },
          { id: "cor_boca", title: "Cor Boca", icon: "fas fa-palette" },
          { id: "nariz", title: "Nariz", icon: "fas fa-meh-blank" },
          { id: "cor_nariz", title: "Cor Nariz", icon: "fas fa-palette" },
          { id: "barba", title: "Barba", icon: "fas fa-user-tie" },
          { id: "oculos", title: "Óculos", icon: "fas fa-glasses" },
          { id: "cor_oculos", title: "Cor Óculos", icon: "fas fa-palette" },
          { id: "brincos", title: "Brincos", icon: "fas fa-gem" },
          { id: "cor_brincos", title: "Cor Brincos", icon: "fas fa-palette" },
          { id: "sardas", title: "Sardas", icon: "fas fa-sun" },
          { id: "acessorios_cabelo", title: "Acessórios", icon: "fas fa-spa" },
          {
            id: "cor_acessorios_cabelo",
            title: "Cor Acessórios",
            icon: "fas fa-palette",
          },
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
    avatarPreviewKey() {
      // Gera uma chave única baseada nas opções do avatar para forçar atualização da imagem
      return `${this.selectedStyle}-${this.selectedSkinColor}-${this.selectedHairColor}-${this.selectedHairStyle}-${this.selectedEyeStyle}-${this.selectedMouthStyle}-${this.selectedBeardStyle}-${this.selectedBodyStyle}-${this.selectedGestureStyle}-${this.selectedLipsStyle}-${this.selectedNoseStyle}-${this.selectedBrowStyle}-${this.selectedGlassesStyle}-${this.selectedGlassesVariant}-${this.selectedFaceFeature}-${this.selectedEarringVariant}-${this.selectedTopStyle}-${this.selectedEyebrowStyle}-${this.selectedFacialHairStyle}-${this.selectedFacialHairColor}-${this.selectedAccessoryStyle}-${this.selectedAccessoriesColor}-${this.selectedClothingStyle}-${this.selectedClothesColor}-${this.selectedClothingGraphic}-${this.selectedHatColor}-${this.selectedAvatarStyle}-${this.selectedMicahBaseColor}-${this.selectedMicahHairStyle}-${this.selectedMicahHairColor}-${this.selectedMicahEyeStyle}-${this.selectedMicahEyesColor}-${this.selectedMicahEyeShadowColor}-${this.selectedMicahEyebrowStyle}-${this.selectedMicahEyebrowsColor}-${this.selectedMicahMouthStyle}-${this.selectedMicahMouthColor}-${this.selectedMicahNoseStyle}-${this.selectedMicahEarStyle}-${this.selectedMicahFacialHairStyle}-${this.selectedMicahFacialHairColor}-${this.selectedMicahGlassesStyle}-${this.selectedMicahGlassesColor}-${this.selectedMicahEarringStyle}-${this.selectedMicahEarringColor}-${this.selectedMicahShirtStyle}-${this.selectedMicahShirtColor}-${this.selectedOpenPeepsHead}-${this.selectedOpenPeepsFace}-${this.selectedOpenPeepsFacialHair}-${this.selectedOpenPeepsAccessory}-${this.selectedOpenPeepsMask}-${this.selectedOpenPeepsSkinColor}-${this.selectedOpenPeepsHeadContrastColor}-${this.selectedOpenPeepsClothingColor}-${this.selectedCroodlesTop}-${this.selectedCroodlesTopColor}-${this.selectedCroodlesFace}-${this.selectedCroodlesEyes}-${this.selectedCroodlesMouth}-${this.selectedCroodlesNose}-${this.selectedCroodlesBeard}-${this.selectedCroodlesMustache}-${this.selectedCroodlesBaseColor}-${this.selectedLoreleiHair}-${this.selectedLoreleiHairColor}-${this.selectedLoreleiHead}-${this.selectedLoreleiEyes}-${this.selectedLoreleiEyesColor}-${this.selectedLoreleiEyebrows}-${this.selectedLoreleiEyebrowsColor}-${this.selectedLoreleiMouth}-${this.selectedLoreleiMouthColor}-${this.selectedLoreleiNose}-${this.selectedLoreleiNoseColor}-${this.selectedLoreleiBeard}-${this.selectedLoreleiGlasses}-${this.selectedLoreleiGlassesColor}-${this.selectedLoreleiEarrings}-${this.selectedLoreleiEarringsColor}-${this.selectedLoreleiFreckles}-${this.selectedLoreleiFrecklesColor}-${this.selectedLoreleiHairAccessories}-${this.selectedLoreleiHairAccessoriesColor}-${this.selectedLoreleiSkinColor}`;
    },
  },
  methods: {
    generatePreviewUrl(style, bgColor = null) {
      // Gerar URL de preview para estilos
      // Mapear variantes especiais para os estilos reais da API
      let apiStyle = style;
      if (style === "croodles-default") {
        apiStyle = "croodles";
      } else if (style === "Lorelei") {
        apiStyle = "lorelei";
      } else if (style === "toon-head") {
        apiStyle = "open-peeps";
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

        if (
          this.selectedHairStyle !== "any" &&
          this.selectedHairStyle !== "bald"
        ) {
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

      // Para o estilo notionists, adicionar as configurações atuais
      if (style === "notionists" && this.selectedStyle === "notionists") {
        previewParams += `&hair=${this.selectedHairStyle}`;
        previewParams += `&lips=${this.selectedLipsStyle}`;
        previewParams += `&nose=${this.selectedNoseStyle}`;
        previewParams += `&brows=${this.selectedBrowStyle}`;
        previewParams += `&eyes=${this.selectedEyeStyle}`;
        previewParams += `&body=${this.selectedBodyStyle}`;

        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}&beardProbability=100`;
        } else {
          previewParams += `&beardProbability=0`;
        }
        if (this.selectedGestureStyle !== "none") {
          previewParams += `&gesture=${this.selectedGestureStyle}&gestureProbability=100`;
        } else {
          previewParams += `&gestureProbability=0`;
        }
        if (this.selectedGlassesVariant !== "none") {
          previewParams += `&glasses=${this.selectedGlassesVariant}&glassesProbability=100`;
        } else {
          previewParams += `&glassesProbability=0`;
        }
        if (this.selectedBodyIcon !== "none") {
          previewParams += `&bodyIcon=${this.selectedBodyIcon}&bodyIconProbability=100`;
        } else {
          previewParams += `&bodyIconProbability=0`;
        }
      }

      // Para o estilo avataaars, adicionar as configurações atuais se estivermos visualizando o mesmo estilo
      if (style === "avataaars" && this.selectedStyle === "avataaars") {
        previewParams += `&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;
        if (this.selectedTopStyle !== "any") {
          previewParams += `&top=${this.selectedTopStyle}`;
        }
        if (this.selectedEyeStyle !== "any") {
          previewParams += `&eyes=${this.selectedEyeStyle}`;
        }
        if (this.selectedEyebrowStyle !== "any") {
          previewParams += `&eyebrows=${this.selectedEyebrowStyle}`;
        }
        if (this.selectedMouthStyle !== "any") {
          previewParams += `&mouth=${this.selectedMouthStyle}`;
        }
        if (this.selectedFacialHairStyle !== "none") {
          previewParams += `&facialHair=${this.selectedFacialHairStyle}&facialHairProbability=100&facialHairColor=${this.selectedFacialHairColor}`;
        }
        if (this.selectedAccessoryStyle !== "none") {
          previewParams += `&accessories=${this.selectedAccessoryStyle}&accessoriesProbability=100&accessoriesColor=${this.selectedAccessoriesColor}`;
        }
        if (this.selectedClothingStyle !== "any") {
          previewParams += `&clothing=${this.selectedClothingStyle}&clothesColor=${this.selectedClothesColor}`;
          if (this.selectedClothingStyle === "graphicShirt") {
            previewParams += `&clothingGraphic=${this.selectedClothingGraphic}`;
          }
        }
        previewParams += `&hatColor=${this.selectedHatColor}`;
        if (this.selectedAvatarStyle !== "default") {
          previewParams += `&style=${this.selectedAvatarStyle}`;
        }
      }

      // Para o estilo Open Peeps, adicionar as configurações atuais
      if (style === "toon-head" && this.selectedStyle === "toon-head") {
        previewParams += `&head=${this.selectedOpenPeepsHead}`;
        previewParams += `&headContrastColor=${this.selectedOpenPeepsHeadContrastColor}`;
        previewParams += `&face=${this.selectedOpenPeepsFace}`;
        previewParams += `&skinColor=${this.selectedOpenPeepsSkinColor}`;
        previewParams += `&clothingColor=${this.selectedOpenPeepsClothingColor}`;

        if (this.selectedOpenPeepsFacialHair !== "none") {
          previewParams += `&facialHair=${this.selectedOpenPeepsFacialHair}&facialHairProbability=100`;
        } else {
          previewParams += `&facialHairProbability=0`;
        }
        if (this.selectedOpenPeepsAccessory !== "none") {
          previewParams += `&accessories=${this.selectedOpenPeepsAccessory}&accessoriesProbability=100`;
        } else {
          previewParams += `&accessoriesProbability=0`;
        }
        if (this.selectedOpenPeepsMask !== "none") {
          previewParams += `&mask=${this.selectedOpenPeepsMask}&maskProbability=100`;
        } else {
          previewParams += `&maskProbability=0`;
        }
      }

      // Para o estilo micah, adicionar as configurações atuais
      if (style === "micah" && this.selectedStyle === "micah") {
        previewParams += `&baseColor=${this.selectedMicahBaseColor}`;
        previewParams += `&hairColor=${this.selectedMicahHairColor}`;
        if (this.selectedMicahHairStyle !== "any") {
          previewParams += `&hair=${this.selectedMicahHairStyle}&hairProbability=100`;
        }
        if (this.selectedMicahEyeStyle !== "any") {
          previewParams += `&eyes=${this.selectedMicahEyeStyle}`;
        }
        previewParams += `&eyesColor=${this.selectedMicahEyesColor}`;
        previewParams += `&eyeShadowColor=${this.selectedMicahEyeShadowColor}`;
        if (this.selectedMicahEyebrowStyle !== "any") {
          previewParams += `&eyebrows=${this.selectedMicahEyebrowStyle}`;
        }
        previewParams += `&eyebrowsColor=${this.selectedMicahEyebrowsColor}`;
        if (this.selectedMicahMouthStyle !== "any") {
          previewParams += `&mouth=${this.selectedMicahMouthStyle}`;
        }
        previewParams += `&mouthColor=${this.selectedMicahMouthColor}`;
        if (this.selectedMicahNoseStyle !== "any") {
          previewParams += `&nose=${this.selectedMicahNoseStyle}`;
        }
        if (this.selectedMicahEarStyle !== "any") {
          previewParams += `&ears=${this.selectedMicahEarStyle}`;
        }
        if (this.selectedMicahFacialHairStyle !== "none") {
          previewParams += `&facialHair=${this.selectedMicahFacialHairStyle}&facialHairProbability=100&facialHairColor=${this.selectedMicahFacialHairColor}`;
        }
        if (this.selectedMicahGlassesStyle !== "none") {
          previewParams += `&glasses=${this.selectedMicahGlassesStyle}&glassesProbability=100&glassesColor=${this.selectedMicahGlassesColor}`;
        }
        if (this.selectedMicahEarringStyle !== "none") {
          previewParams += `&earrings=${this.selectedMicahEarringStyle}&earringsProbability=100&earringColor=${this.selectedMicahEarringColor}`;
        }
        previewParams += `&shirtColor=${this.selectedMicahShirtColor}`;
        if (this.selectedMicahShirtStyle !== "any") {
          previewParams += `&shirt=${this.selectedMicahShirtStyle}`;
        }
      }

      // Para o estilo Croodles, adicionar as configurações atuais
      if (
        style === "croodles-default" &&
        this.selectedStyle === "croodles-default"
      ) {
        previewParams += `&top=${this.selectedCroodlesTop}`;
        previewParams += `&topColor=${this.selectedCroodlesTopColor}`;
        previewParams += `&face=${this.selectedCroodlesFace}`;
        previewParams += `&eyes=${this.selectedCroodlesEyes}`;
        previewParams += `&mouth=${this.selectedCroodlesMouth}`;
        previewParams += `&nose=${this.selectedCroodlesNose}`;
        previewParams += `&baseColor=${this.selectedCroodlesBaseColor}`;

        if (this.selectedCroodlesBeard !== "none") {
          previewParams += `&beard=${this.selectedCroodlesBeard}&beardProbability=100`;
        } else {
          previewParams += `&beardProbability=0`;
        }
        if (this.selectedCroodlesMustache !== "none") {
          previewParams += `&mustache=${this.selectedCroodlesMustache}&mustacheProbability=100`;
        } else {
          previewParams += `&mustacheProbability=0`;
        }
      }

      // Para o estilo Lorelei, adicionar as configurações atuais
      if (style === "Lorelei" && this.selectedStyle === "Lorelei") {
        previewParams += `&hair=${this.selectedLoreleiHair}`;
        previewParams += `&hairColor=${this.selectedLoreleiHairColor}`;
        previewParams += `&head=${this.selectedLoreleiHead}`;
        previewParams += `&eyes=${this.selectedLoreleiEyes}`;
        previewParams += `&eyesColor=${this.selectedLoreleiEyesColor}`;
        previewParams += `&eyebrows=${this.selectedLoreleiEyebrows}`;
        previewParams += `&eyebrowsColor=${this.selectedLoreleiEyebrowsColor}`;
        previewParams += `&mouth=${this.selectedLoreleiMouth}`;
        previewParams += `&mouthColor=${this.selectedLoreleiMouthColor}`;
        previewParams += `&nose=${this.selectedLoreleiNose}`;
        previewParams += `&noseColor=${this.selectedLoreleiNoseColor}`;
        previewParams += `&skinColor=${this.selectedLoreleiSkinColor}`;

        if (this.selectedLoreleiBeard !== "none") {
          previewParams += `&beard=${this.selectedLoreleiBeard}&beardProbability=100`;
        } else {
          previewParams += `&beardProbability=0`;
        }
        if (this.selectedLoreleiGlasses !== "none") {
          previewParams += `&glasses=${this.selectedLoreleiGlasses}&glassesProbability=100&glassesColor=${this.selectedLoreleiGlassesColor}`;
        } else {
          previewParams += `&glassesProbability=0`;
        }
        if (this.selectedLoreleiEarrings !== "none") {
          previewParams += `&earrings=${this.selectedLoreleiEarrings}&earringsProbability=100&earringsColor=${this.selectedLoreleiEarringsColor}`;
        } else {
          previewParams += `&earringsProbability=0`;
        }
        if (this.selectedLoreleiFreckles !== "none") {
          previewParams += `&freckles=${this.selectedLoreleiFreckles}&frecklesProbability=100&frecklesColor=${this.selectedLoreleiFrecklesColor}`;
        } else {
          previewParams += `&frecklesProbability=0`;
        }
        if (this.selectedLoreleiHairAccessories !== "none") {
          previewParams += `&hairAccessories=${this.selectedLoreleiHairAccessories}&hairAccessoriesProbability=100&hairAccessoriesColor=${this.selectedLoreleiHairAccessoriesColor}`;
        } else {
          previewParams += `&hairAccessoriesProbability=0`;
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

        // Redefinir opções específicas do Avataaars
        this.selectedTopStyle = "any";
        this.selectedEyebrowStyle = "any";
        this.selectedFacialHairStyle = "none";
        this.selectedFacialHairColor = "2c1b18";
        this.selectedAccessoryStyle = "none";
        this.selectedAccessoriesColor = "262e33";
        this.selectedClothingStyle = "any";
        this.selectedClothesColor = "262e33";
        this.selectedClothingGraphic = "bat";
        this.selectedHatColor = "262e33";
        this.selectedAvatarStyle = "default";

        // Redefinir opções específicas do Micah
        this.selectedMicahBaseColor = "f9c9b6";
        this.selectedMicahHairStyle = "any";
        this.selectedMicahHairColor = "000000";
        this.selectedMicahEyeStyle = "any";
        this.selectedMicahEyesColor = "000000";
        this.selectedMicahEyeShadowColor = "ffffff";
        this.selectedMicahEyebrowStyle = "any";
        this.selectedMicahEyebrowsColor = "000000";
        this.selectedMicahMouthStyle = "any";
        this.selectedMicahMouthColor = "000000";
        this.selectedMicahNoseStyle = "any";
        this.selectedMicahEarStyle = "any";
        this.selectedMicahFacialHairStyle = "none";
        this.selectedMicahFacialHairColor = "000000";
        this.selectedMicahGlassesStyle = "none";
        this.selectedMicahGlassesColor = "000000";
        this.selectedMicahEarringStyle = "none";
        this.selectedMicahEarringColor = "000000";
        this.selectedMicahShirtStyle = "any";
        this.selectedMicahShirtColor = "6bd9e9";

        // Redefinir opções específicas do Notionists
        this.selectedLipsStyle = "variant01";
        this.selectedBodyIcon = "none";

        // Redefinir opções específicas do Open Peeps
        this.selectedOpenPeepsHead = "short1";
        this.selectedOpenPeepsFace = "smile";
        this.selectedOpenPeepsFacialHair = "none";
        this.selectedOpenPeepsAccessory = "none";
        this.selectedOpenPeepsMask = "none";
        this.selectedOpenPeepsSkinColor = "edb98a";
        this.selectedOpenPeepsHeadContrastColor = "2c1b18";
        this.selectedOpenPeepsClothingColor = "8fa7df";

        // Redefinir opções específicas do Croodles
        this.selectedCroodlesTop = "variant01";
        this.selectedCroodlesTopColor = "000000";
        this.selectedCroodlesFace = "variant01";
        this.selectedCroodlesEyes = "variant01";
        this.selectedCroodlesMouth = "variant01";
        this.selectedCroodlesNose = "variant01";
        this.selectedCroodlesBeard = "none";
        this.selectedCroodlesMustache = "none";
        this.selectedCroodlesBaseColor = "ffffff";

        // Redefinir opções específicas do Lorelei
        this.selectedLoreleiHair = "variant01";
        this.selectedLoreleiHairColor = "2c1b18";
        this.selectedLoreleiHead = "variant01";
        this.selectedLoreleiEyes = "variant01";
        this.selectedLoreleiEyesColor = "000000";
        this.selectedLoreleiEyebrows = "variant01";
        this.selectedLoreleiEyebrowsColor = "000000";
        this.selectedLoreleiMouth = "happy01";
        this.selectedLoreleiMouthColor = "000000";
        this.selectedLoreleiNose = "variant01";
        this.selectedLoreleiNoseColor = "000000";
        this.selectedLoreleiBeard = "none";
        this.selectedLoreleiGlasses = "none";
        this.selectedLoreleiGlassesColor = "000000";
        this.selectedLoreleiEarrings = "none";
        this.selectedLoreleiEarringsColor = "000000";
        this.selectedLoreleiFreckles = "none";
        this.selectedLoreleiFrecklesColor = "000000";
        this.selectedLoreleiHairAccessories = "none";
        this.selectedLoreleiHairAccessoriesColor = "000000";
        this.selectedLoreleiSkinColor = "ffffff";

        // Limpar brincos dos acessórios se estiverem presentes
        this.selectedAccessories = this.selectedAccessories.filter(
          (acc) => !acc.includes("earring"),
        );

        // Reset específico para Notionists
        if (style === "notionists") {
          this.selectedHairStyle = "variant01";
          this.selectedEyeStyle = "variant01";
          this.selectedBrowStyle = "variant01";
          this.selectedLipsStyle = "variant01";
          this.selectedNoseStyle = "variant01";
          this.selectedBodyStyle = "variant01";
          this.selectedBeardStyle = "none";
          this.selectedGestureStyle = "none";
          this.selectedGlassesVariant = "none";
          this.selectedBodyIcon = "none";
        }
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
      const hexColor = event.target.value.replace("#", "");
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
        if (
          this.selectedHairStyle !== "any" &&
          this.selectedHairStyle !== "bald"
        ) {
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
        if (
          this.selectedEarringVariant &&
          this.selectedEarringVariant !== "none"
        ) {
          previewParams += `&earrings=${this.selectedEarringVariant}`;
        }
      } else if (this.selectedStyle === "notionists") {
        previewParams += `&hair=${this.selectedHairStyle}`;
        previewParams += `&lips=${this.selectedLipsStyle}`;
        previewParams += `&nose=${this.selectedNoseStyle}`;
        previewParams += `&brows=${this.selectedBrowStyle}`;
        previewParams += `&eyes=${this.selectedEyeStyle}`;
        previewParams += `&body=${this.selectedBodyStyle}`;
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}&beardProbability=100`;
        }
        if (this.selectedGlassesVariant !== "none") {
          previewParams += `&glasses=${this.selectedGlassesVariant}&glassesProbability=100`;
        }
        if (this.selectedGestureStyle !== "none") {
          previewParams += `&gesture=${this.selectedGestureStyle}&gestureProbability=100`;
        }
      }

      return `https://api.dicebear.com/9.x/${
        this.selectedStyle === "notionists" ? "notionists" : "adventurer"
      }/svg?${previewParams}`;
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
        if (
          this.selectedHairStyle !== "any" &&
          this.selectedHairStyle !== "bald"
        ) {
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
      } else if (this.selectedStyle === "notionists") {
        previewParams += `&hair=${this.selectedHairStyle}`;
        previewParams += `&lips=${this.selectedLipsStyle}`;
        previewParams += `&nose=${this.selectedNoseStyle}`;
        previewParams += `&brows=${this.selectedBrowStyle}`;
        previewParams += `&eyes=${this.selectedEyeStyle}`;
        previewParams += `&body=${this.selectedBodyStyle}`;
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}&beardProbability=100`;
        }
        if (this.selectedGestureStyle !== "none") {
          previewParams += `&gesture=${this.selectedGestureStyle}&gestureProbability=100`;
        }
      }

      return `https://api.dicebear.com/9.x/${
        this.selectedStyle === "notionists" ? "notionists" : "adventurer"
      }/svg?${previewParams}`;
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
        if (
          this.selectedHairStyle !== "any" &&
          this.selectedHairStyle !== "bald"
        ) {
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
        if (
          this.selectedEarringVariant &&
          this.selectedEarringVariant !== "none"
        ) {
          previewParams += `&earrings=${this.selectedEarringVariant}`;
        }
      } else if (this.selectedStyle === "notionists") {
        previewParams += `&hair=${this.selectedHairStyle}`;
        previewParams += `&lips=${this.selectedLipsStyle}`;
        previewParams += `&nose=${this.selectedNoseStyle}`;
        previewParams += `&brows=${this.selectedBrowStyle}`;
        previewParams += `&eyes=${this.selectedEyeStyle}`;
        previewParams += `&body=${this.selectedBodyStyle}`;
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}&beardProbability=100`;
        }
        if (this.selectedGlassesVariant !== "none") {
          previewParams += `&glasses=${this.selectedGlassesVariant}&glassesProbability=100`;
        }
        if (this.selectedGestureStyle !== "none") {
          previewParams += `&gesture=${this.selectedGestureStyle}&gestureProbability=100`;
        }
      }

      return `https://api.dicebear.com/9.x/${
        this.selectedStyle === "notionists" ? "notionists" : "adventurer"
      }/svg?${previewParams}`;
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
        if (
          this.selectedHairStyle !== "any" &&
          this.selectedHairStyle !== "bald"
        ) {
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
      } else if (this.selectedStyle === "notionists") {
        previewParams += `&hair=${this.selectedHairStyle}`;
        previewParams += `&lips=${this.selectedLipsStyle}`;
        previewParams += `&nose=${this.selectedNoseStyle}`;
        previewParams += `&brows=${this.selectedBrowStyle}`;
        previewParams += `&eyes=${this.selectedEyeStyle}`;
        previewParams += `&body=${this.selectedBodyStyle}`;
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}&beardProbability=100`;
        }
        if (this.selectedGlassesVariant !== "none") {
          previewParams += `&glasses=${this.selectedGlassesVariant}&glassesProbability=100`;
        }
        if (this.selectedGestureStyle !== "none") {
          previewParams += `&gesture=${this.selectedGestureStyle}&gestureProbability=100`;
        }
      }

      return `https://api.dicebear.com/9.x/${
        this.selectedStyle === "notionists" ? "notionists" : "adventurer"
      }/svg?${previewParams}`;
    },

    generateEyebrowPreviewUrl(eyebrowValue) {
      // Gerar URL de preview para estilos de sobrancelhas com base nas configurações atuais do avatar
      let previewParams = `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=${this.selectedBackgroundColor}`;

      // Adicionar outras configurações atuais do avatar
      previewParams += `&skinColor=${this.selectedSkinColor}&hairColor=${this.selectedHairColor}`;

      // Adicionar o estilo de sobrancelha específico
      if (eyebrowValue !== "flat") {
        // Usando flat como valor padrão
        previewParams += `&eyebrows=${eyebrowValue}`;
      }

      // Adicionar outras configurações com base no estilo
      if (this.selectedStyle === "adventurer") {
        if (
          this.selectedHairStyle !== "any" &&
          this.selectedHairStyle !== "bald"
        ) {
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
      } else if (this.selectedStyle === "notionists") {
        previewParams += `&hair=${this.selectedHairStyle}`;
        previewParams += `&lips=${this.selectedLipsStyle}`;
        previewParams += `&nose=${this.selectedNoseStyle}`;
        previewParams += `&eyes=${this.selectedEyeStyle}`;
        previewParams += `&body=${this.selectedBodyStyle}`;
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}&beardProbability=100`;
        }
        if (this.selectedGlassesVariant !== "none") {
          previewParams += `&glasses=${this.selectedGlassesVariant}&glassesProbability=100`;
        }
        if (this.selectedGestureStyle !== "none") {
          previewParams += `&gesture=${this.selectedGestureStyle}&gestureProbability=100`;
        }
      }

      return `https://api.dicebear.com/9.x/${
        this.selectedStyle === "notionists" ? "notionists" : "adventurer"
      }/svg?${previewParams}`;
    },

    generateHairPreviewUrl(hairValue) {
      // Gerar URL de preview para estilos de cabelo com base nas configurações atuais do avatar
      let previewParams = `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=${this.selectedBackgroundColor}`;

      // Adicionar outras configurações atuais do avatar
      previewParams += `&skinColor=${this.selectedSkinColor}`;

      // Para o estilo notionists, não incluir hairColor pois não tem variação de cor
      if (this.selectedStyle !== "notionists") {
        previewParams += `&hairColor=${this.selectedHairColor}`;
      }

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
      } else if (this.selectedStyle === "notionists") {
        previewParams += `&lips=${this.selectedLipsStyle}`;
        previewParams += `&nose=${this.selectedNoseStyle}`;
        previewParams += `&brows=${this.selectedBrowStyle}`;
        previewParams += `&eyes=${this.selectedEyeStyle}`;
        previewParams += `&body=${this.selectedBodyStyle}`;
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}&beardProbability=100`;
        }
        if (this.selectedGlassesVariant !== "none") {
          previewParams += `&glasses=${this.selectedGlassesVariant}&glassesProbability=100`;
        }
        if (this.selectedGestureStyle !== "none") {
          previewParams += `&gesture=${this.selectedGestureStyle}&gestureProbability=100`;
        }
      }

      return `https://api.dicebear.com/9.x/${
        this.selectedStyle === "notionists" ? "notionists" : "adventurer"
      }/svg?${previewParams}`;
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
        if (
          this.selectedHairStyle !== "any" &&
          this.selectedHairStyle !== "bald"
        ) {
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
      } else if (this.selectedStyle === "notionists") {
        previewParams += `&hair=${this.selectedHairStyle}`;
        previewParams += `&lips=${this.selectedLipsStyle}`;
        previewParams += `&nose=${this.selectedNoseStyle}`;
        previewParams += `&brows=${this.selectedBrowStyle}`;
        previewParams += `&eyes=${this.selectedEyeStyle}`;
        previewParams += `&body=${this.selectedBodyStyle}`;
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}&beardProbability=100`;
        }
        if (this.selectedGlassesVariant !== "none") {
          previewParams += `&glasses=${this.selectedGlassesVariant}&glassesProbability=100`;
        }
        if (this.selectedGestureStyle !== "none") {
          previewParams += `&gesture=${this.selectedGestureStyle}&gestureProbability=100`;
        }
      }

      return `https://api.dicebear.com/9.x/${
        this.selectedStyle === "notionists" ? "notionists" : "adventurer"
      }/svg?${previewParams}`;
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
        if (
          this.selectedHairStyle !== "any" &&
          this.selectedHairStyle !== "bald"
        ) {
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
      } else if (this.selectedStyle === "notionists") {
        previewParams += `&hair=${this.selectedHairStyle}`;
        previewParams += `&lips=${this.selectedLipsStyle}`;
        previewParams += `&nose=${this.selectedNoseStyle}`;
        previewParams += `&brows=${this.selectedBrowStyle}`;
        previewParams += `&body=${this.selectedBodyStyle}`;
        if (this.selectedBeardStyle !== "none") {
          previewParams += `&beard=${this.selectedBeardStyle}&beardProbability=100`;
        }
        if (this.selectedGlassesVariant !== "none") {
          previewParams += `&glasses=${this.selectedGlassesVariant}&glassesProbability=100`;
        }
        if (this.selectedGestureStyle !== "none") {
          previewParams += `&gesture=${this.selectedGestureStyle}&gestureProbability=100`;
        }
      }

      return `https://api.dicebear.com/9.x/${
        this.selectedStyle === "notionists" ? "notionists" : "adventurer"
      }/svg?${previewParams}`;
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
      this.selectedBeardStyle = "any";
      this.selectedBodyStyle = "default";
      this.selectedIconStyle = "default";
      this.selectedBrowStyle = "flat";
      this.selectedGestureStyle = "hand";
      this.selectedGlassesStyle = "none";
      this.selectedLipsStyle = "any";
      this.selectedNoseStyle = "any";
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
        selectedLipsStyle: this.selectedLipsStyle,
        selectedNoseStyle: this.selectedNoseStyle,
        selectedBeardStyle: this.selectedBeardStyle,
        selectedGestureStyle: this.selectedGestureStyle,
        selectedBodyStyle: this.selectedBodyStyle,
        selectedFaceFeature: this.selectedFaceFeature,
        selectedEarringVariant: this.selectedEarringVariant,
        activeTab: this.activeTab,
      };

      localStorage.setItem(
        `avatar_settings_${userId}`,
        JSON.stringify(settings),
      );
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
          this.selectedSkinColor =
            settings.selectedSkinColor || this.selectedSkinColor;
          this.selectedHairColor =
            settings.selectedHairColor || this.selectedHairColor;
          this.selectedHairStyle =
            settings.selectedHairStyle || this.selectedHairStyle;
          this.selectedEyeStyle =
            settings.selectedEyeStyle || this.selectedEyeStyle;
          this.selectedMouthStyle =
            settings.selectedMouthStyle || this.selectedMouthStyle;
          this.selectedAccessories =
            settings.selectedAccessories || this.selectedAccessories;
          this.selectedBackgroundColor =
            settings.selectedBackgroundColor || this.selectedBackgroundColor;
          this.selectedBeardStyle =
            settings.selectedBeardStyle || this.selectedBeardStyle;
          this.selectedBodyStyle =
            settings.selectedBodyStyle || this.selectedBodyStyle;
          this.selectedIconStyle =
            settings.selectedIconStyle || this.selectedIconStyle;
          this.selectedBrowStyle =
            settings.selectedBrowStyle || this.selectedBrowStyle;
          this.selectedGestureStyle =
            settings.selectedGestureStyle || this.selectedGestureStyle;
          this.selectedGlassesStyle =
            settings.selectedGlassesStyle || this.selectedGlassesStyle;
          this.selectedLipsStyle =
            settings.selectedLipsStyle || this.selectedLipsStyle;
          this.selectedNoseStyle =
            settings.selectedNoseStyle || this.selectedNoseStyle;
          this.selectedBeardStyle =
            settings.selectedBeardStyle || this.selectedBeardStyle;
          this.selectedGestureStyle =
            settings.selectedGestureStyle || this.selectedGestureStyle;
          this.selectedBodyStyle =
            settings.selectedBodyStyle || this.selectedBodyStyle;
          this.selectedFaceFeature =
            settings.selectedFaceFeature || this.selectedFaceFeature;
          this.selectedEarringVariant =
            settings.selectedEarringVariant || this.selectedEarringVariant;
          this.activeTab = settings.activeTab || this.activeTab;

          return true;
        } catch (error) {
          console.error("Erro ao carregar configurações do avatar:", error);
          return false;
        }
      }
      return false;
    },

    // Métodos de navegação por setas nas abas
    scrollTabsLeft() {
      const header = this.$refs.tabsHeader;
      if (header) {
        header.scrollBy({ left: -200, behavior: "smooth" });
      }
    },
    scrollTabsRight() {
      const header = this.$refs.tabsHeader;
      if (header) {
        header.scrollBy({ left: 200, behavior: "smooth" });
      }
    },
    updateArrows() {
      const header = this.$refs.tabsHeader;
      if (header) {
        this.canScrollLeft = header.scrollLeft > 0;
        this.canScrollRight =
          header.scrollLeft + header.clientWidth < header.scrollWidth - 1;
      }
    },

    // Método para detectar a direção do scroll e controlar a visibilidade dos menus
    handleScroll() {
      // Verifica se está em um dispositivo móvel
      if (window.innerWidth <= 768) {
        const currentScrollPosition =
          window.pageYOffset || document.documentElement.scrollTop;

        // Se o scroll estiver indo para baixo, esconde os menus
        if (currentScrollPosition > this.lastScrollTop) {
          document.querySelector(".tabs-nav-wrapper").style.transform =
            "translateY(-100%)";
        }
        // Se o scroll estiver indo para cima, mostra os menus
        else {
          document.querySelector(".tabs-nav-wrapper").style.transform =
            "translateY(0)";
        }

        this.lastScrollTop = currentScrollPosition;
      }
    },

    // Método para inicializar o controle de scroll
    initScrollControl() {
      this.lastScrollTop = 0;

      // Adiciona listener para o evento de scroll
      window.addEventListener("scroll", this.handleScroll, { passive: true });
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

    // Inicializar o controle de scroll para dispositivos móveis
    this.initScrollControl();

    // Atualizar setas de navegação das abas
    this.$nextTick(() => {
      this.updateArrows();
    });
    window.addEventListener("resize", this.updateArrows);
  },

  watch: {
    selectedStyle() {
      this.$nextTick(() => {
        // Resetar scroll e recalcular setas ao trocar estilo
        const header = this.$refs.tabsHeader;
        if (header) header.scrollLeft = 0;
        this.updateArrows();
      });
    },
  },

  beforeUnmount() {
    // Remover o listener de scroll ao destruir o componente
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.updateArrows);
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

.tabs-nav-wrapper {
  display: flex;
  align-items: stretch;
  position: relative;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.tabs-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  padding: 0 8px;
  border: none;
  background: linear-gradient(90deg, #f8f9fa 60%, transparent);
  cursor: pointer;
  color: #495057;
  font-size: 1rem;
  z-index: 2;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.tabs-arrow-right {
  background: linear-gradient(270deg, #f8f9fa 60%, transparent);
}

.tabs-arrow:hover {
  color: #667eea;
  background: linear-gradient(90deg, #e9ecef 60%, transparent);
}

.tabs-arrow-right:hover {
  background: linear-gradient(270deg, #e9ecef 60%, transparent);
}

.tabs-arrow.hidden {
  opacity: 0;
  pointer-events: none;
}

.tabs-header {
  display: flex;
  flex: 1;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tabs-header::-webkit-scrollbar {
  display: none;
}

.tab-button {
  flex: 0 0 auto;
  padding: 15px 14px;
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
  white-space: nowrap;
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
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: inherit;
  mask: conic-gradient(
    from 0deg,
    #000 0deg 90deg,
    #fff 90deg 180deg,
    #000 180deg 270deg,
    #fff 270deg 360deg
  );
  -webkit-mask: conic-gradient(
    from 0deg,
    #000 0deg 90deg,
    #fff 90deg 180deg,
    #000 180deg 270deg,
    #fff 270deg 360deg
  );
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

.action-buttons-inline {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
}

.save-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Estilos responsivos para dispositivos móveis */
@media (max-width: 768px) {
  .avatar-url-display {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons-inline {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons-inline button {
    width: 100%;
    margin-bottom: 10px;
  }

  .save-button-container {
    width: 100%;
  }

  .save-button-container button {
    width: 100%;
  }

  /* Estilos específicos para os tabs em dispositivos móveis */
  .tabs-nav-wrapper {
    position: sticky;
    top: 0;
    z-index: 100;
    transition: transform 0.3s ease;
  }

  .tabs-header {
    flex-wrap: nowrap;
    background: #f8f9fa;
  }

  .tab-button {
    flex: 0 0 auto;
    min-width: 100px;
    padding: 12px 10px;
    font-size: 0.8rem;
  }

  .tabs-arrow {
    min-width: 30px;
    padding: 0 4px;
  }

  /* Adiciona espaço para o conteúdo não ficar atrás do menu fixo */
  .tab-content {
    margin-top: 60px; /* Altura aproximada do menu fixo */
  }
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

.btn-save-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  height: fit-content;
}

.btn-save-header:hover {
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
