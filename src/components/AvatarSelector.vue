<template>
  <div class="avatar-selector">
    <p class="tab-description">Selecione um avatar para seu perfil:</p>

    <!-- Seletor de categoria -->
    <div class="category-selector">
      <div class="category-tabs">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="[
            'category-tab',
            { active: selectedCategory === category.id },
          ]"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Grade de avatares da categoria selecionada -->
    <div class="avatars-grid">
      <div
        v-for="avatar in filteredAvatars"
        :key="avatar.id"
        class="avatar-item"
        :class="{ selected: selectedAvatar === avatar.url }"
        @click="selectAvatar(avatar.id)"
        :title="avatar.name"
      >
        <div class="avatar-preview">
          <img :src="avatar.url" :alt="avatar.name" class="avatar-img" />
        </div>
        <div class="avatar-name">{{ avatar.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AvatarSelector",
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      selectedAvatar: this.modelValue,
      selectedCategory: "all", // Categoria selecionada
      categories: [
        { id: "all", name: "Todos" },
        { id: "abstract", name: "Abstratos" },
        { id: "people", name: "Pessoas" },
        { id: "animals", name: "Gatos" },
        { id: "clothing", name: "Roupas" },
        { id: "objects", name: "Polegares" },
        { id: "symbols", name: "Símbolos" },
        { id: "nature", name: "Natureza" },
        { id: "food", name: "Comida" },
        { id: "sports", name: "Esportes" },
        { id: "technology", name: "Tecnologia" },
        { id: "travel", name: "Viagem" },
        { id: "fantasy", name: "Fantasia" },
        { id: "robots", name: "Robôs" },
        { id: "cartoon", name: "Desenho" },
        { id: "geometric", name: "Geométrico" },
        { id: "emoji", name: "Emoji" },
        { id: "art", name: "Arte" },
        { id: "game", name: "Jogos" },
        { id: "music", name: "Música" },
      ],
      avatars: [
        // === DiceBear - Estilos Abstratos ===
        // Estilo Shapes
        {
          id: "avatar-1",
          name: "Formas Abstrato 1",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/shapes/svg?seed=abstract1&backgroundColor=264653,2a9d8f&radius=50&size=128",
        },
        {
          id: "avatar-2",
          name: "Formas Abstrato 2",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/shapes/svg?seed=abstract2&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-3",
          name: "Formas Abstrato 3",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/shapes/svg?seed=abstract3&backgroundColor=fa709a,fee140&radius=50&size=128",
        },

        // Estilo Avataaars - Categoria: people
        {
          id: "avatar-4",
          name: "Avatar Personagem 1",
          category: "people",
          url: "https://api.dicebear.com/7.x/avataaars/svg?seed=4&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-5",
          name: "Avatar Personagem 2",
          category: "people",
          url: "https://api.dicebear.com/7.x/avataaars/svg?seed=5&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },
        {
          id: "avatar-6",
          name: "Avatar Personagem 3",
          category: "people",
          url: "https://api.dicebear.com/7.x/avataaars/svg?seed=6&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },

        // Estilo Bottts - Categoria: robots
        {
          id: "avatar-7",
          name: "Avatar Bot 1",
          category: "robots",
          url: "https://api.dicebear.com/7.x/bottts/svg?seed=7&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-8",
          name: "Avatar Bot 2",
          category: "robots",
          url: "https://api.dicebear.com/7.x/bottts/svg?seed=8&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-9",
          name: "Avatar Bot 3",
          category: "robots",
          url: "https://api.dicebear.com/7.x/bottts/svg?seed=9&backgroundColor=fa709a,fee140&radius=50&size=128",
        },

        // Estilo Micah - Categoria: cartoon
        {
          id: "avatar-10",
          name: "Avatar Micah 1",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/micah/svg?seed=10&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-11",
          name: "Avatar Micah 2",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/micah/svg?seed=11&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-12",
          name: "Avatar Micah 3",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/micah/svg?seed=12&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },

        // Estilo Miniavs - Categoria: cartoon
        {
          id: "avatar-13",
          name: "Avatar Miniavs 1",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/miniavs/svg?seed=13&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-14",
          name: "Avatar Miniavs 2",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/miniavs/svg?seed=14&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-15",
          name: "Avatar Miniavs 3",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/miniavs/svg?seed=15&backgroundColor=f83600,f9d423&radius=50&size=128",
        },

        // Estilo Notionists - Categoria: people
        {
          id: "avatar-16",
          name: "Avatar Notionists 1",
          category: "people",
          url: "https://api.dicebear.com/7.x/notionists/svg?seed=16&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-17",
          name: "Avatar Notionists 2",
          category: "people",
          url: "https://api.dicebear.com/7.x/notionists/svg?seed=17&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-18",
          name: "Avatar Notionists 3",
          category: "people",
          url: "https://api.dicebear.com/7.x/notionists/svg?seed=18&backgroundColor=a8edea,fed6e3&radius=50&size=128",
        },

        // Estilo Open Peeps - Categoria: people
        {
          id: "avatar-19",
          name: "Avatar Open Peeps 1",
          category: "people",
          url: "https://api.dicebear.com/7.x/open-peeps/svg?seed=19&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-20",
          name: "Avatar Open Peeps 2",
          category: "people",
          url: "https://api.dicebear.com/7.x/open-peeps/svg?seed=20&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-21",
          name: "Avatar Open Peeps 3",
          category: "people",
          url: "https://api.dicebear.com/7.x/open-peeps/svg?seed=21&backgroundColor=fa709a,fee140&radius=50&size=128",
        },

        // Estilo Big Ears - Categoria: cartoon
        {
          id: "avatar-22",
          name: "Avatar Big Ears 1",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/big-ears/svg?seed=22&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-23",
          name: "Avatar Big Ears 2",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/big-ears/svg?seed=23&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-24",
          name: "Avatar Big Ears 3",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/big-ears/svg?seed=24&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },

        // Estilo Fun Emoji - Categoria: emoji
        {
          id: "avatar-25",
          name: "Avatar Fun Emoji 1",
          category: "emoji",
          url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=25&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-26",
          name: "Avatar Fun Emoji 2",
          category: "emoji",
          url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=26&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-27",
          name: "Avatar Fun Emoji 3",
          category: "emoji",
          url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=27&backgroundColor=f83600,f9d423&radius=50&size=128",
        },

        // Estilo Pixel Art - Categoria: game (jogos retro)
        {
          id: "avatar-28",
          name: "Jogador Pixel 1",
          category: "game",
          url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=player1&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-29",
          name: "Jogador Pixel 2",
          category: "game",
          url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=player2&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-30",
          name: "Jogador Pixel 3",
          category: "game",
          url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=player3&backgroundColor=fa709a,fee140&radius=50&size=128",
        },

        // Estilo Croodles - Categoria: cartoon
        {
          id: "avatar-31",
          name: "Avatar Croodles 1",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/croodles/svg?seed=31&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-32",
          name: "Avatar Croodles 2",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/croodles/svg?seed=32&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-33",
          name: "Avatar Croodles 3",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/croodles/svg?seed=33&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },

        // Estilo Croodles Neutral - Categoria: cartoon
        {
          id: "avatar-34",
          name: "Avatar Croodles Neutral 1",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/croodles-neutral/svg?seed=34&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-35",
          name: "Avatar Croodles Neutral 2",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/croodles-neutral/svg?seed=35&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-36",
          name: "Avatar Croodles Neutral 3",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/croodles-neutral/svg?seed=36&backgroundColor=f83600,f9d423&radius=50&size=128",
        },

        // Estilo Icons - Categoria: symbols
        {
          id: "avatar-37",
          name: "Avatar Icons 1",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=37&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-38",
          name: "Avatar Icons 2",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=38&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-39",
          name: "Avatar Icons 3",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=39&backgroundColor=fa709a,fee140&radius=50&size=128",
        },

        // Estilo Identicon - Categoria: geometric
        {
          id: "avatar-40",
          name: "Avatar Identicon 1",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=40&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-41",
          name: "Avatar Identicon 2",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=41&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-42",
          name: "Avatar Identicon 3",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=42&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },

        // Estilo Big Smile - Categoria: emoji
        {
          id: "avatar-43",
          name: "Avatar Big Smile 1",
          category: "emoji",
          url: "https://api.dicebear.com/7.x/big-smile/svg?seed=43&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-44",
          name: "Avatar Big Smile 2",
          category: "emoji",
          url: "https://api.dicebear.com/7.x/big-smile/svg?seed=44&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-45",
          name: "Avatar Big Smile 3",
          category: "emoji",
          url: "https://api.dicebear.com/7.x/big-smile/svg?seed=45&backgroundColor=f83600,f9d423&radius=50&size=128",
        },

        // Estilo Parfait - Categoria: food
        {
          id: "avatar-46",
          name: "Avatar Parfait 1",
          category: "food",
          url: "https://api.dicebear.com/7.x/parfait/svg?seed=46&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-47",
          name: "Avatar Parfait 2",
          category: "food",
          url: "https://api.dicebear.com/7.x/parfait/svg?seed=47&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-48",
          name: "Avatar Parfait 3",
          category: "food",
          url: "https://api.dicebear.com/7.x/parfait/svg?seed=48&backgroundColor=fa709a,fee140&radius=50&size=128",
        },

        // Estilo Adventure - Categoria: travel
        {
          id: "avatar-49",
          name: "Avatar Adventure 1",
          category: "travel",
          url: "https://api.dicebear.com/7.x/adventurer/svg?seed=49&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-50",
          name: "Avatar Adventure 2",
          category: "travel",
          url: "https://api.dicebear.com/7.x/adventurer/svg?seed=50&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-51",
          name: "Avatar Adventure 3",
          category: "travel",
          url: "https://api.dicebear.com/7.x/adventurer/svg?seed=51&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },

        // Avatares diversos categorizados
        {
          id: "avatar-52",
          name: "Avatar Big Smile Transparente",
          category: "emoji",
          url: "https://api.dicebear.com/7.x/big-smile-transparent/svg?seed=52&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-53",
          name: "Avatar Bots",
          category: "robots",
          url: "https://api.dicebear.com/7.x/bots/svg?seed=53&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-54",
          name: "Personagem NFT",
          category: "game",
          url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=nft1&backgroundColor=f83600,f9d423&radius=50&size=128",
        },
        {
          id: "avatar-55",
          name: "Avatar Human Avatar",
          category: "people",
          url: "https://api.dicebear.com/7.x/human-avatar/svg?seed=55&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-56",
          name: "Avatar Male Avatar",
          category: "people",
          url: "https://api.dicebear.com/7.x/male/svg?seed=56&backgroundColor=fa709a,fee140&radius=50&size=128",
        },
        {
          id: "avatar-57",
          name: "Avatar Female Avatar",
          category: "people",
          url: "https://api.dicebear.com/7.x/female/svg?seed=57&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-58",
          name: "Avatar Thumbs",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=58&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },

        // Estilo Adventure - Categoria: people
        {
          id: "avatar-59",
          name: "Avatar Adventure 1",
          category: "people",
          url: "https://api.dicebear.com/7.x/adventurer/svg?seed=59&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-60",
          name: "Avatar Adventure 2",
          category: "people",
          url: "https://api.dicebear.com/7.x/adventurer/svg?seed=60&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-61",
          name: "Avatar Adventure 3",
          category: "people",
          url: "https://api.dicebear.com/7.x/adventurer/svg?seed=61&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },

        // Estilo Big Ears - Categoria: cartoon
        {
          id: "avatar-62",
          name: "Avatar Big Ears 1",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/big-ears/svg?seed=62&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-63",
          name: "Avatar Big Ears 2",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/big-ears/svg?seed=63&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-64",
          name: "Avatar Big Ears 3",
          category: "cartoon",
          url: "https://api.dicebear.com/7.x/big-ears/svg?seed=64&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },

        // Estilo Big Smile - Categoria: people
        {
          id: "avatar-65",
          name: "Avatar Big Smile 1",
          category: "people",
          url: "https://api.dicebear.com/7.x/big-smile/svg?seed=65&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-66",
          name: "Avatar Big Smile 2",
          category: "people",
          url: "https://api.dicebear.com/7.x/big-smile/svg?seed=66&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-67",
          name: "Avatar Big Smile 3",
          category: "people",
          url: "https://api.dicebear.com/7.x/big-smile/svg?seed=67&backgroundColor=f83600,f9d423&radius=50&size=128",
        },

        // Estilo Bottts Neutral - Categoria: robots
        {
          id: "avatar-68",
          name: "Avatar Bottts Neutral 1",
          category: "robots",
          url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=68&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-69",
          name: "Avatar Bottts Neutral 2",
          category: "robots",
          url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=69&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-70",
          name: "Avatar Bottts Neutral 3",
          category: "robots",
          url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=70&backgroundColor=f83600,f9d423&radius=50&size=128",
        },

        // Estilo Croodles - Categoria: people
        {
          id: "avatar-71",
          name: "Avatar Croodles 1",
          category: "people",
          url: "https://api.dicebear.com/7.x/croodles/svg?seed=71&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-72",
          name: "Avatar Croodles 2",
          category: "people",
          url: "https://api.dicebear.com/7.x/croodles/svg?seed=72&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-73",
          name: "Avatar Croodles 3",
          category: "people",
          url: "https://api.dicebear.com/7.x/croodles/svg?seed=73&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },

        // Estilo Croodles Neutral - Categoria: people
        {
          id: "avatar-74",
          name: "Avatar Croodles Neutral 1",
          category: "people",
          url: "https://api.dicebear.com/7.x/croodles-neutral/svg?seed=74&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-75",
          name: "Avatar Croodles Neutral 2",
          category: "people",
          url: "https://api.dicebear.com/7.x/croodles-neutral/svg?seed=75&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-76",
          name: "Avatar Croodles Neutral 3",
          category: "people",
          url: "https://api.dicebear.com/7.x/croodles-neutral/svg?seed=76&backgroundColor=f83600,f9d423&radius=50&size=128",
        },

        // Estilo Icons - Categoria: symbols
        {
          id: "avatar-77",
          name: "Avatar Icons 1",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=77&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-78",
          name: "Avatar Icons 2",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=78&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-79",
          name: "Avatar Icons 3",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=79&backgroundColor=fa709a,fee140&radius=50&size=128",
        },
        {
          id: "avatar-104",
          name: "Avatar Icons 4",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=104&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-105",
          name: "Avatar Icons 5",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=105&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },
        {
          id: "avatar-106",
          name: "Avatar Icons 6",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=106&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-107",
          name: "Avatar Icons 7",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=107&backgroundColor=a8edea,fed6e3&radius=50&size=128",
        },
        {
          id: "avatar-108",
          name: "Avatar Icons 8",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=108&backgroundColor=f83600,f9d423&radius=50&size=128",
        },
        {
          id: "avatar-109",
          name: "Avatar Icons 9",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=109&backgroundColor=4e54c8,8f94fb&radius=50&size=128",
        },
        {
          id: "avatar-110",
          name: "Avatar Icons 10",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=110&backgroundColor=757F9A,D7DDE8&radius=50&size=128",
        },
        {
          id: "avatar-111",
          name: "Avatar Icons 11",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=111&backgroundColor=00d2ff,3a47d5&radius=50&size=128",
        },
        {
          id: "avatar-112",
          name: "Avatar Icons 12",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=112&backgroundColor=ff6e7f,bfe9ff&radius=50&size=128",
        },
        {
          id: "avatar-113",
          name: "Avatar Icons 13",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=113&backgroundColor=134e5e,71b280&radius=50&size=128",
        },
        {
          id: "avatar-114",
          name: "Avatar Icons 14",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=114&backgroundColor=15b638,0575E6&radius=50&size=128",
        },
        {
          id: "avatar-115",
          name: "Avatar Icons 15",
          category: "symbols",
          url: "https://api.dicebear.com/7.x/icons/svg?seed=115&backgroundColor=fa709a,fee140&radius=50&size=128",
        },

        // Estilo Rings
        {
          id: "avatar-80",
          name: "Anéis Abstrato 1",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=rings1&backgroundColor=264653,2a9d8f&radius=50&size=128",
        },
        {
          id: "avatar-81",
          name: "Anéis Abstrato 2",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=rings2&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-82",
          name: "Anéis Abstrato 3",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=rings3&backgroundColor=fa709a,fee140&radius=50&size=128",
        },

        // Mais Shapes
        {
          id: "avatar-83",
          name: "Formas Abstrato 4",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/shapes/svg?seed=shapes4&backgroundColor=f83600,f9d423&radius=50&size=128",
        },
        {
          id: "avatar-84",
          name: "Formas Abstrato 5",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/shapes/svg?seed=shapes5&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-85",
          name: "Formas Abstrato 6",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/shapes/svg?seed=shapes6&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },

        // Estilo Open Peeps - Categoria: people
        {
          id: "avatar-86",
          name: "Avatar Open Peeps 1",
          category: "people",
          url: "https://api.dicebear.com/7.x/open-peeps/svg?seed=86&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-87",
          name: "Avatar Open Peeps 2",
          category: "people",
          url: "https://api.dicebear.com/7.x/open-peeps/svg?seed=87&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-88",
          name: "Avatar Open Peeps 3",
          category: "people",
          url: "https://api.dicebear.com/7.x/open-peeps/svg?seed=88&backgroundColor=fa709a,fee140&radius=50&size=128",
        },

        // Estilo Parfait - Categoria: food
        {
          id: "avatar-89",
          name: "Avatar Parfait 1",
          category: "food",
          url: "https://api.dicebear.com/7.x/parfait/svg?seed=89&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-90",
          name: "Avatar Parfait 2",
          category: "food",
          url: "https://api.dicebear.com/7.x/parfait/svg?seed=90&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-91",
          name: "Avatar Parfait 3",
          category: "food",
          url: "https://api.dicebear.com/7.x/parfait/svg?seed=91&backgroundColor=fa709a,fee140&radius=50&size=128",
        },

        // Estilo Identicon
        {
          id: "avatar-92",
          name: "Identicon 1",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=ident1&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-93",
          name: "Identicon 2",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=ident2&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-94",
          name: "Identicon 3",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=ident3&backgroundColor=f83600,f9d423&radius=50&size=128",
        },

        // Mais Rings
        {
          id: "avatar-95",
          name: "Anéis Abstrato 4",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=rings4&backgroundColor=264653,e9c46a&radius=50&size=128",
        },
        {
          id: "avatar-96",
          name: "Anéis Abstrato 5",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=rings5&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },
        {
          id: "avatar-97",
          name: "Anéis Abstrato 6",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=rings6&backgroundColor=667eea,4facfe&radius=50&size=128",
        },

        // Estilo Abstract
        {
          id: "avatar-98",
          name: "Abstrato 1",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/abstract/svg?seed=abs1&backgroundColor=667eea,f093fb&radius=50&size=128",
        },
        {
          id: "avatar-99",
          name: "Abstrato 2",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/abstract/svg?seed=abs2&backgroundColor=fa709a,43e97b&radius=50&size=128",
        },
        {
          id: "avatar-100",
          name: "Abstrato 3",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/abstract/svg?seed=abs3&backgroundColor=264653,e9c46a&radius=50&size=128",
        },

        // Estilo Tidy People - Categoria: people
        {
          id: "avatar-101",
          name: "Avatar Tidy People 1",
          category: "people",
          url: "https://api.dicebear.com/7.x/tidy-persons/svg?seed=101&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-102",
          name: "Avatar Tidy People 2",
          category: "people",
          url: "https://api.dicebear.com/7.x/tidy-persons/svg?seed=102&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-103",
          name: "Avatar Tidy People 3",
          category: "people",
          url: "https://api.dicebear.com/7.x/tidy-persons/svg?seed=103&backgroundColor=f83600,f9d423&radius=50&size=128",
        },

        // Estilo Thumbs - Categoria: objects
        {
          id: "avatar-116",
          name: "Avatar Objeto 1",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=116&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128",
        },
        {
          id: "avatar-117",
          name: "Avatar Objeto 2",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=117&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-118",
          name: "Avatar Objeto 3",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=118&backgroundColor=fa709a,fee140&radius=50&size=128",
        },
        {
          id: "avatar-119",
          name: "Avatar Objeto 4",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=119&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-120",
          name: "Avatar Objeto 5",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=120&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },
        {
          id: "avatar-121",
          name: "Avatar Objeto 6",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=121&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-122",
          name: "Avatar Objeto 7",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=122&backgroundColor=a8edea,fed6e3&radius=50&size=128",
        },
        {
          id: "avatar-123",
          name: "Avatar Objeto 8",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=123&backgroundColor=f83600,f9d423&radius=50&size=128",
        },
        {
          id: "avatar-124",
          name: "Avatar Objeto 9",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=124&backgroundColor=4e54c8,8f94fb&radius=50&size=128",
        },
        {
          id: "avatar-125",
          name: "Avatar Objeto 10",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=125&backgroundColor=757F9A,D7DDE8&radius=50&size=128",
        },
        {
          id: "avatar-126",
          name: "Avatar Objeto 11",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=126&backgroundColor=00d2ff,3a47d5&radius=50&size=128",
        },
        {
          id: "avatar-127",
          name: "Avatar Objeto 12",
          category: "objects",
          url: "https://api.dicebear.com/7.x/thumbs/svg?seed=127&backgroundColor=134e5e,71b280&radius=50&size=128",
        },

        // === BIBLIOTECA: RoboHash - Categoria: robots ===
        {
          id: "avatar-128",
          name: "Robô RoboHash 1",
          category: "robots",
          url: "https://robohash.org/robot1.png?set=set1&size=128x128&bgset=bg1",
        },
        {
          id: "avatar-129",
          name: "Robô RoboHash 2",
          category: "robots",
          url: "https://robohash.org/robot2.png?set=set1&size=128x128&bgset=bg2",
        },
        {
          id: "avatar-130",
          name: "Robô RoboHash 3",
          category: "robots",
          url: "https://robohash.org/robot3.png?set=set2&size=128x128&bgset=bg1",
        },
        {
          id: "avatar-131",
          name: "Robô RoboHash 4",
          category: "robots",
          url: "https://robohash.org/robot4.png?set=set2&size=128x128&bgset=bg2",
        },
        {
          id: "avatar-132",
          name: "Robô RoboHash 5",
          category: "robots",
          url: "https://robohash.org/robot5.png?set=set3&size=128x128&bgset=bg1",
        },
        {
          id: "avatar-133",
          name: "Gato 1",
          category: "animals",
          url: "https://robohash.org/cat1.png?set=set4&size=128x128",
        },
        {
          id: "avatar-134",
          name: "Gato 2",
          category: "animals",
          url: "https://robohash.org/cat2.png?set=set4&size=128x128",
        },
        {
          id: "avatar-177",
          name: "Gato 3",
          category: "animals",
          url: "https://robohash.org/cat3.png?set=set4&size=128x128",
        },
        {
          id: "avatar-178",
          name: "Gato 4",
          category: "animals",
          url: "https://robohash.org/cat4.png?set=set4&size=128x128",
        },
        {
          id: "avatar-179",
          name: "Gato 5",
          category: "animals",
          url: "https://robohash.org/cat5.png?set=set4&size=128x128",
        },
        {
          id: "avatar-180",
          name: "Gato 6",
          category: "animals",
          url: "https://robohash.org/cat6.png?set=set4&size=128x128",
        },
        {
          id: "avatar-181",
          name: "Gato 7",
          category: "animals",
          url: "https://robohash.org/cat7.png?set=set4&size=128x128",
        },
        {
          id: "avatar-182",
          name: "Gato 8",
          category: "animals",
          url: "https://robohash.org/cat8.png?set=set4&size=128x128",
        },
        {
          id: "avatar-183",
          name: "Gato 9",
          category: "animals",
          url: "https://robohash.org/cat9.png?set=set4&size=128x128",
        },
        {
          id: "avatar-184",
          name: "Gato 10",
          category: "animals",
          url: "https://robohash.org/cat10.png?set=set4&size=128x128",
        },
        {
          id: "avatar-185",
          name: "Gato 11",
          category: "animals",
          url: "https://robohash.org/cat11.png?set=set4&size=128x128",
        },
        {
          id: "avatar-186",
          name: "Gato 12",
          category: "animals",
          url: "https://robohash.org/cat12.png?set=set4&size=128x128",
        },
        {
          id: "avatar-187",
          name: "Gato 13",
          category: "animals",
          url: "https://robohash.org/cat13.png?set=set4&size=128x128",
        },
        {
          id: "avatar-188",
          name: "Gato 14",
          category: "animals",
          url: "https://robohash.org/cat14.png?set=set4&size=128x128",
        },
        {
          id: "avatar-189",
          name: "Gato 15",
          category: "animals",
          url: "https://robohash.org/cat15.png?set=set4&size=128x128",
        },

        // === Mais Animais Variados - RoboHash ===
        {
          id: "avatar-190",
          name: "Cachorro 1",
          category: "animals",
          url: "https://robohash.org/dog1.png?set=set4&size=128x128",
        },
        {
          id: "avatar-191",
          name: "Cachorro 2",
          category: "animals",
          url: "https://robohash.org/dog2.png?set=set4&size=128x128",
        },
        {
          id: "avatar-192",
          name: "Cachorro 3",
          category: "animals",
          url: "https://robohash.org/dog3.png?set=set4&size=128x128",
        },
        {
          id: "avatar-193",
          name: "Cachorro 4",
          category: "animals",
          url: "https://robohash.org/dog4.png?set=set4&size=128x128",
        },
        {
          id: "avatar-194",
          name: "Cachorro 5",
          category: "animals",
          url: "https://robohash.org/dog5.png?set=set4&size=128x128",
        },
        {
          id: "avatar-195",
          name: "Urso 1",
          category: "animals",
          url: "https://robohash.org/bear1.png?set=set4&size=128x128",
        },
        {
          id: "avatar-196",
          name: "Urso 2",
          category: "animals",
          url: "https://robohash.org/bear2.png?set=set4&size=128x128",
        },
        {
          id: "avatar-197",
          name: "Urso 3",
          category: "animals",
          url: "https://robohash.org/bear3.png?set=set4&size=128x128",
        },
        {
          id: "avatar-198",
          name: "Coelho 1",
          category: "animals",
          url: "https://robohash.org/rabbit1.png?set=set4&size=128x128",
        },
        {
          id: "avatar-199",
          name: "Coelho 2",
          category: "animals",
          url: "https://robohash.org/rabbit2.png?set=set4&size=128x128",
        },
        {
          id: "avatar-200",
          name: "Coelho 3",
          category: "animals",
          url: "https://robohash.org/rabbit3.png?set=set4&size=128x128",
        },
        {
          id: "avatar-201",
          name: "Raposa 1",
          category: "animals",
          url: "https://robohash.org/fox1.png?set=set4&size=128x128",
        },
        {
          id: "avatar-202",
          name: "Raposa 2",
          category: "animals",
          url: "https://robohash.org/fox2.png?set=set4&size=128x128",
        },
        {
          id: "avatar-203",
          name: "Panda 1",
          category: "animals",
          url: "https://robohash.org/panda1.png?set=set4&size=128x128",
        },
        {
          id: "avatar-204",
          name: "Panda 2",
          category: "animals",
          url: "https://robohash.org/panda2.png?set=set4&size=128x128",
        },
        {
          id: "avatar-205",
          name: "Leão 1",
          category: "animals",
          url: "https://robohash.org/lion1.png?set=set4&size=128x128",
        },
        {
          id: "avatar-206",
          name: "Leão 2",
          category: "animals",
          url: "https://robohash.org/lion2.png?set=set4&size=128x128",
        },
        {
          id: "avatar-207",
          name: "Tigre 1",
          category: "animals",
          url: "https://robohash.org/tiger1.png?set=set4&size=128x128",
        },
        {
          id: "avatar-208",
          name: "Tigre 2",
          category: "animals",
          url: "https://robohash.org/tiger2.png?set=set4&size=128x128",
        },
        {
          id: "avatar-209",
          name: "Lobo 1",
          category: "animals",
          url: "https://robohash.org/wolf1.png?set=set4&size=128x128",
        },
        {
          id: "avatar-210",
          name: "Lobo 2",
          category: "animals",
          url: "https://robohash.org/wolf2.png?set=set4&size=128x128",
        },
        {
          id: "avatar-211",
          name: "Elefante 1",
          category: "animals",
          url: "https://robohash.org/elephant1.png?set=set4&size=128x128",
        },
        {
          id: "avatar-212",
          name: "Elefante 2",
          category: "animals",
          url: "https://robohash.org/elephant2.png?set=set4&size=128x128",
        },
        {
          id: "avatar-213",
          name: "Macaco 1",
          category: "animals",
          url: "https://robohash.org/monkey1.png?set=set4&size=128x128",
        },
        {
          id: "avatar-214",
          name: "Macaco 2",
          category: "animals",
          url: "https://robohash.org/monkey2.png?set=set4&size=128x128",
        },
        {
          id: "avatar-215",
          name: "Pinguim 1",
          category: "animals",
          url: "https://robohash.org/penguin1.png?set=set4&size=128x128",
        },
        {
          id: "avatar-216",
          name: "Pinguim 2",
          category: "animals",
          url: "https://robohash.org/penguin2.png?set=set4&size=128x128",
        },

        {
          id: "avatar-135",
          name: "Monstro RoboHash",
          category: "fantasy",
          url: "https://robohash.org/monster1.png?set=set2&size=128x128",
        },
        {
          id: "avatar-136",
          name: "Monstro RoboHash 2",
          category: "fantasy",
          url: "https://robohash.org/monster2.png?set=set3&size=128x128",
        },

        // === DiceBear - Categoria: geometric (estilos geométricos) ===
        {
          id: "avatar-137",
          name: "Geométrico 1",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=geo1&backgroundColor=264653,2a9d8f&radius=50&size=128",
        },
        {
          id: "avatar-138",
          name: "Geométrico 2",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=geo2&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-139",
          name: "Geométrico 3",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=geo3&backgroundColor=fa709a,fee140&radius=50&size=128",
        },
        {
          id: "avatar-140",
          name: "Geométrico 4",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=geo4&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-141",
          name: "Geométrico 5",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=geo5&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },
        {
          id: "avatar-142",
          name: "Geométrico 6",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=geo6&backgroundColor=15b638,0575E6&radius=50&size=128",
        },
        {
          id: "avatar-143",
          name: "Geométrico 7",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=geo7&backgroundColor=f83600,f9d423&radius=50&size=128",
        },
        {
          id: "avatar-144",
          name: "Geométrico 8",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=geo8&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-145",
          name: "Geométrico 9",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=geo9&backgroundColor=264653,e9c46a&radius=50&size=128",
        },
        {
          id: "avatar-146",
          name: "Geométrico 10",
          category: "geometric",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=geo10&backgroundColor=667eea,f093fb&radius=50&size=128",
        },

        // === BIBLIOTECA: Multiavatar - Categorias mistas ===
        {
          id: "avatar-147",
          name: "Multi Avatar 1",
          category: "cartoon",
          url: "https://api.multiavatar.com/avatar1.svg",
        },
        {
          id: "avatar-148",
          name: "Multi Avatar 2",
          category: "cartoon",
          url: "https://api.multiavatar.com/avatar2.svg",
        },
        {
          id: "avatar-149",
          name: "Multi Avatar 3",
          category: "people",
          url: "https://api.multiavatar.com/avatar3.svg",
        },
        {
          id: "avatar-150",
          name: "Multi Avatar 4",
          category: "people",
          url: "https://api.multiavatar.com/avatar4.svg",
        },
        {
          id: "avatar-151",
          name: "Abstrato 4",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/abstract/svg?seed=abs4&backgroundColor=f83600,f9d423&radius=50&size=128",
        },
        {
          id: "avatar-152",
          name: "Formas Abstrato 7",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/shapes/svg?seed=shapes7&backgroundColor=667eea,f093fb&radius=50&size=128",
        },
        {
          id: "avatar-153",
          name: "Multi Avatar 7",
          category: "fantasy",
          url: "https://api.multiavatar.com/avatar7.svg",
        },
        {
          id: "avatar-154",
          name: "Multi Avatar 8",
          category: "cartoon",
          url: "https://api.multiavatar.com/avatar8.svg",
        },

        // === Mais avatares abstratos DiceBear ===
        {
          id: "avatar-155",
          name: "Identicon 4",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=ident4&backgroundColor=fa709a,30cfd0&radius=50&size=128",
        },
        {
          id: "avatar-156",
          name: "Anéis Abstrato 7",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=rings7&backgroundColor=f83600,667eea&radius=50&size=128",
        },
        {
          id: "avatar-157",
          name: "Formas Abstrato 8",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/shapes/svg?seed=shapes8&backgroundColor=43e97b,4facfe&radius=50&size=128",
        },
        {
          id: "avatar-158",
          name: "Abstrato 5",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/abstract/svg?seed=abs5&backgroundColor=264653,e9c46a&radius=50&size=128",
        },
        {
          id: "avatar-159",
          name: "Identicon 5",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/identicon/svg?seed=ident5&backgroundColor=15b638,fa709a&radius=50&size=128",
        },
        {
          id: "avatar-160",
          name: "Anéis Abstrato 8",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=rings8&backgroundColor=f83600,4e54c8&radius=50&size=128",
        },
        {
          id: "avatar-161",
          name: "Formas Abstrato 9",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/shapes/svg?seed=shapes9&backgroundColor=667eea,f093fb&radius=50&size=128",
        },
        {
          id: "avatar-162",
          name: "Abstrato 6",
          category: "abstract",
          url: "https://api.dicebear.com/7.x/abstract/svg?seed=abs6&backgroundColor=fa709a,43e97b&radius=50&size=128",
        },

        // === Mais RoboHash - Categoria: technology ===
        {
          id: "avatar-163",
          name: "Tech Robot 1",
          category: "technology",
          url: "https://robohash.org/tech1.png?set=set1&size=128x128",
        },
        {
          id: "avatar-164",
          name: "Tech Robot 2",
          category: "technology",
          url: "https://robohash.org/tech2.png?set=set1&size=128x128",
        },
        {
          id: "avatar-165",
          name: "Tech Robot 3",
          category: "technology",
          url: "https://robohash.org/tech3.png?set=set2&size=128x128",
        },

        // === DiceBear Rings - Categoria: art ===
        {
          id: "avatar-166",
          name: "Arte Ring 1",
          category: "art",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=art1&backgroundColor=264653,2a9d8f&radius=50&size=128",
        },
        {
          id: "avatar-167",
          name: "Arte Ring 2",
          category: "art",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=art2&backgroundColor=667eea,764ba2&radius=50&size=128",
        },
        {
          id: "avatar-168",
          name: "Arte Ring 3",
          category: "art",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=art3&backgroundColor=fa709a,fee140&radius=50&size=128",
        },
        {
          id: "avatar-169",
          name: "Arte Ring 4",
          category: "art",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=art4&backgroundColor=f83600,f9d423&radius=50&size=128",
        },
        {
          id: "avatar-173",
          name: "Arte Ring 5",
          category: "art",
          url: "https://api.dicebear.com/7.x/rings/svg?seed=art5&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-174",
          name: "Arte Lorelei 1",
          category: "art",
          url: "https://api.dicebear.com/7.x/lorelei/svg?seed=art6&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-175",
          name: "Arte Lorelei 2",
          category: "art",
          url: "https://api.dicebear.com/7.x/lorelei/svg?seed=art7&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },
        {
          id: "avatar-176",
          name: "Arte Lorelei 3",
          category: "art",
          url: "https://api.dicebear.com/7.x/lorelei/svg?seed=art8&backgroundColor=a8edea,fed6e3&radius=50&size=128",
        },

        // === Avatares de Jogos - Estilos Variados ===
        {
          id: "avatar-170",
          name: "Bot Jogador 1",
          category: "game",
          url: "https://api.dicebear.com/7.x/bottts/svg?seed=gamer1&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-171",
          name: "Bot Jogador 2",
          category: "game",
          url: "https://api.dicebear.com/7.x/bottts/svg?seed=gamer2&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
        {
          id: "avatar-172",
          name: "Bot Jogador 3",
          category: "game",
          url: "https://api.dicebear.com/7.x/bottts/svg?seed=gamer3&backgroundColor=f093fb,f5576c&radius=50&size=128",
        },
        {
          id: "avatar-217",
          name: "RoboGame 1",
          category: "game",
          url: "https://robohash.org/game1.png?set=set1&size=128x128",
        },
        {
          id: "avatar-218",
          name: "RoboGame 2",
          category: "game",
          url: "https://robohash.org/game2.png?set=set1&size=128x128",
        },
        {
          id: "avatar-219",
          name: "RoboGame 3",
          category: "game",
          url: "https://robohash.org/game3.png?set=set2&size=128x128",
        },
        {
          id: "avatar-220",
          name: "Personagem 1",
          category: "game",
          url: "https://api.dicebear.com/7.x/adventurer/svg?seed=hero1&backgroundColor=f83600,f9d423&radius=50&size=128",
        },
        {
          id: "avatar-221",
          name: "Personagem 2",
          category: "game",
          url: "https://api.dicebear.com/7.x/adventurer/svg?seed=hero2&backgroundColor=43e97b,38f9d7&radius=50&size=128",
        },
        {
          id: "avatar-222",
          name: "Personagem 3",
          category: "game",
          url: "https://api.dicebear.com/7.x/adventurer/svg?seed=hero3&backgroundColor=4facfe,00f2fe&radius=50&size=128",
        },
      ],
    };
  },
  computed: {
    filteredAvatars() {
      if (this.selectedCategory === "all") {
        return this.avatars;
      }
      return this.avatars.filter((avatar) => {
        // Verifica se o avatar pertence à categoria selecionada
        return avatar.category === this.selectedCategory;
      });
    },
  },
  watch: {
    modelValue(newValue) {
      this.selectedAvatar = newValue;
    },
    selectedAvatar(newValue) {
      this.$emit("update:modelValue", newValue);
    },
  },
  methods: {
    selectAvatar(avatarId) {
      const avatar = this.avatars.find((a) => a.id === avatarId);
      if (avatar) {
        this.selectedAvatar = avatar.url;
      }
    },

    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
    },
  },
};
</script>

<style scoped>
.avatar-selector {
  padding: 20px 0;
}

.tab-description {
  margin-bottom: 20px;
  color: #7f8c8d;
  font-size: 0.95rem;
  text-align: center;
}

/* Seletor de Categorias */
.category-selector {
  margin-bottom: 25px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 15px;
  max-height: 200px;
  overflow-y: auto;
}

.category-tab {
  background: white;
  border: 2px solid #e9ecef;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-tab:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.15);
}

.category-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transform: scale(1.05);
}

.category-tab.active:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: scale(1.08) translateY(-2px);
}

/* Scrollbar personalizado para categorias */
.category-tabs::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.category-tabs::-webkit-scrollbar-track {
  background: #e9ecef;
  border-radius: 10px;
}

.category-tabs::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

.category-tabs::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.avatars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
}

/* Scrollbar personalizado para grade de avatares */
.avatars-grid::-webkit-scrollbar {
  width: 8px;
}

.avatars-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.avatars-grid::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

.avatars-grid::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.avatar-item {
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible;
}

.avatar-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.avatar-item.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

.avatar-preview {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
}

.avatar-item.selected .avatar-preview {
  border-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Estilo para os nomes dos avatares */
.avatar-name {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.7rem;
  color: #64748b;
  text-align: center;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
