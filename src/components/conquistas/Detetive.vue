<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from './ConquistaBase.vue'

export default {
  name: "Detetive",
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
      const numItens = this.itensFaltantes.length
      const desbloqueada = numItens >= 10
      const progresso = Math.min(100, (numItens / 10) * 100)

      return {
        id: 'detetive',
        nome: 'Detetive',
        descricao: `Identificou ${numItens}/10+ itens faltantes`,
        icone: '🔍',
        xp: 20,
        desbloqueada,
        nova: desbloqueada && !this.usuario.conquistasAntigas?.includes('detetive'),
        progresso
      }
    }
  }
}
</script>