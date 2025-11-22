/**
 * ANÁLISE TÉCNICA DAS CONQUISTAS (ACHIEVEMENTS)
 * Baseado no modelo MetricasUsuario.js
 *
 * ESTRUTURA DE XP E NÍVEIS:
 * - achievements.xp.total = soma de todas as fontes de XP
 * - achievements.xp.fromProducts = 1 XP por item lido (totaisAcumulados.itensLidosTotal)
 * - achievements.xp.fromAchievements = soma dos pontos de todas as conquistas desbloqueadas
 * - achievements.xp.fromActivities = reservado para futuro
 *
 * CÁLCULO DE NÍVEL:
 * - Level 1: 0-99 XP
 * - Level 2: 100-299 XP
 * - Level 3: 300-599 XP
 * - Level 4: 600-999 XP
 * - Level 5+: escala progressiva (ver MetricasUsuario.js:638-654)
 *
 * CAMPOS IMPORTANTES DO MODELO:
 * - contadoresAuditorias: totalEtiquetas, totalRupturas, totalPresencas, totalGeral
 * - totaisAcumulados: itensLidosEtiquetas, itensLidosRupturas, itensLidosPresencas, itensLidosTotal
 * - totais: totalItens, itensLidos, itensAtualizados, percentualConclusaoGeral, pontuacaoTotal
 * - tendencias: melhoriaPercentual, diasAtivos, mediaItensPerDia, regularidade
 * - ContadorLocais: Map com contagem de itens lidos por setor/local
 * - ContadorClassesProduto: Map com contagem de itens lidos por classe de produto
 */

{
  "achievements": [
    // ========== CONQUISTA 1: PRIMEIRA AUDITORIA ==========
    {
      "achievementId": "first-audit",
      "unlocked": false, // Desbloqueado quando contadoresAuditorias.totalGeral >= 1
      "progress": {
        "current": 0, // FONTE: contadoresAuditorias.totalGeral (quantidade de auditorias completas realizadas)
        "target": 1, // META: 1 auditoria
        "percentage": 0 // CÁLCULO: (current / target) * 100, limitado a 100
      },
      "achievementData": {
        "points": 10, // XP concedido ao desbloquear (somado em achievements.xp.fromAchievements)
        "criteria": {
          "type": "count", // Tipo de verificação: contagem simples
          "target": 1,
          "description": "Realizar 1 auditoria atualizada"
        }
      }
      // LÓGICA: Incrementa contadoresAuditorias.totalGeral a cada auditoria finalizada com itensAtualizados > 0
      // QUANDO DESBLOQUEIA: Ao completar a primeira auditoria (qualquer tipo: etiqueta, ruptura ou presença)
    },

    // ========== CONQUISTA 2: ENTUSIASTA DE AUDITORIA ==========
    {
      "achievementId": "audit-enthusiast",
      "unlocked": false, // Desbloqueado quando contadoresAuditorias.totalGeral >= 10
      "progress": {
        "current": 0, // FONTE: contadoresAuditorias.totalGeral
        "target": 10, // META: 10 auditorias
        "percentage": 0 // CÁLCULO: (current / target) * 100
      },
      "achievementData": {
        "points": 25, // XP concedido ao desbloquear
        "criteria": {
          "type": "count",
          "target": 10,
          "description": "Realizar 10 auditorias atualizadas"
        }
      }
      // LÓGICA: Mesma fonte da conquista anterior, mas com meta maior
      // QUANDO DESBLOQUEIA: Após completar 10 auditorias no total
    },

    // ========== CONQUISTA 3: MESTRE DE AUDITORIA ==========
    {
      "achievementId": "audit-master",
      "unlocked": false, // Desbloqueado quando contadoresAuditorias.totalGeral >= 50
      "progress": {
        "current": 0, // FONTE: contadoresAuditorias.totalGeral
        "target": 50, // META: 50 auditorias
        "percentage": 0 // CÁLCULO: (current / target) * 100
      },
      "achievementData": {
        "points": 50, // XP concedido ao desbloquear (maior recompensa)
        "criteria": {
          "type": "count",
          "target": 50,
          "description": "Realizar 50 auditorias atualizadas"
        }
      }
      // LÓGICA: Progressão natural das conquistas de auditoria
      // QUANDO DESBLOQUEIA: Após completar 50 auditorias no total
    },

    // ========== CONQUISTA 4: AUDITOR CONSISTENTE ==========
    {
      "achievementId": "consistent-auditor",
      "unlocked": false, // Desbloqueado após 5 dias CONSECUTIVOS com auditorias
      "progress": {
        "current": 0, // FONTE: Requer lógica externa - streak de dias consecutivos
        "target": 5, // META: 5 dias seguidos
        "percentage": 0 // CÁLCULO: (current / target) * 100
      },
      "achievementData": {
        "points": 30, // XP concedido ao desbloquear
        "criteria": {
          "type": "streak", // Tipo especial: sequência consecutiva
          "target": 5,
          "description": "Realizar auditorias por 5 dias consecutivos"
        }
      }
      // LÓGICA COMPLEXA: Precisa verificar histórico de auditorias por data
      // 1. Buscar todas as auditorias do usuário ordenadas por data
      // 2. Verificar se há pelo menos 1 auditoria em cada um dos últimos 5 dias CONSECUTIVOS
      // 3. Quebra o streak se passar 1 dia sem auditoria
      // FONTE DE DADOS: Coleção de Auditorias com campo createdAt ou updatedAt
      // CAMPO AUXILIAR: tendencias.diasAtivos (mas precisa verificar se são consecutivos)
      // IMPLEMENTAÇÃO SUGERIDA:
      // - Criar campo adicional 'currentStreak' em tendencias
      // - Atualizar diariamente verificando se houve auditoria no dia anterior
    },

    // ========== CONQUISTA 5: GUERREIRO SEMANAL ==========
    {
      "achievementId": "weekly-warrior",
      "unlocked": false, // Desbloqueado ao realizar 5 auditorias em qualquer período de 7 dias
      "progress": {
        "current": 0, // FONTE: Contagem de auditorias nos últimos 7 dias
        "target": 5, // META: 5 auditorias em 1 semana
        "percentage": 0 // CÁLCULO: (current / target) * 100
      },
      "achievementData": {
        "points": 20, // XP concedido ao desbloquear
        "criteria": {
          "type": "count",
          "target": 5,
          "period": 7, // Período em dias
          "description": "Realizar 5 auditorias em uma semana"
        }
      }
      // LÓGICA: Verificar auditorias em janela móvel de 7 dias
      // CÁLCULO:
      // 1. Pegar data atual
      // 2. Buscar auditorias dos últimos 7 dias: (dataAtual - 7 dias) até dataAtual
      // 3. Contar total de auditorias nesse período
      // FONTE DE DADOS: Coleção de Auditorias filtradas por:
      //    createdAt >= (new Date() - 7 dias) AND usuarioId = usuarioAtual
      // QUANDO VERIFICAR: A cada nova auditoria criada
      // CAMPO AUXILIAR: tendencias.mediaItensPerDia pode ajudar a estimar
    },

    // ========== CONQUISTA 6: COLECIONADOR (100 ITENS) ==========
    {
      "achievementId": "item-collector-100",
      "unlocked": false, // Desbloqueado quando itensLidosTotal >= 100
      "progress": {
        "current": 0, // FONTE: totaisAcumulados.itensLidosTotal
        "target": 100, // META: 100 itens lidos
        "percentage": 0 // CÁLCULO: (current / target) * 100
      },
      "achievementData": {
        "points": 15, // XP concedido ao desbloquear
        "criteria": {
          "type": "count",
          "target": 100,
          "description": "Ler 100 itens"
        }
      }
      // LÓGICA SIMPLES: Soma acumulada de todos os itens lidos
      // FONTE: totaisAcumulados.itensLidosTotal que soma:
      //   - totaisAcumulados.itensLidosEtiquetas (etiquetas.itensLidos)
      //   - totaisAcumulados.itensLidosRupturas (rupturas.itensLidos)
      //   - totaisAcumulados.itensLidosPresencas (presencas.itensLidos)
      // QUANDO DESBLOQUEIA: Ao atingir 100 itens lidos acumulados em todas as auditorias
      // XP PRODUTOS: Também gera 100 XP em achievements.xp.fromProducts (1 XP por item)
    },

    // ========== CONQUISTA 7: META BATIDA (500 ITENS) ==========
    {
      "achievementId": "item-collector-500",
      "unlocked": false, // Desbloqueado quando itensLidosTotal >= 500
      "progress": {
        "current": 0, // FONTE: totaisAcumulados.itensLidosTotal
        "target": 500, // META: 500 itens lidos
        "percentage": 0 // CÁLCULO: (current / target) * 100
      },
      "achievementData": {
        "points": 50, // XP concedido ao desbloquear (recompensa maior)
        "criteria": {
          "type": "count",
          "target": 500,
          "description": "Ler 500 itens"
        }
      }
      // LÓGICA: Mesma da conquista anterior, meta maior
      // FONTE: totaisAcumulados.itensLidosTotal
      // QUANDO DESBLOQUEIA: Ao atingir 500 itens lidos acumulados
      // XP PRODUTOS: Também gera 500 XP em achievements.xp.fromProducts
    },

    // ========== CONQUISTA 8: MARATONA (1000 ITENS) ==========
    {
      "achievementId": "item-collector-1000",
      "unlocked": false, // Desbloqueado quando itensLidosTotal >= 1000
      "progress": {
        "current": 0, // FONTE: totaisAcumulados.itensLidosTotal
        "target": 1000, // META: 1000 itens lidos
        "percentage": 0 // CÁLCULO: (current / target) * 100
      },
      "achievementData": {
        "points": 100, // XP concedido ao desbloquear (maior recompensa da categoria)
        "criteria": {
          "type": "count",
          "target": 1000,
          "description": "Ler 1000 itens"
        }
      }
      // LÓGICA: Mesma das conquistas anteriores de itens, meta máxima
      // FONTE: totaisAcumulados.itensLidosTotal
      // QUANDO DESBLOQUEIA: Ao atingir 1000 itens lidos acumulados
      // XP PRODUTOS: Também gera 1000 XP em achievements.xp.fromProducts
      // OBSERVAÇÃO: Esta é a conquista "final" da categoria de coleta de itens
    },

    // ========== CONQUISTA 9: PRECISÃO PERFEITA ==========
    {
      "achievementId": "perfect-accuracy",
      "unlocked": false, // Desbloqueado quando percentualConclusaoGeral >= 95%
      "progress": {
        "current": 0, // FONTE: totais.percentualConclusaoGeral (já é um percentual de 0 a 100)
        "target": 95, // META: 95% de precisão
        "percentage": 0 // CÁLCULO: (current / target) * 100
      },
      "achievementData": {
        "points": 40, // XP concedido ao desbloquear
        "criteria": {
          "type": "percentage", // Tipo especial: verificação de percentual
          "target": 95,
          "description": "Manter 95% de precisão"
        }
      }
      // LÓGICA: Verifica a taxa de acerto nas auditorias
      // FONTE: totais.percentualConclusaoGeral
      // CÁLCULO BASE: (totais.itensAtualizados / totais.totalItens) * 100
      //   - itensAtualizados: soma de todos os itens que foram corretamente atualizados
      //   - totalItens: soma de todos os itens que deveriam ser auditados
      //
      // EXEMPLO:
      //   totalItens = 4612 (etiquetas.totalItens + rupturas.totalItens + presencas.totalItens)
      //   itensAtualizados = 4381
      //   percentual = (4381 / 4612) * 100 = 95.0%
      //
      // QUANDO DESBLOQUEIA: Quando o percentual de conclusão geral atingir 95% ou mais
      // NOTA: É uma conquista de qualidade, não quantidade
    },

    // ========== CONQUISTA 10: JOGADOR DE EQUIPE ==========
    {
      "achievementId": "team-player",
      "unlocked": true, // JÁ DESBLOQUEADO no exemplo (trabalhou em 58 setores)
      "progress": {
        "current": 58, // FONTE: Quantidade de entradas em ContadorLocais com valor > 0
        "target": 3, // META: trabalhar em 3 setores diferentes
        "percentage": 100 // CÁLCULO: (58 / 3) * 100 = 1933%, limitado a 100%
      },
      "achievementData": {
        "points": 20, // XP concedido ao desbloquear
        "criteria": {
          "type": "count",
          "target": 3,
          "description": "Trabalhar em 3 setores diferentes"
        }
      },
      "unlockedAt": {
        "$date": "2025-11-21T03:38:39.675Z" // Data em que foi desbloqueado
      }
      // LÓGICA: Conta setores únicos onde o usuário trabalhou
      // FONTE: ContadorLocais (Map com 50 setores possíveis)
      // CÁLCULO:
      //   1. Percorrer todas as chaves de ContadorLocais
      //   2. Contar quantas têm valor > 0
      //   3. Cada setor com pelo menos 1 item lido conta como "trabalhado"
      //
      // EXEMPLO DO MODELO:
      //   ContadorLocais = {
      //     "C01 - C01": 13,    ✓ conta (> 0)
      //     "CS01 - CS01": 14,  ✓ conta (> 0)
      //     "F01 - F01": 90,    ✓ conta (> 0)
      //     "GELO - GELO": 0,   ✗ não conta (= 0)
      //     ...
      //   }
      //   Total no exemplo: 58 setores diferentes trabalhados
      //
      // INCREMENTO: A cada auditoria, atualiza ContadorLocais[setor] += itensLidos
      // QUANDO DESBLOQUEIA: Quando trabalhar em pelo menos 3 setores diferentes
      // PROGRESSÃO NATURAL: Usuários tendem a trabalhar em múltiplos setores
    }
  ],

  // ========== ESTRUTURA DE XP (achievements.xp) ==========
  "xp": {
    "total": 20, // CÁLCULO: fromProducts + fromAchievements + fromActivities
    "fromProducts": 0, // FONTE: totaisAcumulados.itensLidosTotal * 1 (1 XP por item lido)
                       // No exemplo: 4612 itens lidos = 4612 XP
                       // NOTA: Parece estar zerado no exemplo, mas deveria ser 4612
    "fromAchievements": 20, // FONTE: Soma dos pontos de todas as conquistas desbloqueadas
                            // No exemplo: apenas "team-player" desbloqueado = 20 pontos
    "fromActivities": 0 // RESERVADO PARA FUTURO: Eventos especiais, bônus diários, etc.
  },

  // ========== ESTRUTURA DE NÍVEL (achievements.level) ==========
  "level": {
    "current": 1, // FONTE: Calculado com base no XP total usando calcularLevel()
                  // Level 1 = 0-99 XP (exemplo tem apenas 20 XP)
    "title": "Novato", // FONTE: getLevelTitle() baseado no nível atual
                       // Títulos: Novato(1), Iniciante(2), Aprendiz(3), Competente(5)...
    "xpForNextLevel": 80, // CÁLCULO: 100 - (xp.total % 100)
                          // Exemplo: 100 - (20 % 100) = 100 - 20 = 80 XP faltam
    "progressPercentage": 20 // CÁLCULO: (xp.total % 100)
                             // Exemplo: 20 % 100 = 20% de progresso no nível atual
  },

  // ========== ESTATÍSTICAS (achievements.stats) ==========
  "stats": {
    "totalUnlockedAchievements": 1, // FONTE: achievements.filter(a => a.unlocked).length
    "totalAudits": 0, // FONTE: totais.itensAtualizados ou contadoresAuditorias.totalGeral
                      // NOTA: Está zerado no exemplo, mas deveria ser 1 (contadoresAuditorias.totalGeral)
    "totalItems": 0, // FONTE: totais.itensAtualizados
                     // NOTA: Está zerado no exemplo, mas deveria refletir itens atualizados
    "lastActivityAt": { "$date": "2025-11-21T03:38:39.675Z" } // FONTE: ultimaAtualizacao ou data da última auditoria
  }
}

/**
 * ========== RESUMO DOS CAMPOS-FONTE ==========
 *
 * CONQUISTAS DE AUDITORIAS (first-audit, audit-enthusiast, audit-master):
 *   progress.current = contadoresAuditorias.totalGeral
 *
 * CONQUISTAS DE CONSISTÊNCIA (consistent-auditor):
 *   progress.current = streak de dias consecutivos (requer lógica externa)
 *   Fonte: Histórico de auditorias com verificação de datas consecutivas
 *
 * CONQUISTAS SEMANAIS (weekly-warrior):
 *   progress.current = auditorias nos últimos 7 dias (requer lógica externa)
 *   Fonte: Coleção de Auditorias com filtro de data
 *
 * CONQUISTAS DE ITENS (item-collector-*):
 *   progress.current = totaisAcumulados.itensLidosTotal
 *   XP bônus: achievements.xp.fromProducts = totaisAcumulados.itensLidosTotal * 1
 *
 * CONQUISTAS DE PRECISÃO (perfect-accuracy):
 *   progress.current = totais.percentualConclusaoGeral
 *   Cálculo: (totais.itensAtualizados / totais.totalItens) * 100
 *
 * CONQUISTAS DE PARTICIPAÇÃO (team-player):
 *   progress.current = Array.from(ContadorLocais.values()).filter(v => v > 0).length
 *   Conta setores únicos trabalhados
 *
 * ========== FLUXO DE ATUALIZAÇÃO ==========
 *
 * 1. Usuário completa uma auditoria
 * 2. Backend incrementa contadores relevantes:
 *    - contadoresAuditorias.totalGeral++
 *    - totaisAcumulados.itensLidosTotal += itensLidos
 *    - ContadorLocais[setor] += itensLidos
 *    - totais.itensAtualizados += itensAtualizados
 *
 * 3. Backend chama metricasUsuario.calcularAchievements()
 *    - Atualiza progress.current de cada conquista
 *    - Verifica se alguma conquista deve ser desbloqueada
 *    - Recalcula XP total
 *    - Recalcula nível
 *
 * 4. Frontend exibe conquistas desbloqueadas e progresso
 *
 * ========== SUGESTÕES DE IMPLEMENTAÇÃO ==========
 *
 * Para CONSISTENT-AUDITOR e WEEKLY-WARRIOR, criar novos campos em tendencias:
 *   - currentStreak: número de dias consecutivos atuais
 *   - weeklyAudits: número de auditorias nos últimos 7 dias
 *   - lastAuditDate: data da última auditoria (para calcular streak)
 *
 * Estes campos devem ser atualizados a cada nova auditoria no serviço de métricas.
 */
