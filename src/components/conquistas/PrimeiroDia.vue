<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from './ConquistaBase.vue'

export default {
  name: "PrimeiroDia",
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
      const desbloqueada = (this.usuario.contador || 0) > 0

      return {
        id: 'primeira_auditoria',
        nome: 'Primeiro Dia',
        descricao: 'Fez sua primeira auditoria',
        icone: '🎉',
        xp: 10,
        desbloqueada,
        nova: desbloqueada && !this.usuario.conquistasAntigas?.includes('primeira_auditoria'),
        progresso: desbloqueada ? 100 : 0
      }
    }
  }
}
</script>