<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from './ConquistaBase.vue'

export default {
  name: "Maratona",
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
      const desbloqueada = contador >= 1000
      const progresso = Math.min(100, (contador / 1000) * 100)

      return {
        id: 'maratona',
        nome: 'Maratona',
        descricao: 'Leu mais de 1000 itens',
        icone: '🏅',
        xp: 100,
        desbloqueada,
        nova: desbloqueada && !this.usuario.conquistasAntigas?.includes('maratona'),
        progresso
      }
    }
  }
}
</script>