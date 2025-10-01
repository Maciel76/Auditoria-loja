<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from './ConquistaBase.vue'

export default {
  name: "Explorador",
  components: {
    ConquistaBase
  },
  props: {
    usuario: {
      type: Object,
      required: true
    },
    corredoresUnicos: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    conquistaData() {
      const numCorredores = this.corredoresUnicos.length
      const desbloqueada = numCorredores >= 5
      const progresso = Math.min(100, (numCorredores / 5) * 100)

      return {
        id: 'explorador',
        nome: 'Explorador',
        descricao: `Cobriu ${numCorredores}/5+ corredores`,
        icone: '🗺️',
        xp: 25,
        desbloqueada,
        nova: desbloqueada && !this.usuario.conquistasAntigas?.includes('explorador'),
        progresso
      }
    }
  }
}
</script>