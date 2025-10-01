<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from './ConquistaBase.vue'

export default {
  name: "Relampago",
  components: {
    ConquistaBase
  },
  props: {
    usuario: {
      type: Object,
      required: true
    },
    atividadesRecentes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    conquistaData() {
      const desbloqueada = this.verificarConquista()
      const progresso = Math.min(100, (this.atividadesRecentes.length / 50) * 100)

      return {
        id: 'relampago',
        nome: 'Relâmpago',
        descricao: 'Verificou 50 itens rapidamente',
        icone: '⚡',
        xp: 35,
        desbloqueada,
        nova: desbloqueada && !this.usuario.conquistasAntigas?.includes('relampago'),
        repeticao: 'diária',
        progresso
      }
    }
  },
  methods: {
    verificarConquista() {
      if (!this.atividadesRecentes || this.atividadesRecentes.length < 50) {
        return false
      }

      const primeira = this.atividadesRecentes[0]?.timestamp
      const ultima = this.atividadesRecentes[49]?.timestamp

      if (!primeira || !ultima) return false

      const diferencaHoras = (primeira - ultima) / (1000 * 60 * 60)
      return diferencaHoras < 1
    }
  }
}
</script>