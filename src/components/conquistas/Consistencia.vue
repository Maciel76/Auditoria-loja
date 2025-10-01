<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from './ConquistaBase.vue'

export default {
  name: "Consistencia",
  components: {
    ConquistaBase
  },
  props: {
    usuario: {
      type: Object,
      required: true
    }
  },
  computed: {
    conquistaData() {
      const contador = this.usuario.contador || 0
      const percentual = (contador / 500) * 100
      const desbloqueada = percentual >= 75
      const progresso = Math.min(100, (percentual / 75) * 100)

      return {
        id: 'consistencia',
        nome: 'Consistência',
        descricao: `${Math.round(percentual)}% de conclusão (meta: 75%+)`,
        icone: '📈',
        xp: 25,
        desbloqueada,
        nova: desbloqueada && !this.usuario.conquistasAntigas?.includes('consistencia'),
        progresso
      }
    }
  }
}
</script>