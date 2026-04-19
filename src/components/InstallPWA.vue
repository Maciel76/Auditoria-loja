<template>
  <Transition name="slide-up">
    <div v-if="showBanner" class="pwa-banner">
      <div class="pwa-banner-content">
        <img
          src="/icons/android-chrome-192x192.png"
          alt="Logo"
          class="pwa-logo"
        />
        <div class="pwa-text">
          <strong>Tenha uma experiência melhor instalando nosso app 🚀</strong>
          <span>Acesse rápido direto da tela inicial</span>
        </div>
        <div class="pwa-actions">
          <button class="pwa-install-btn" @click="installApp">
            <i class="fas fa-download"></i>
            Instalar agora
          </button>
          <button class="pwa-close-btn" @click="closeBanner" aria-label="Fechar">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showBanner = ref(false)
const deferredPrompt = ref(null)

const STORAGE_KEY = 'pwa-install-dismissed'

function onBeforeInstallPrompt(e) {
  e.preventDefault()
  deferredPrompt.value = e
  tryShowBanner()
}

function tryShowBanner() {
  // Já instalado
  if (window.matchMedia('(display-mode: standalone)').matches) return
  // Já descartou
  if (localStorage.getItem(STORAGE_KEY)) return
  // Evento não capturado
  if (!deferredPrompt.value) return

  setTimeout(() => {
    showBanner.value = true
  }, 3000)
}

async function installApp() {
  if (!deferredPrompt.value) return

  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice

  if (outcome === 'accepted') {
    showBanner.value = false
  }

  deferredPrompt.value = null
}

function closeBanner() {
  showBanner.value = false
  localStorage.setItem(STORAGE_KEY, 'true')
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
})
</script>

<style scoped>
.pwa-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 0 16px 16px;
}

.pwa-banner-content {
  max-width: 480px;
  margin: 0 auto;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.pwa-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: contain;
  background: white;
  padding: 4px;
  flex-shrink: 0;
}

.pwa-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.pwa-text strong {
  color: #fff;
  font-size: 0.85rem;
  line-height: 1.3;
}

.pwa-text span {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
}

.pwa-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.pwa-install-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.pwa-install-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.pwa-install-btn:active {
  transform: scale(0.97);
}

.pwa-close-btn {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s, color 0.2s;
}

.pwa-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Animação slide-up */
.slide-up-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-leave-active {
  transition: all 0.3s ease-in;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Responsivo */
@media (max-width: 400px) {
  .pwa-banner-content {
    flex-wrap: wrap;
    gap: 12px;
  }

  .pwa-text strong {
    font-size: 0.8rem;
  }

  .pwa-actions {
    width: 100%;
    justify-content: space-between;
  }

  .pwa-install-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
