<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from './ConquistaBase.vue'

export default {
  name: "ZeroFaltas",
  components: {
    ConquistaBase
  },
  props: {
    usuario: {
      type: Object,
      required: true
    },
    itensFaltantes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    conquistaData() {
      const desbloqueada = this.itensFaltantes.length === 0 && (this.usuario.contador || 0) > 0
      const progresso = this.itensFaltantes.length === 0 ? 100 : 0

      return {
        id: 'zero_faltas',
        nome: 'Zero Faltas',
        descricao: 'Nenhum item com estoque baixo',
        icone: '🛡️',
        xp: 30,
        desbloqueada,
        nova: desbloqueada && !this.usuario.conquistasAntigas?.includes('zero_faltas'),
        repeticao: 'por auditoria',
        progresso
      }
    }
  }
}
</script>