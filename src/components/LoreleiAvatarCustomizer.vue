<template>
  <div class="lorelei-customizer">
    <!-- Aba: Cabelo (hair) -->
    <div v-if="activeTab === 'cabelo'" class="tab-pane">
      <h3><i class="fas fa-cut"></i> Cabelo</h3>
      <div class="option-grid">
        <div
          v-for="h in hairStyles"
          :key="h.value"
          class="option-item"
          :class="{ active: selectedLoreleiHair === h.value }"
          @click="$emit('update:selectedLoreleiHair', h.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('hair', h.value, { excludeHair: true })"
              :alt="h.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ h.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Cor do Cabelo (hairColor) -->
    <div v-if="activeTab === 'cor_cabelo'" class="tab-pane">
      <h3><i class="fas fa-palette"></i> Cor do Cabelo</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in commonColors"
            :key="'hair-' + color.value"
            class="color-option"
            :class="{ active: selectedLoreleiHairColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedLoreleiHairColor', color.value)"
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedLoreleiHairColor"
              @input="
                $emit(
                  'update:selectedLoreleiHairColor',
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

    <!-- Aba: Cabeça (head) -->
    <div v-if="activeTab === 'cabeca'" class="tab-pane">
      <h3><i class="fas fa-user-circle"></i> Formato da Cabeça</h3>
      <div class="option-grid">
        <div
          v-for="hd in headStyles"
          :key="hd.value"
          class="option-item"
          :class="{ active: selectedLoreleiHead === hd.value }"
          @click="$emit('update:selectedLoreleiHead', hd.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('head', hd.value, { excludeHead: true })"
              :alt="hd.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ hd.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Olhos (eyes) -->
    <div v-if="activeTab === 'olhos'" class="tab-pane">
      <h3><i class="fas fa-eye"></i> Olhos</h3>
      <div class="option-grid">
        <div
          v-for="e in eyeStyles"
          :key="e.value"
          class="option-item"
          :class="{ active: selectedLoreleiEyes === e.value }"
          @click="$emit('update:selectedLoreleiEyes', e.value)"
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

    <!-- Aba: Cor dos Olhos (eyesColor) -->
    <div v-if="activeTab === 'cor_olhos'" class="tab-pane">
      <h3><i class="fas fa-palette"></i> Cor dos Olhos</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in eyeColors"
            :key="'eye-' + color.value"
            class="color-option"
            :class="{ active: selectedLoreleiEyesColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedLoreleiEyesColor', color.value)"
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedLoreleiEyesColor"
              @input="
                $emit(
                  'update:selectedLoreleiEyesColor',
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

    <!-- Aba: Sobrancelhas (eyebrows) -->
    <div v-if="activeTab === 'sobrancelhas'" class="tab-pane">
      <h3><i class="fas fa-low-vision"></i> Sobrancelhas</h3>
      <div class="option-grid">
        <div
          v-for="eb in eyebrowStyles"
          :key="eb.value"
          class="option-item"
          :class="{ active: selectedLoreleiEyebrows === eb.value }"
          @click="$emit('update:selectedLoreleiEyebrows', eb.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="_preview('eyebrows', eb.value, { excludeEyebrows: true })"
              :alt="eb.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ eb.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Cor das Sobrancelhas -->
    <div v-if="activeTab === 'cor_sobrancelhas'" class="tab-pane">
      <h3><i class="fas fa-palette"></i> Cor das Sobrancelhas</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in commonColors"
            :key="'ebrow-' + color.value"
            class="color-option"
            :class="{ active: selectedLoreleiEyebrowsColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedLoreleiEyebrowsColor', color.value)"
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedLoreleiEyebrowsColor"
              @input="
                $emit(
                  'update:selectedLoreleiEyebrowsColor',
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

    <!-- Aba: Boca (mouth) -->
    <div v-if="activeTab === 'boca'" class="tab-pane">
      <h3><i class="fas fa-smile"></i> Boca</h3>
      <div class="option-grid">
        <div
          v-for="m in mouthStyles"
          :key="m.value"
          class="option-item"
          :class="{ active: selectedLoreleiMouth === m.value }"
          @click="$emit('update:selectedLoreleiMouth', m.value)"
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

    <!-- Aba: Cor da Boca -->
    <div v-if="activeTab === 'cor_boca'" class="tab-pane">
      <h3><i class="fas fa-palette"></i> Cor da Boca</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in mouthColors"
            :key="'mouth-' + color.value"
            class="color-option"
            :class="{ active: selectedLoreleiMouthColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedLoreleiMouthColor', color.value)"
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedLoreleiMouthColor"
              @input="
                $emit(
                  'update:selectedLoreleiMouthColor',
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

    <!-- Aba: Nariz (nose) -->
    <div v-if="activeTab === 'nariz'" class="tab-pane">
      <h3><i class="fas fa-meh-blank"></i> Nariz</h3>
      <div class="option-grid">
        <div
          v-for="n in noseStyles"
          :key="n.value"
          class="option-item"
          :class="{ active: selectedLoreleiNose === n.value }"
          @click="$emit('update:selectedLoreleiNose', n.value)"
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

    <!-- Aba: Barba (beard) -->
    <div v-if="activeTab === 'barba'" class="tab-pane">
      <h3><i class="fas fa-user-tie"></i> Barba</h3>
      <div class="option-grid">
        <div
          v-for="b in beardStyles"
          :key="b.value"
          class="option-item"
          :class="{ active: selectedLoreleiBeard === b.value }"
          @click="$emit('update:selectedLoreleiBeard', b.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="
                _previewProbability('beard', 'beardProbability', b.value, {
                  excludeBeard: true,
                })
              "
              :alt="b.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ b.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Óculos (glasses) -->
    <div v-if="activeTab === 'oculos'" class="tab-pane">
      <h3><i class="fas fa-glasses"></i> Óculos</h3>
      <div class="option-grid">
        <div
          v-for="g in glassesStyles"
          :key="g.value"
          class="option-item"
          :class="{ active: selectedLoreleiGlasses === g.value }"
          @click="$emit('update:selectedLoreleiGlasses', g.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="
                _previewProbability('glasses', 'glassesProbability', g.value, {
                  excludeGlasses: true,
                })
              "
              :alt="g.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ g.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Cor dos Óculos -->
    <div v-if="activeTab === 'cor_oculos'" class="tab-pane">
      <h3><i class="fas fa-palette"></i> Cor dos Óculos</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in commonColors"
            :key="'glasses-' + color.value"
            class="color-option"
            :class="{ active: selectedLoreleiGlassesColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedLoreleiGlassesColor', color.value)"
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedLoreleiGlassesColor"
              @input="
                $emit(
                  'update:selectedLoreleiGlassesColor',
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

    <!-- Aba: Brincos (earrings) -->
    <div v-if="activeTab === 'brincos'" class="tab-pane">
      <h3><i class="fas fa-gem"></i> Brincos</h3>
      <div class="option-grid">
        <div
          v-for="er in earringsStyles"
          :key="er.value"
          class="option-item"
          :class="{ active: selectedLoreleiEarrings === er.value }"
          @click="$emit('update:selectedLoreleiEarrings', er.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="
                _previewProbability(
                  'earrings',
                  'earringsProbability',
                  er.value,
                  { excludeEarrings: true },
                )
              "
              :alt="er.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ er.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Cor dos Brincos -->
    <div v-if="activeTab === 'cor_brincos'" class="tab-pane">
      <h3><i class="fas fa-palette"></i> Cor dos Brincos</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in accessoryColors"
            :key="'earr-' + color.value"
            class="color-option"
            :class="{ active: selectedLoreleiEarringsColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedLoreleiEarringsColor', color.value)"
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedLoreleiEarringsColor"
              @input="
                $emit(
                  'update:selectedLoreleiEarringsColor',
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

    <!-- Aba: Sardas (freckles) -->
    <div v-if="activeTab === 'sardas'" class="tab-pane">
      <h3><i class="fas fa-sun"></i> Sardas</h3>
      <div class="option-grid">
        <div
          v-for="f in frecklesStyles"
          :key="f.value"
          class="option-item"
          :class="{ active: selectedLoreleiFreckles === f.value }"
          @click="$emit('update:selectedLoreleiFreckles', f.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="
                _previewProbability(
                  'freckles',
                  'frecklesProbability',
                  f.value,
                  { excludeFreckles: true },
                )
              "
              :alt="f.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ f.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Acessórios de Cabelo (hairAccessories) -->
    <div v-if="activeTab === 'acessorios_cabelo'" class="tab-pane">
      <h3><i class="fas fa-spa"></i> Acessórios de Cabelo</h3>
      <div class="option-grid">
        <div
          v-for="ha in hairAccessoriesStyles"
          :key="ha.value"
          class="option-item"
          :class="{ active: selectedLoreleiHairAccessories === ha.value }"
          @click="$emit('update:selectedLoreleiHairAccessories', ha.value)"
        >
          <div class="avatar-preview-circle">
            <img
              :src="
                _previewProbability(
                  'hairAccessories',
                  'hairAccessoriesProbability',
                  ha.value,
                  { excludeHairAccessories: true },
                )
              "
              :alt="ha.label"
              class="preview-image"
            />
          </div>
          <span class="option-label">{{ ha.label }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Cor dos Acessórios de Cabelo -->
    <div v-if="activeTab === 'cor_acessorios_cabelo'" class="tab-pane">
      <h3><i class="fas fa-palette"></i> Cor dos Acessórios</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in accessoryColors"
            :key="'hairacc-' + color.value"
            class="color-option"
            :class="{
              active: selectedLoreleiHairAccessoriesColor === color.value,
            }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="
              $emit('update:selectedLoreleiHairAccessoriesColor', color.value)
            "
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedLoreleiHairAccessoriesColor"
              @input="
                $emit(
                  'update:selectedLoreleiHairAccessoriesColor',
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

    <!-- Aba: Cor da Pele (skinColor) -->
    <div v-if="activeTab === 'cor_pele'" class="tab-pane">
      <h3><i class="fas fa-tint"></i> Cor da Pele</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in skinColors"
            :key="'skin-' + color.value"
            class="color-option"
            :class="{ active: selectedLoreleiSkinColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedLoreleiSkinColor', color.value)"
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedLoreleiSkinColor"
              @input="
                $emit(
                  'update:selectedLoreleiSkinColor',
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

    <!-- Aba: Cor do Nariz -->
    <div v-if="activeTab === 'cor_nariz'" class="tab-pane">
      <h3><i class="fas fa-palette"></i> Cor do Nariz</h3>
      <div class="color-section">
        <div class="color-options">
          <div
            v-for="color in skinColors"
            :key="'nose-' + color.value"
            class="color-option"
            :class="{ active: selectedLoreleiNoseColor === color.value }"
            :style="{ backgroundColor: '#' + color.value }"
            @click="$emit('update:selectedLoreleiNoseColor', color.value)"
            :title="color.label"
          ></div>
          <div class="custom-color-picker">
            <input
              type="color"
              :value="'#' + selectedLoreleiNoseColor"
              @input="
                $emit(
                  'update:selectedLoreleiNoseColor',
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
  name: "LoreleiAvatarCustomizer",
  props: {
    activeTab: { type: String, required: true },
    selectedStyle: { type: String, required: true },
    selectedLoreleiHair: { type: String, required: true },
    selectedLoreleiHairColor: { type: String, required: true },
    selectedLoreleiHead: { type: String, required: true },
    selectedLoreleiEyes: { type: String, required: true },
    selectedLoreleiEyesColor: { type: String, required: true },
    selectedLoreleiEyebrows: { type: String, required: true },
    selectedLoreleiEyebrowsColor: { type: String, required: true },
    selectedLoreleiMouth: { type: String, required: true },
    selectedLoreleiMouthColor: { type: String, required: true },
    selectedLoreleiNose: { type: String, required: true },
    selectedLoreleiNoseColor: { type: String, required: true },
    selectedLoreleiBeard: { type: String, required: true },
    selectedLoreleiGlasses: { type: String, required: true },
    selectedLoreleiGlassesColor: { type: String, required: true },
    selectedLoreleiEarrings: { type: String, required: true },
    selectedLoreleiEarringsColor: { type: String, required: true },
    selectedLoreleiFreckles: { type: String, required: true },
    selectedLoreleiFrecklesColor: { type: String, required: true },
    selectedLoreleiHairAccessories: { type: String, required: true },
    selectedLoreleiHairAccessoriesColor: { type: String, required: true },
    selectedLoreleiSkinColor: { type: String, required: true },
    userSessionStore: { type: Object, required: true },
  },
  emits: [
    "update:selectedLoreleiHair",
    "update:selectedLoreleiHairColor",
    "update:selectedLoreleiHead",
    "update:selectedLoreleiEyes",
    "update:selectedLoreleiEyesColor",
    "update:selectedLoreleiEyebrows",
    "update:selectedLoreleiEyebrowsColor",
    "update:selectedLoreleiMouth",
    "update:selectedLoreleiMouthColor",
    "update:selectedLoreleiNose",
    "update:selectedLoreleiNoseColor",
    "update:selectedLoreleiBeard",
    "update:selectedLoreleiGlasses",
    "update:selectedLoreleiGlassesColor",
    "update:selectedLoreleiEarrings",
    "update:selectedLoreleiEarringsColor",
    "update:selectedLoreleiFreckles",
    "update:selectedLoreleiFrecklesColor",
    "update:selectedLoreleiHairAccessories",
    "update:selectedLoreleiHairAccessoriesColor",
    "update:selectedLoreleiSkinColor",
  ],
  data() {
    return {
      // Cabelo (hair): 48 variantes
      hairStyles: [
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
        { value: "variant30", label: "Cabelo 30" },
        { value: "variant31", label: "Cabelo 31" },
        { value: "variant32", label: "Cabelo 32" },
        { value: "variant33", label: "Cabelo 33" },
        { value: "variant34", label: "Cabelo 34" },
        { value: "variant35", label: "Cabelo 35" },
        { value: "variant36", label: "Cabelo 36" },
        { value: "variant37", label: "Cabelo 37" },
        { value: "variant38", label: "Cabelo 38" },
        { value: "variant39", label: "Cabelo 39" },
        { value: "variant40", label: "Cabelo 40" },
        { value: "variant41", label: "Cabelo 41" },
        { value: "variant42", label: "Cabelo 42" },
        { value: "variant43", label: "Cabelo 43" },
        { value: "variant44", label: "Cabelo 44" },
        { value: "variant45", label: "Cabelo 45" },
        { value: "variant46", label: "Cabelo 46" },
        { value: "variant47", label: "Cabelo 47" },
        { value: "variant48", label: "Cabelo 48" },
      ],

      // Cabeça (head): 4 variantes
      headStyles: [
        { value: "variant01", label: "Cabeça 1" },
        { value: "variant02", label: "Cabeça 2" },
        { value: "variant03", label: "Cabeça 3" },
        { value: "variant04", label: "Cabeça 4" },
      ],

      // Olhos (eyes): 24 variantes
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
        { value: "variant17", label: "Olhos 17" },
        { value: "variant18", label: "Olhos 18" },
        { value: "variant19", label: "Olhos 19" },
        { value: "variant20", label: "Olhos 20" },
        { value: "variant21", label: "Olhos 21" },
        { value: "variant22", label: "Olhos 22" },
        { value: "variant23", label: "Olhos 23" },
        { value: "variant24", label: "Olhos 24" },
      ],

      // Sobrancelhas (eyebrows): 13 variantes
      eyebrowStyles: [
        { value: "variant01", label: "Sobrancelha 1" },
        { value: "variant02", label: "Sobrancelha 2" },
        { value: "variant03", label: "Sobrancelha 3" },
        { value: "variant04", label: "Sobrancelha 4" },
        { value: "variant05", label: "Sobrancelha 5" },
        { value: "variant06", label: "Sobrancelha 6" },
        { value: "variant07", label: "Sobrancelha 7" },
        { value: "variant08", label: "Sobrancelha 8" },
        { value: "variant09", label: "Sobrancelha 9" },
        { value: "variant10", label: "Sobrancelha 10" },
        { value: "variant11", label: "Sobrancelha 11" },
        { value: "variant12", label: "Sobrancelha 12" },
        { value: "variant13", label: "Sobrancelha 13" },
      ],

      // Boca (mouth): happy01-happy18, sad01-sad09 = 27 variantes
      mouthStyles: [
        { value: "happy01", label: "Feliz 1" },
        { value: "happy02", label: "Feliz 2" },
        { value: "happy03", label: "Feliz 3" },
        { value: "happy04", label: "Feliz 4" },
        { value: "happy05", label: "Feliz 5" },
        { value: "happy06", label: "Feliz 6" },
        { value: "happy07", label: "Feliz 7" },
        { value: "happy08", label: "Feliz 8" },
        { value: "happy09", label: "Feliz 9" },
        { value: "happy10", label: "Feliz 10" },
        { value: "happy11", label: "Feliz 11" },
        { value: "happy12", label: "Feliz 12" },
        { value: "happy13", label: "Feliz 13" },
        { value: "happy14", label: "Feliz 14" },
        { value: "happy15", label: "Feliz 15" },
        { value: "happy16", label: "Feliz 16" },
        { value: "happy17", label: "Feliz 17" },
        { value: "happy18", label: "Feliz 18" },
        { value: "sad01", label: "Triste 1" },
        { value: "sad02", label: "Triste 2" },
        { value: "sad03", label: "Triste 3" },
        { value: "sad04", label: "Triste 4" },
        { value: "sad05", label: "Triste 5" },
        { value: "sad06", label: "Triste 6" },
        { value: "sad07", label: "Triste 7" },
        { value: "sad08", label: "Triste 8" },
        { value: "sad09", label: "Triste 9" },
      ],

      // Nariz (nose): 6 variantes
      noseStyles: [
        { value: "variant01", label: "Nariz 1" },
        { value: "variant02", label: "Nariz 2" },
        { value: "variant03", label: "Nariz 3" },
        { value: "variant04", label: "Nariz 4" },
        { value: "variant05", label: "Nariz 5" },
        { value: "variant06", label: "Nariz 6" },
      ],

      // Barba (beard): none + 2 variantes
      beardStyles: [
        { value: "none", label: "Sem Barba" },
        { value: "variant01", label: "Barba 1" },
        { value: "variant02", label: "Barba 2" },
      ],

      // Óculos (glasses): none + 5 variantes
      glassesStyles: [
        { value: "none", label: "Sem Óculos" },
        { value: "variant01", label: "Óculos 1" },
        { value: "variant02", label: "Óculos 2" },
        { value: "variant03", label: "Óculos 3" },
        { value: "variant04", label: "Óculos 4" },
        { value: "variant05", label: "Óculos 5" },
      ],

      // Brincos (earrings): none + 3 variantes
      earringsStyles: [
        { value: "none", label: "Sem Brincos" },
        { value: "variant01", label: "Brinco 1" },
        { value: "variant02", label: "Brinco 2" },
        { value: "variant03", label: "Brinco 3" },
      ],

      // Sardas (freckles): none + 1 variante
      frecklesStyles: [
        { value: "none", label: "Sem Sardas" },
        { value: "variant01", label: "Sardas" },
      ],

      // Acessórios de cabelo (hairAccessories): none + flowers
      hairAccessoriesStyles: [
        { value: "none", label: "Nenhum" },
        { value: "flowers", label: "Flores" },
      ],

      // Paletas de cores
      commonColors: [
        { value: "000000", label: "Preto" },
        { value: "2c1b18", label: "Castanho Escuro" },
        { value: "4a312c", label: "Marrom" },
        { value: "724133", label: "Marrom Claro" },
        { value: "a55728", label: "Cobre" },
        { value: "b58143", label: "Loiro Escuro" },
        { value: "d6b370", label: "Loiro" },
        { value: "e8d4a2", label: "Loiro Claro" },
        { value: "c93305", label: "Ruivo" },
        { value: "e35d6a", label: "Rosa" },
        { value: "9747ff", label: "Roxo" },
        { value: "699bf7", label: "Azul" },
        { value: "0fa958", label: "Verde" },
        { value: "ffffff", label: "Branco" },
        { value: "d3d3d3", label: "Cinza" },
      ],

      eyeColors: [
        { value: "000000", label: "Preto" },
        { value: "2c1b18", label: "Castanho Escuro" },
        { value: "724133", label: "Castanho" },
        { value: "a55728", label: "Mel" },
        { value: "1c7ed6", label: "Azul" },
        { value: "2f9e44", label: "Verde" },
        { value: "868e96", label: "Cinza" },
        { value: "495057", label: "Cinza Escuro" },
      ],

      mouthColors: [
        { value: "000000", label: "Preto" },
        { value: "d4554a", label: "Vermelho" },
        { value: "e88ca5", label: "Rosa" },
        { value: "c0392b", label: "Vermelho Escuro" },
        { value: "b5651d", label: "Marrom" },
        { value: "ff6b81", label: "Rosa Claro" },
        { value: "a55728", label: "Cobre" },
      ],

      skinColors: [
        { value: "ffffff", label: "Padrão" },
        { value: "f8d9c4", label: "Clara" },
        { value: "edb98a", label: "Média Clara" },
        { value: "d08b5b", label: "Média" },
        { value: "ae5d29", label: "Morena" },
        { value: "8b5a3c", label: "Escura" },
        { value: "614335", label: "Muito Escura" },
      ],

      accessoryColors: [
        { value: "000000", label: "Preto" },
        { value: "262e33", label: "Cinza Escuro" },
        { value: "868e96", label: "Cinza" },
        { value: "c0c0c0", label: "Prata" },
        { value: "ffd700", label: "Dourado" },
        { value: "e88ca5", label: "Rosa" },
        { value: "1c7ed6", label: "Azul" },
        { value: "c93305", label: "Vermelho" },
        { value: "ffffff", label: "Branco" },
      ],
    };
  },
  methods: {
    /* ===== Helpers DRY ===== */

    _baseParams() {
      return `seed=${this.userSessionStore.getUsuarioId}&radius=50&size=64&backgroundColor=f0f0f0`;
    },

    _buildUrl(extraParams) {
      return `https://api.dicebear.com/9.x/lorelei/svg?${this._baseParams()}${extraParams}&_t=${Date.now()}`;
    },

    /**
     * Parâmetros do avatar atual, excluindo a categoria sendo previsualizada.
     */
    _currentParams({
      excludeHair,
      excludeHairColor,
      excludeHead,
      excludeEyes,
      excludeEyesColor,
      excludeEyebrows,
      excludeEyebrowsColor,
      excludeMouth,
      excludeMouthColor,
      excludeNose,
      excludeNoseColor,
      excludeBeard,
      excludeGlasses,
      excludeGlassesColor,
      excludeEarrings,
      excludeEarringsColor,
      excludeFreckles,
      excludeFrecklesColor,
      excludeHairAccessories,
      excludeHairAccessoriesColor,
      excludeSkinColor,
    } = {}) {
      let p = "";

      if (!excludeHair) p += `&hair=${this.selectedLoreleiHair}`;
      if (!excludeHairColor) p += `&hairColor=${this.selectedLoreleiHairColor}`;
      if (!excludeHead) p += `&head=${this.selectedLoreleiHead}`;
      if (!excludeEyes) p += `&eyes=${this.selectedLoreleiEyes}`;
      if (!excludeEyesColor) p += `&eyesColor=${this.selectedLoreleiEyesColor}`;
      if (!excludeEyebrows) p += `&eyebrows=${this.selectedLoreleiEyebrows}`;
      if (!excludeEyebrowsColor)
        p += `&eyebrowsColor=${this.selectedLoreleiEyebrowsColor}`;
      if (!excludeMouth) p += `&mouth=${this.selectedLoreleiMouth}`;
      if (!excludeMouthColor)
        p += `&mouthColor=${this.selectedLoreleiMouthColor}`;
      if (!excludeNose) p += `&nose=${this.selectedLoreleiNose}`;
      if (!excludeNoseColor) p += `&noseColor=${this.selectedLoreleiNoseColor}`;
      if (!excludeSkinColor) p += `&skinColor=${this.selectedLoreleiSkinColor}`;

      // Barba (com probabilidade)
      if (!excludeBeard) {
        if (this.selectedLoreleiBeard !== "none") {
          p += `&beard=${this.selectedLoreleiBeard}&beardProbability=100`;
        } else {
          p += `&beardProbability=0`;
        }
      }

      // Óculos (com probabilidade)
      if (!excludeGlasses) {
        if (this.selectedLoreleiGlasses !== "none") {
          p += `&glasses=${this.selectedLoreleiGlasses}&glassesProbability=100`;
          if (!excludeGlassesColor)
            p += `&glassesColor=${this.selectedLoreleiGlassesColor}`;
        } else {
          p += `&glassesProbability=0`;
        }
      }

      // Brincos (com probabilidade)
      if (!excludeEarrings) {
        if (this.selectedLoreleiEarrings !== "none") {
          p += `&earrings=${this.selectedLoreleiEarrings}&earringsProbability=100`;
          if (!excludeEarringsColor)
            p += `&earringsColor=${this.selectedLoreleiEarringsColor}`;
        } else {
          p += `&earringsProbability=0`;
        }
      }

      // Sardas (com probabilidade)
      if (!excludeFreckles) {
        if (this.selectedLoreleiFreckles !== "none") {
          p += `&freckles=${this.selectedLoreleiFreckles}&frecklesProbability=100`;
          if (!excludeFrecklesColor)
            p += `&frecklesColor=${this.selectedLoreleiFrecklesColor}`;
        } else {
          p += `&frecklesProbability=0`;
        }
      }

      // Acessórios de cabelo (com probabilidade)
      if (!excludeHairAccessories) {
        if (this.selectedLoreleiHairAccessories !== "none") {
          p += `&hairAccessories=${this.selectedLoreleiHairAccessories}&hairAccessoriesProbability=100`;
          if (!excludeHairAccessoriesColor)
            p += `&hairAccessoriesColor=${this.selectedLoreleiHairAccessoriesColor}`;
        } else {
          p += `&hairAccessoriesProbability=0`;
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

    _previewProbability(paramName, probabilityParam, value, excludeKey) {
      let extra = "";
      if (value !== "none") {
        extra += `&${paramName}=${value}&${probabilityParam}=100`;
      } else {
        extra += `&${probabilityParam}=0`;
      }
      extra += this._currentParams(excludeKey);
      return this._buildUrl(extra);
    },
  },
};
</script>

<style scoped>
.lorelei-customizer {
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
