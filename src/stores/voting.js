import { defineStore } from 'pinia'
import axios from 'axios'

export const useVotingStore = defineStore('voting', {
  state: () => ({
    votacoes: [],
    userReactions: new Map(), // Mapeia votacaoId -> reactionType
    userIdentifier: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    loading: false
  }),

  getters: {
    getVotacaoById: (state) => (id) => {
      return state.votacoes.find(v => v.id === id || v._id === id)
    },

    getUserReaction: (state) => (votacaoId) => {
      return state.userReactions.get(votacaoId)
    },

    getVotacoesOrdenadas: (state) => {
      return [...state.votacoes].sort((a, b) => {
        const totalA = Object.values(a.reactions || {}).reduce((sum, r) => sum + (r.count || 0), 0)
        const totalB = Object.values(b.reactions || {}).reduce((sum, r) => sum + (r.count || 0), 0)
        return totalB - totalA
      }).slice(0, 3)
    }
  },

  actions: {
    async carregarVotacoes() {
      this.loading = true
      try {
        const response = await axios.get('/api/api/votacoes?status=ativo&limite=10', {
          headers: { 'x-loja': '001' }
        })

        if (response.data.votacoes) {
          this.votacoes = response.data.votacoes.map(votacao => ({
            id: votacao._id,
            originalId: votacao._id,
            title: votacao.titulo,
            description: votacao.descricao,
            benefits: votacao.beneficios,
            autor: votacao.autor,
            status: votacao.status || 'ativo',
            reactions: votacao.reactions || {
              like: { count: 0, users: [] },
              dislike: { count: 0, users: [] },
              fire: { count: 0, users: [] },
              heart: { count: 0, users: [] }
            }
          }))

          // Carregar identificador do usuário
          this.carregarReacoesUsuario()
        }
      } catch (error) {
        console.error('Erro ao carregar votações:', error)
        // Dados mock em caso de erro
        this.votacoes = [
          {
            id: 1,
            title: "Sistema de Gamificação",
            description: "Implementar badges e recompensas por participação ativa",
            status: "ativo",
            autor: "João Silva",
            reactions: {
              like: { count: 12, users: [] },
              dislike: { count: 2, users: [] },
              fire: { count: 8, users: [] },
              heart: { count: 15, users: [] }
            }
          }
        ]
      } finally {
        this.loading = false
      }
    },

    async reagirVotacao(votacaoId, reactionType) {
      try {
        // Gerar novo identificador para cada voto (permite múltiplos votos)
        const voteIdentifier = `${this.userIdentifier}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        // Fazer chamada para o backend
        const response = await axios.post(`/api/api/votacoes/${votacaoId}/react`, {
          reaction: reactionType,
          userIdentifier: voteIdentifier
        }, {
          headers: { 'x-loja': '001' }
        })

        if (response.data) {
          // Atualizar votação local
          const votacao = this.votacoes.find(v => v.id === votacaoId || v.originalId === votacaoId)
          if (votacao) {
            if (response.data.reactions) {
              votacao.reactions = response.data.reactions
            }
          }

          console.log(`✅ Reação ${reactionType} registrada para votação ${votacaoId}`)
        }
      } catch (error) {
        console.error('Erro ao reagir:', error)
        if (error.response?.data?.erro) {
          alert(error.response.data.erro)
        } else {
          alert('Erro ao registrar reação')
        }
      }
    },

    salvarReacoesUsuario() {
      const reactions = Object.fromEntries(this.userReactions)
      localStorage.setItem('userReactions', JSON.stringify(reactions))
      localStorage.setItem('userIdentifier', this.userIdentifier)
    },

    carregarReacoesUsuario() {
      try {
        const savedReactions = localStorage.getItem('userReactions')
        const savedIdentifier = localStorage.getItem('userIdentifier')

        if (savedReactions) {
          const reactions = JSON.parse(savedReactions)
          this.userReactions = new Map(Object.entries(reactions))
        }

        if (savedIdentifier) {
          this.userIdentifier = savedIdentifier
        }
      } catch (error) {
        console.error('Erro ao carregar reações do usuário:', error)
      }
    },

    hasUserReacted(votacaoId, reactionType) {
      // Sempre retorna false para permitir múltiplos votos
      return false
    },

    getTotalReactions(votacao) {
      if (!votacao.reactions) return 0
      return Object.values(votacao.reactions).reduce((total, reaction) => total + (reaction.count || 0), 0)
    },

    sincronizarReacoesComBackend() {
      // Verificar nas votações do backend se o usuário já reagiu
      this.votacoes.forEach(votacao => {
        if (votacao.reactions) {
          // Procurar se o userIdentifier está em alguma reação
          Object.entries(votacao.reactions).forEach(([reactionType, reaction]) => {
            if (reaction.users && reaction.users.includes(this.userIdentifier)) {
              // Usuário já reagiu com esse tipo
              this.userReactions.set(votacao.id, reactionType)
            }
          })
        }
      })

      // Salvar as reações sincronizadas
      this.salvarReacoesUsuario()
    }
  }
})