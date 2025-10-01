<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from './ConquistaBase.vue'

export default {
  name: "MetaBatida",
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
      const desbloqueada = contador >= 500
      const progresso = Math.min(100, (contador / 500) * 100)

      return {
        id: 'meta_500',
        nome: 'Meta Batida',
        descricao: 'Leu mais de 500 itens',
        icone: '🎯',
        xp: 50,
        desbloqueada,
        nova: desbloqueada && !this.usuario.conquistasAntigas?.includes('meta_500'),
        progresso
      }
    }
  }
}
</script>