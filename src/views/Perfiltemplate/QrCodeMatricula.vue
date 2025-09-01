<template>
  <div class="qr-code-card">
    <h2 class="section-title">📱 QR Code da Matrícula</h2>
    <div class="qr-code-content">
      <qrcode-vue 
        :value="valorQrCode" 
        :size="120"
        level="H"
        class="qr-code"
      />
      <div class="matricula-info">
        <span class="matricula-text">{{ usuario.id }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'QrCodeMatricula',
  components: {
    QrcodeVue
  },
  props: {
    usuario: {
      type: Object,
      required: true
    }
  },
  computed: {
    valorQrCode() {
      return this.usuario.id.toString()
    }
  }
}
</script>

<style scoped>
.qr-code-card {
  width: 360px;
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  position: relative;
  overflow: hidden;
  height: fit-content;
}

.qr-code-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 4px 0 0;
}

.section-title {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.qr-code-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.qr-code {
  border: 8px solid white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.matricula-info {
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.matricula-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  background: linear-gradient(135deg, #2c3e50 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>