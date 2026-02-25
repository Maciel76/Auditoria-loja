<template>
  <nav v-if="userSessionStore.isUsuarioComum" class="mobile-bottom-nav">
    <router-link
      :to="`/perfil/${userSessionStore.getUsuarioId}`"
      class="nav-item"
      :class="{ active: isActive('perfil') }"
    >
      <div class="nav-icon-wrapper">
        <i class="fas fa-user"></i>
        <span class="nav-indicator"></span>
      </div>
      <span class="nav-label">Perfil</span>
    </router-link>

    <router-link
      :to="`/perfil-loja/${userLoja?.codigo}`"
      class="nav-item"
      :class="{ active: isActive('loja'), disabled: !userLoja }"
      v-if="userLoja"
    >
      <div class="nav-icon-wrapper">
        <i class="fas fa-store"></i>
        <span class="nav-indicator"></span>
      </div>
      <span class="nav-label">Loja</span>
    </router-link>

    <router-link
      to="/home"
      class="nav-item nav-item-center"
      :class="{ active: isActive('home') }"
    >
      <div class="nav-icon-wrapper nav-icon-center">
        <i class="fas fa-comments"></i>
        <span class="nav-indicator"></span>
      </div>
      <span class="nav-label">Comunidade</span>
    </router-link>

    <router-link
      to="/ranking"
      class="nav-item"
      :class="{ active: isActive('ranking') }"
    >
      <div class="nav-icon-wrapper">
        <i class="fas fa-trophy"></i>
        <span class="nav-indicator"></span>
      </div>
      <span class="nav-label">Ranking</span>
    </router-link>

    <router-link
      to="/lojas"
      class="nav-item"
      :class="{ active: isActive('lojas') }"
    >
      <div class="nav-icon-wrapper">
        <i class="fas fa-map-marked-alt"></i>
        <span class="nav-indicator"></span>
      </div>
      <span class="nav-label">Lojas</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useUserSessionStore } from "@/store/userSessionStore";
import axios from "axios";

const route = useRoute();
const userSessionStore = useUserSessionStore();
const userLoja = ref(null);

const isActive = (section) => {
  const path = route.path.toLowerCase();

  switch (section) {
    case "perfil":
      return path.includes("/perfil/") && !path.includes("/perfil-loja/");
    case "loja":
      return path.includes("/perfil-loja/");
    case "home":
      return path === "/home";
    case "ranking":
      return path.includes("/ranking");
    case "lojas":
      return path.includes("/lista-lojas");
    default:
      return false;
  }
};

onMounted(async () => {
  if (userSessionStore.isUsuarioComum) {
    try {
      const lojaSelecionada = JSON.parse(
        localStorage.getItem("lojaSelecionada") || '{"codigo":"056"}',
      );

      const response = await axios.get(
        `/api/api/usuarios/${userSessionStore.getUsuarioId}`,
        {
          headers: {
            "x-loja": lojaSelecionada.codigo,
          },
        },
      );

      if (response.data?.loja) {
        userLoja.value = response.data.loja;
      }
    } catch (error) {
      console.error("Erro ao carregar dados da loja:", error);
    }
  }
});
</script>

<style scoped>
.mobile-bottom-nav {
  display: none;
}

@media (max-width: 768px) {
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(102, 126, 234, 0.1);
    padding: 0.5rem 0.25rem calc(env(safe-area-inset-bottom, 0px) + 0.5rem);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
    z-index: 1000;
    justify-content: space-around;
    align-items: flex-start;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 0.5rem 0.25rem;
    text-decoration: none;
    color: #64748b;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    min-width: 60px;
    max-width: 80px;
  }

  .nav-item.disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  .nav-icon-wrapper {
    position: relative;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: transparent;
  }

  .nav-item-center .nav-icon-center {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .nav-item-center .nav-icon-center i {
    color: white;
  }

  .nav-icon-wrapper i {
    font-size: 1.25rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-indicator {
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%) scale(0);
    width: 4px;
    height: 4px;
    background: #667eea;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-label {
    font-size: 0.7rem;
    font-weight: 600;
    margin-top: 0.25rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: 0.3px;
  }

  /* Estado Ativo */
  .nav-item.active {
    color: #667eea;
  }

  .nav-item.active .nav-icon-wrapper {
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }

  .nav-item.active .nav-icon-wrapper i {
    transform: scale(1.1);
  }

  .nav-item.active .nav-indicator {
    transform: translateX(-50%) scale(1);
    width: 20px;
    height: 4px;
    border-radius: 2px;
  }

  .nav-item.active .nav-label {
    font-weight: 700;
  }

  /* Item central sempre destaque */
  .nav-item-center.active .nav-icon-center {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  /* Animação de toque */
  .nav-item:active:not(.disabled) .nav-icon-wrapper {
    transform: scale(0.9);
  }

  /* Animação de entrada */
  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .mobile-bottom-nav {
    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Ripple effect */
  .nav-item::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(102, 126, 234, 0.2);
    transform: translate(-50%, -50%);
    transition:
      width 0.6s,
      height 0.6s;
  }

  .nav-item:active::before {
    width: 60px;
    height: 60px;
  }
}

/* Adicionar padding-bottom nas páginas para não sobrepor conteúdo */
@media (max-width: 768px) {
  body {
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 70px);
  }
}
</style>
