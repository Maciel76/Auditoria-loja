<template>
  <div class="metricas-setor-container">
    <!-- Indicador de carregamento -->
    <div v-if="carregando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando métricas...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="erro" class="erro-container">
      <p class="erro-mensagem">{{ erro }}</p>
      <button class="action-btn" @click="buscarMetricasLoja">
        Tentar Novamente
      </button>
    </div>

    <!-- Conteúdo principal -->
    <div v-else>
      <div class="metricas-header">
        <h3>📊 Leitura Auditoria Atual Por Classe (TESTE COM DADOS MOCKADOS)</h3>
        <div class="metricas-actions">
        <button
          class="action-btn"
          :class="{ active: tipoAuditoriaAtual === 'etiquetas' }"
          @click="alterarTipoAuditoria('etiquetas')"
        >
          Etiqueta
        </button>
        <button
          class="action-btn"
          :class="{ active: tipoAuditoriaAtual === 'presencas' }"
          @click="alterarTipoAuditoria('presencas')"
        >
          Presença
        </button>
        <button
          class="action-btn"
          :class="{ active: tipoAuditoriaAtual === 'rupturas' }"
          @click="alterarTipoAuditoria('rupturas')"
        >
          Ruptura
        </button>
      </div>
    </div>

    <div class="metricas-table-container">
      <table class="metricas-table">
        <thead>
          <tr>
            <th>Classe Produtos</th>
            <th>Desempenho</th>
            <th>Total Itens</th>
            <th>Itens Lidos</th>
            <th v-if="tipoAuditoriaAtual === 'rupturas'">Custo Ruptura</th>
            <th v-else-if="tipoAuditoriaAtual === 'presencas'">Presenças</th>
            <th v-else>Itens Atualizados</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="setor in dadosFiltrados"
            :key="setor.ClasseProduto"
            :class="getStatusLinha(setor)"
          >
            <!-- Nome / Ícone -->
            <td class="setor-cell">
              <div class="setor-info">
                <div class="setor-icon">{{ setor.icone }}</div>
                <span>{{ setor.ClasseProduto }}</span>
              </div>
            </td>

            <!-- Desempenho -->
            <td class="desempenho-cell">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: getPercentualLeitura(setor) + '%' }"
                  :class="getClasseDesempenho(getPercentualLeitura(setor))"
                ></div>
                <span class="progress-text">
                  {{ getPercentualLeitura(setor).toFixed(0) }}%
                </span>
              </div>
            </td>

            <!-- Itens totais e lidos -->
            <td class="meta-cell">{{ setor.itensValidos || setor.totalItens }}</td>
            <td class="conformidade-cell">{{ setor.itensLidos }}</td>

            <!-- Coluna dinâmica baseada no tipo de auditoria -->
            <td
              v-if="tipoAuditoriaAtual === 'rupturas'"
              class="custo-cell"
              :class="getClasseCusto(setor)"
            >
              R$ {{ formatarMoeda(setor.custoRuptura || 0) }}
            </td>
            <td
              v-else-if="tipoAuditoriaAtual === 'presencas'"
              class="presenca-cell"
            >
              {{ setor.presencasConfirmadas || 0 }}/{{
                setor.totalItens || setor.itens
              }}
            </td>
            <td v-else class="atualizados-cell">
              {{ setor.itensAtualizados || 0 }}
            </td>

            <!-- Status -->
            <td class="status-cell">
              <span class="status-badge" :class="getStatusSetor(setor)">
                {{ getStatusSetor(setor) }}
              </span>
            </td>

            <!-- Ações -->
            <td class="acoes-cell">
              <button
                class="acao-btn"
                @click="verDetalhesSetor(setor)"
                title="Ver detalhes"
              >
                👁️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Resumo Estatístico -->
    <div class="resumo-estatistico">
      <div class="estatisticas-grid">
        <div class="estatistica-card">
          <div class="estatistica-valor">{{ percentualConclusaoGeral.toFixed(1) }}%</div>
          <div class="estatistica-label">Conclusão Geral</div>
        </div>
        <div class="estatistica-card">
          <div class="estatistica-valor">{{ totalItens }}</div>
          <div class="estatistica-label">Total de Itens</div>
        </div>
        <div class="estatistica-card">
          <div class="estatistica-valor">{{ itensLidos }}</div>
          <div class="estatistica-label">Itens Lidos</div>
        </div>
        <div class="estatistica-card">
          <div class="estatistica-valor">👥 {{ totalColaboradores }}</div>
          <div class="estatistica-label">Colaboradores Envolvidos</div>
        </div>
        <div class="estatistica-card" v-if="tipoAuditoriaAtual === 'etiquetas'">
          <div class="estatistica-valor">{{ itensAtualizados }}</div>
          <div class="estatistica-label">Itens Atualizados</div>
        </div>
        <div class="estatistica-card" v-if="tipoAuditoriaAtual === 'rupturas'">
          <div class="estatistica-valor">
            R$ {{ formatarMoeda(custoTotalRuptura) }}
          </div>
          <div class="estatistica-label">Custo Total Ruptura</div>
        </div>
        <div class="estatistica-card" v-if="tipoAuditoriaAtual === 'presencas'">
          <div class="estatistica-valor">{{ percentualPresenca.toFixed(1) }}%</div>
          <div class="estatistica-label">Presenças Confirmadas</div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Setor -->
    <div v-if="setorSelecionado" class="modal-overlay" @click="fecharModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalhes do Setor - {{ getTipoAuditoriaLabel() }}</h3>
          <button class="modal-close" @click="fecharModal">×</button>
        </div>
        <div class="modal-body">
          <div class="setor-detalhes">
            <div class="detalhe-header">
              <div class="setor-icone-grande">{{ setorSelecionado.icone }}</div>
              <div class="setor-info-grande">
                <h4>{{ setorSelecionado.ClasseProduto }}</h4>
                <span
                  class="status-badge"
                  :class="getStatusSetor(setorSelecionado)"
                >
                  {{ getStatusSetor(setorSelecionado) }}
                </span>
              </div>
            </div>

            <div class="metricas-grid">
              <div class="metrica-item">
                <div class="metrica-label">Desempenho</div>
                <div class="metrica-valor">
                  {{ getPercentualLeitura(setorSelecionado).toFixed(1) }}%
                </div>
                <div class="progress-bar-small">
                  <div
                    class="progress-fill"
                    :style="{
                      width: getPercentualLeitura(setorSelecionado) + '%',
                    }"
                    :class="
                      getClasseDesempenho(
                        getPercentualLeitura(setorSelecionado)
                      )
                    "
                  ></div>
                </div>
              </div>

              <div class="metrica-item">
                <div class="metrica-label">Total de Itens</div>
                <div class="metrica-valor">
                  {{ setorSelecionado.totalItens }}
                </div>
              </div>

              <div class="metrica-item">
                <div class="metrica-label">Itens Válidos</div>
                <div class="metrica-valor">
                  {{ setorSelecionado.itensValidos }}
                </div>
              </div>

              <div class="metrica-item">
                <div class="metrica-label">Itens Lidos</div>
                <div class="metrica-valor">
                  {{ setorSelecionado.itensLidos }}
                </div>
              </div>

              <div class="metrica-item">
                <div class="metrica-label">👥 Colaboradores</div>
                <div class="metrica-valor">
                  {{ colaboradoresSetor.length }}
                </div>
              </div>

              <!-- Métricas específicas por tipo de auditoria -->
              <div
                class="metrica-item"
                v-if="tipoAuditoriaAtual === 'etiquetas'"
              >
                <div class="metrica-label">Itens Atualizados</div>
                <div class="metrica-valor">
                  {{ setorSelecionado.itensAtualizados || 0 }}
                </div>
              </div>

              <div
                class="metrica-item"
                v-if="tipoAuditoriaAtual === 'etiquetas'"
              >
                <div class="metrica-label">Itens Desatualizados</div>
                <div class="metrica-valor">
                  {{ setorSelecionado.itensDesatualizado || 0 }}
                </div>
              </div>

              <div
                class="metrica-item"
                v-if="tipoAuditoriaAtual === 'rupturas'"
              >
                <div class="metrica-label">Custo Ruptura</div>
                <div class="metrica-valor">
                  R$ {{ formatarMoeda(setorSelecionado.custoRuptura || 0) }}
                </div>
              </div>

              <div
                class="metrica-item"
                v-if="tipoAuditoriaAtual === 'presencas'"
              >
                <div class="metrica-label">Presenças Confirmadas</div>
                <div class="metrica-valor">
                  {{ setorSelecionado.presencasConfirmadas || 0 }}
                </div>
              </div>
            </div>

            <!-- Seção: Colaboradores Envolvidos -->
            <div class="colaboradores-section">
              <h5>👥 Colaboradores Envolvidos</h5>
              <div class="colaboradores-grid">
                <div
                  v-for="colaborador in colaboradoresSetor"
                  :key="colaborador.id"
                  class="colaborador-card"
                >
                  <div class="colaborador-avatar">
                    <img
                      v-if="colaborador.foto"
                      :src="colaborador.foto"
                      :alt="colaborador.nome"
                      class="colaborador-foto"
                    />
                    <span v-else class="colaborador-iniciais">
                      {{ colaborador.iniciais }}
                    </span>
                  </div>
                  <div class="colaborador-info">
                    <div class="colaborador-nome">{{ colaborador.nome }}</div>
                    <div class="colaborador-funcao">
                      {{ colaborador.funcao }}
                    </div>

                    <!-- Conquistas e Nível -->
                    <div class="colaborador-conquistas">
                      🏆 {{ colaborador.conquistas.totalConquistas }} conquistas
                      • ⭐ Nv {{ colaborador.conquistas.nivel }}
                    </div>

                    <!-- Ranking -->
                    <div class="colaborador-ranking">
                      📊 Loja: #{{ colaborador.desempenho.posicaoLoja }}
                      • 🌍 Geral: #{{ colaborador.desempenho.posicaoGeral }}
                    </div>

                    <div class="colaborador-status" :class="colaborador.status">
                      {{ colaborador.status }}
                    </div>
                  </div>
                  <div class="colaborador-metricas">
                    <div class="colaborador-metrica">
                      <span class="metrica-valor">{{
                        colaborador.itensLidos
                      }}</span>
                      <span class="metrica-label">Itens</span>
                    </div>
                    <div class="colaborador-metrica">
                      <span class="metrica-valor"
                        >{{ colaborador.eficiencia }}%</span
                      >
                      <span class="metrica-label">Eficiência</span>
                    </div>
                    <div class="colaborador-metrica">
                      <span class="metrica-valor">{{ colaborador.conquistas.xpTotal }}</span>
                      <span class="metrica-label">XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn secondary" @click="fecharModal">
            Fechar
          </button>
          <button
            class="action-btn primary"
            @click="exportarSetor(setorSelecionado)"
          >
            Exportar Dados
          </button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Estado para controlar o tipo de auditoria atual
const tipoAuditoriaAtual = ref("etiquetas");

// Estado para armazenar dados carregados (MOCKADOS)
const dadosReais = ref({
  usuarioId: "",
  loja: "056",
  lojaNome: "Loja 056 - Goiania Burits",
  metricas: {
    data: new Date().toISOString(),
    etiquetas: {
      totalItens: 1500,
      itensValidos: 1200,
      itensLidos: 980,
      itensAtualizados: 850,
      itensDesatualizado: 130,
      itensSemEstoque: 300,
      itensNaopertence: 50,
      percentualConclusao: 81.67,
      classesLeitura: {
        "A CLASSIFICAR": {
          total: 15,
          itensValidos: 12,
          lidos: 10,
          percentual: 83.33,
          itensAtualizados: 8,
          itensDesatualizado: 2,
          usuarios: { "João Silva": 6, "Maria Santos": 4 }
        },
        "ALTO GIRO": {
          total: 120,
          itensValidos: 108,
          lidos: 95,
          percentual: 87.96,
          itensAtualizados: 85,
          itensDesatualizado: 10,
          usuarios: { "Carlos Lima": 50, "Ana Oliveira": 45 }
        },
        "BAZAR": {
          total: 180,
          itensValidos: 150,
          lidos: 130,
          percentual: 86.67,
          itensAtualizados: 115,
          itensDesatualizado: 15,
          usuarios: { "Pedro Costa": 70, "Fernanda Rocha": 60 }
        },
        "DIVERSOS": {
          total: 50,
          itensValidos: 45,
          lidos: 40,
          percentual: 88.89,
          itensAtualizados: 38,
          itensDesatualizado: 2,
          usuarios: { "Ricardo Alves": 40 }
        },
        "DPH": {
          total: 200,
          itensValidos: 180,
          lidos: 160,
          percentual: 88.89,
          itensAtualizados: 145,
          itensDesatualizado: 15,
          usuarios: { "Patrícia Nunes": 90, "Roberto Santos": 70 }
        },
        "FLV": {
          total: 80,
          itensValidos: 70,
          lidos: 55,
          percentual: 78.57,
          itensAtualizados: 50,
          itensDesatualizado: 5,
          usuarios: { "Juliana Costa": 30, "Marcos Oliveira": 25 }
        },
        "LATICINIOS 1": {
          total: 100,
          itensValidos: 85,
          lidos: 70,
          percentual: 82.35,
          itensAtualizados: 65,
          itensDesatualizado: 5,
          usuarios: { "Carla Silva": 40, "Paulo Rodrigues": 30 }
        },
        "LIQUIDA": {
          total: 150,
          itensValidos: 130,
          lidos: 110,
          percentual: 84.62,
          itensAtualizados: 100,
          itensDesatualizado: 10,
          usuarios: { "Amanda Lima": 60, "Diego Souza": 50 }
        },
        "PERECIVEL 1": {
          total: 90,
          itensValidos: 80,
          lidos: 65,
          percentual: 81.25,
          itensAtualizados: 60,
          itensDesatualizado: 5,
          usuarios: { "Camila Rocha": 35, "Lucas Almeida": 30 }
        },
        "PERECIVEL 2": {
          total: 85,
          itensValidos: 75,
          lidos: 60,
          percentual: 80.00,
          itensAtualizados: 55,
          itensDesatualizado: 5,
          usuarios: { "Tatiane Pereira": 30, "Gabriel Santos": 30 }
        },
        "PERECIVEL 2 B": {
          total: 60,
          itensValidos: 50,
          lidos: 40,
          percentual: 80.00,
          itensAtualizados: 38,
          itensDesatualizado: 2,
          usuarios: { "Renata Oliveira": 40 }
        },
        "PERECIVEL 3": {
          total: 70,
          itensValidos: 60,
          lidos: 50,
          percentual: 83.33,
          itensAtualizados: 48,
          itensDesatualizado: 2,
          usuarios: { "Felipe Costa": 50 }
        },
        "SECA DOCE": {
          total: 200,
          itensValidos: 180,
          lidos: 165,
          percentual: 91.67,
          itensAtualizados: 155,
          itensDesatualizado: 10,
          usuarios: { "João Silva": 85, "Maria Santos": 80 }
        },
        "SECA SALGADA": {
          total: 150,
          itensValidos: 130,
          lidos: 115,
          percentual: 88.46,
          itensAtualizados: 105,
          itensDesatualizado: 10,
          usuarios: { "Carlos Lima": 60, "Ana Oliveira": 55 }
        },
        "SECA SALGADA 2": {
          total: 50,
          itensValidos: 45,
          lidos: 40,
          percentual: 88.89,
          itensAtualizados: 38,
          itensDesatualizado: 2,
          usuarios: { "Pedro Costa": 40 }
        }
      },
      contadorClasses: {},
    },
    rupturas: {
      totalItens: 1200,
      itensLidos: 950,
      itensAtualizados: 0,
      itensDesatualizado: 0,
      itensSemEstoque: 0,
      itensNaopertence: 0,
      percentualConclusao: 79.17,
      custoTotalRuptura: 15750.50,
      custoMedioRuptura: 16.58,
      classesLeitura: {
        "A CLASSIFICAR": {
          total: 15,
          itensValidos: 12,
          lidos: 10,
          percentual: 83.33,
          custoRuptura: 125.50,
          usuarios: { "João Silva": 6, "Maria Santos": 4 }
        },
        "ALTO GIRO": {
          total: 120,
          itensValidos: 108,
          lidos: 90,
          percentual: 83.33,
          custoRuptura: 1850.75,
          usuarios: { "Carlos Lima": 50, "Ana Oliveira": 40 }
        },
        "BAZAR": {
          total: 180,
          itensValidos: 150,
          lidos: 120,
          percentual: 80.00,
          custoRuptura: 2200.00,
          usuarios: { "Pedro Costa": 65, "Fernanda Rocha": 55 }
        },
        "DIVERSOS": {
          total: 50,
          itensValidos: 45,
          lidos: 38,
          percentual: 84.44,
          custoRuptura: 450.25,
          usuarios: { "Ricardo Alves": 38 }
        },
        "DPH": {
          total: 200,
          itensValidos: 180,
          lidos: 150,
          percentual: 83.33,
          custoRuptura: 2850.00,
          usuarios: { "Patrícia Nunes": 80, "Roberto Santos": 70 }
        },
        "FLV": {
          total: 80,
          itensValidos: 70,
          lidos: 52,
          percentual: 74.29,
          custoRuptura: 980.50,
          usuarios: { "Juliana Costa": 28, "Marcos Oliveira": 24 }
        },
        "LATICINIOS 1": {
          total: 100,
          itensValidos: 85,
          lidos: 68,
          percentual: 80.00,
          custoRuptura: 1250.00,
          usuarios: { "Carla Silva": 38, "Paulo Rodrigues": 30 }
        },
        "LIQUIDA": {
          total: 150,
          itensValidos: 130,
          lidos: 105,
          percentual: 80.77,
          custoRuptura: 1800.00,
          usuarios: { "Amanda Lima": 55, "Diego Souza": 50 }
        },
        "PERECIVEL 1": {
          total: 90,
          itensValidos: 80,
          lidos: 62,
          percentual: 77.50,
          custoRuptura: 1150.00,
          usuarios: { "Camila Rocha": 32, "Lucas Almeida": 30 }
        },
        "PERECIVEL 2": {
          total: 85,
          itensValidos: 75,
          lidos: 58,
          percentual: 77.33,
          custoRuptura: 950.00,
          usuarios: { "Tatiane Pereira": 28, "Gabriel Santos": 30 }
        },
        "PERECIVEL 2 B": {
          total: 60,
          itensValidos: 50,
          lidos: 38,
          percentual: 76.00,
          custoRuptura: 580.00,
          usuarios: { "Renata Oliveira": 38 }
        },
        "PERECIVEL 3": {
          total: 70,
          itensValidos: 60,
          lidos: 48,
          percentual: 80.00,
          custoRuptura: 720.00,
          usuarios: { "Felipe Costa": 48 }
        },
        "SECA DOCE": {
          total: 200,
          itensValidos: 180,
          lidos: 160,
          percentual: 88.89,
          custoRuptura: 2400.00,
          usuarios: { "João Silva": 82, "Maria Santos": 78 }
        },
        "SECA SALGADA": {
          total: 150,
          itensValidos: 130,
          lidos: 110,
          percentual: 84.62,
          custoRuptura: 1650.00,
          usuarios: { "Carlos Lima": 58, "Ana Oliveira": 52 }
        },
        "SECA SALGADA 2": {
          total: 50,
          itensValidos: 45,
          lidos: 38,
          percentual: 84.44,
          custoRuptura: 570.00,
          usuarios: { "Pedro Costa": 38 }
        }
      },
      contadorClasses: {},
    },
    presencas: {
      totalItens: 1400,
      itensLidos: 1100,
      itensAtualizados: 1050,
      itensDesatualizado: 0,
      itensSemEstoque: 0,
      itensNaopertence: 0,
      percentualConclusao: 78.57,
      presencasConfirmadas: 1050,
      percentualPresenca: 75.00,
      classesLeitura: {
        "A CLASSIFICAR": {
          total: 15,
          itensValidos: 12,
          lidos: 11,
          percentual: 91.67,
          presencasConfirmadas: 11,
          usuarios: { "João Silva": 6, "Maria Santos": 5 }
        },
        "ALTO GIRO": {
          total: 120,
          itensValidos: 108,
          lidos: 100,
          percentual: 92.59,
          presencasConfirmadas: 100,
          usuarios: { "Carlos Lima": 52, "Ana Oliveira": 48 }
        },
        "BAZAR": {
          total: 180,
          itensValidos: 150,
          lidos: 135,
          percentual: 90.00,
          presencasConfirmadas: 135,
          usuarios: { "Pedro Costa": 72, "Fernanda Rocha": 63 }
        },
        "DIVERSOS": {
          total: 50,
          itensValidos: 45,
          lidos: 42,
          percentual: 93.33,
          presencasConfirmadas: 42,
          usuarios: { "Ricardo Alves": 42 }
        },
        "DPH": {
          total: 200,
          itensValidos: 180,
          lidos: 165,
          percentual: 91.67,
          presencasConfirmadas: 165,
          usuarios: { "Patrícia Nunes": 88, "Roberto Santos": 77 }
        },
        "FLV": {
          total: 80,
          itensValidos: 70,
          lidos: 58,
          percentual: 82.86,
          presencasConfirmadas: 58,
          usuarios: { "Juliana Costa": 32, "Marcos Oliveira": 26 }
        },
        "LATICINIOS 1": {
          total: 100,
          itensValidos: 85,
          lidos: 72,
          percentual: 84.71,
          presencasConfirmadas: 72,
          usuarios: { "Carla Silva": 42, "Paulo Rodrigues": 30 }
        },
        "LIQUIDA": {
          total: 150,
          itensValidos: 130,
          lidos: 112,
          percentual: 86.15,
          presencasConfirmadas: 112,
          usuarios: { "Amanda Lima": 62, "Diego Souza": 50 }
        },
        "PERECIVEL 1": {
          total: 90,
          itensValidos: 80,
          lidos: 67,
          percentual: 83.75,
          presencasConfirmadas: 67,
          usuarios: { "Camila Rocha": 37, "Lucas Almeida": 30 }
        },
        "PERECIVEL 2": {
          total: 85,
          itensValidos: 75,
          lidos: 62,
          percentual: 82.67,
          presencasConfirmadas: 62,
          usuarios: { "Tatiane Pereira": 32, "Gabriel Santos": 30 }
        },
        "PERECIVEL 2 B": {
          total: 60,
          itensValidos: 50,
          lidos: 42,
          percentual: 84.00,
          presencasConfirmadas: 42,
          usuarios: { "Renata Oliveira": 42 }
        },
        "PERECIVEL 3": {
          total: 70,
          itensValidos: 60,
          lidos: 52,
          percentual: 86.67,
          presencasConfirmadas: 52,
          usuarios: { "Felipe Costa": 52 }
        },
        "SECA DOCE": {
          total: 200,
          itensValidos: 180,
          lidos: 168,
          percentual: 93.33,
          presencasConfirmadas: 168,
          usuarios: { "João Silva": 88, "Maria Santos": 80 }
        },
        "SECA SALGADA": {
          total: 150,
          itensValidos: 130,
          lidos: 118,
          percentual: 90.77,
          presencasConfirmadas: 118,
          usuarios: { "Carlos Lima": 62, "Ana Oliveira": 56 }
        },
        "SECA SALGADA 2": {
          total: 50,
          itensValidos: 45,
          lidos: 42,
          percentual: 93.33,
          presencasConfirmadas: 42,
          usuarios: { "Pedro Costa": 42 }
        }
      },
      contadorClasses: {},
    },
    totais: {
      totalItens: 4100,
      itensLidos: 3030,
      itensAtualizados: 1900,
      percentualConclusaoGeral: 73.90,
      pontuacaoTotal: 0,
    },
  },
});

// Estado de carregamento
const carregando = ref(false);
const erro = ref(null);

// Dados de usuários do endpoint /metricas/usuarios (MOCKADOS)
const dadosUsuarios = ref([
  {
    id: 1,
    nome: "João Silva",
    foto: null,
    iniciais: "JS",
    conquistas: { totalConquistas: 12, nivel: 5, titulo: "Expert", xpTotal: 2500 },
    desempenho: { posicaoLoja: 1, posicaoGeral: 15, pontuacaoTotal: 2500 }
  },
  {
    id: 2,
    nome: "Maria Santos",
    foto: null,
    iniciais: "MS",
    conquistas: { totalConquistas: 10, nivel: 4, titulo: "Avançado", xpTotal: 2200 },
    desempenho: { posicaoLoja: 2, posicaoGeral: 22, pontuacaoTotal: 2200 }
  },
  {
    id: 3,
    nome: "Carlos Lima",
    foto: null,
    iniciais: "CL",
    conquistas: { totalConquistas: 8, nivel: 4, titulo: "Avançado", xpTotal: 1900 },
    desempenho: { posicaoLoja: 3, posicaoGeral: 28, pontuacaoTotal: 1900 }
  },
  {
    id: 4,
    nome: "Ana Oliveira",
    foto: null,
    iniciais: "AO",
    conquistas: { totalConquistas: 7, nivel: 3, titulo: "Intermediário", xpTotal: 1700 },
    desempenho: { posicaoLoja: 4, posicaoGeral: 35, pontuacaoTotal: 1700 }
  },
  {
    id: 5,
    nome: "Pedro Costa",
    foto: null,
    iniciais: "PC",
    conquistas: { totalConquistas: 6, nivel: 3, titulo: "Intermediário", xpTotal: 1500 },
    desempenho: { posicaoLoja: 5, posicaoGeral: 42, pontuacaoTotal: 1500 }
  }
]);

// Ícones para cada classe de produtos
const iconesClasses = {
  "A CLASSIFICAR": "❓",
  "ALTO GIRO": "⚡",
  BAZAR: "🛍️",
  DIVERSOS: "🧰",
  DPH: "🧴",
  FLV: "🍎",
  "LATICINIOS 1": "🥛",
  LIQUIDA: "🥤",
  "PERECIVEL 1": "🍗",
  "PERECIVEL 2": "🍖",
  "PERECIVEL 2 B": "🧀",
  "PERECIVEL 3": "🥬",
  "SECA DOCE": "🥦",
  "SECA SALGADA": "🧂",
  "SECA SALGADA 2": "🥫",
};

const setorSelecionado = ref(null);

// Computed para obter dados filtrados pelo tipo de auditoria
const dadosFiltrados = computed(() => {
  const auditoriaAtual = dadosReais.value.metricas[tipoAuditoriaAtual.value];
  if (!auditoriaAtual || !auditoriaAtual.classesLeitura) return [];

  return Object.entries(auditoriaAtual.classesLeitura).map(
    ([classe, dados]) => {
      return {
        ClasseProduto: classe,
        icone: iconesClasses[classe] || "📦",
        totalItens: dados.total || 0,
        itensValidos: dados.itensValidos || 0,
        itensLidos: dados.lidos || 0,
        itensAtualizados: dados.itensAtualizados || 0,
        itensDesatualizado: dados.itensDesatualizado || 0,
        custoRuptura: dados.custoRuptura || 0,
        presencasConfirmadas: dados.presencasConfirmadas || 0,
        percentualConclusao: dados.percentual || 0,
      };
    }
  );
});

// Computed para obter colaboradores do setor selecionado
const colaboradoresSetor = computed(() => {
  if (!setorSelecionado.value) return [];

  const auditoriaAtual = dadosReais.value.metricas[tipoAuditoriaAtual.value];
  if (!auditoriaAtual || !auditoriaAtual.classesLeitura) return [];

  const classeAtual = auditoriaAtual.classesLeitura[setorSelecionado.value.ClasseProduto];
  if (!classeAtual || !classeAtual.usuarios) return [];

  const usuariosArray = Object.entries(classeAtual.usuarios).map(([nome, itensLidos], index) => {
    const usuarioCompleto = dadosUsuarios.value.find(u => u.nome === nome);

    const eficiencia = classeAtual.itensValidos > 0
      ? Math.min(Math.round((itensLidos / classeAtual.itensValidos) * 100 * 10), 100)
      : 0;

    const avatares = ["👨‍💼", "👩‍💼", "👨‍🔧", "👩‍🔧", "👨‍🎨", "👩‍🎨", "👨‍🍳", "👩‍🍳"];
    const avatar = avatares[index % avatares.length];

    const status = itensLidos > 0 ? "ativo" : "ausente";

    return {
      id: usuarioCompleto?.id || index + 1,
      nome: nome,
      funcao: "Auditor",
      status: status,
      itensLidos: itensLidos,
      eficiencia: eficiencia,
      avatar: avatar,
      foto: usuarioCompleto?.foto || null,
      iniciais: usuarioCompleto?.iniciais || nome.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2),
      conquistas: usuarioCompleto?.conquistas || {
        totalConquistas: 0,
        nivel: 1,
        titulo: 'Novato',
        xpTotal: 0
      },
      desempenho: usuarioCompleto?.desempenho || {
        posicaoLoja: 0,
        posicaoGeral: 0,
        pontuacaoTotal: 0
      }
    };
  });

  return usuariosArray.sort((a, b) => b.itensLidos - a.itensLidos);
});

// Computed properties para o resumo
const percentualConclusaoGeral = computed(() => {
  return (
    dadosReais.value.metricas[tipoAuditoriaAtual.value]?.percentualConclusao || 0
  );
});

const totalItens = computed(() => {
  return dadosReais.value.metricas[tipoAuditoriaAtual.value]?.totalItens || 0;
});

const itensLidos = computed(() => {
  if (tipoAuditoriaAtual.value === 'etiquetas') {
    return dadosReais.value.metricas.etiquetas?.itensValidos || 0;
  }
  return dadosReais.value.metricas[tipoAuditoriaAtual.value]?.itensLidos || 0;
});

const itensAtualizados = computed(() => {
  return dadosReais.value.metricas.etiquetas?.itensAtualizados || 0;
});

const custoTotalRuptura = computed(() => {
  return dadosReais.value.metricas.rupturas?.custoTotalRuptura || 0;
});

const percentualPresenca = computed(() => {
  return dadosReais.value.metricas.presencas?.percentualPresenca || 0;
});

// Computed para calcular total de colaboradores únicos envolvidos
const totalColaboradores = computed(() => {
  const auditoriaAtual = dadosReais.value.metricas[tipoAuditoriaAtual.value];
  if (!auditoriaAtual || !auditoriaAtual.classesLeitura) return 0;

  const usuariosUnicos = new Set();

  Object.values(auditoriaAtual.classesLeitura).forEach((classe) => {
    if (classe.usuarios) {
      Object.keys(classe.usuarios).forEach((usuario) => {
        if (usuario !== "Produto não auditado") {
          usuariosUnicos.add(usuario);
        }
      });
    }
  });

  return usuariosUnicos.size;
});

const getPercentualLeitura = (setor) => {
  if (typeof setor.percentualConclusao !== 'undefined' && setor.percentualConclusao !== null) {
    return setor.percentualConclusao;
  }
  if (!setor.itensValidos || setor.itensValidos <= 0) return 0;
  const percentual = (setor.itensLidos / setor.itensValidos) * 100;
  return Math.min(percentual, 100);
};

const getClasseDesempenho = (valor) => {
  if (valor >= 90) return "excelente";
  if (valor >= 80) return "bom";
  if (valor >= 70) return "atencao";
  return "critico";
};

const getClasseCusto = (setor) => {
  const custo = setor.custoRuptura || 0;
  if (custo === 0) return "sem-custo";
  if (custo < 500) return "baixo";
  if (custo < 2000) return "medio";
  return "alto";
};

const getStatusSetor = (setor) =>
  getClasseDesempenho(getPercentualLeitura(setor));

const getStatusLinha = (setor) => ({
  "linha-destaque": getPercentualLeitura(setor) >= 90,
  "linha-atencao": getPercentualLeitura(setor) < 70,
});

const getTipoAuditoriaLabel = () => {
  const labels = {
    etiquetas: "Etiquetas",
    presencas: "Presenças",
    rupturas: "Rupturas",
  };
  return labels[tipoAuditoriaAtual.value] || "Auditoria";
};

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

const alterarTipoAuditoria = (tipo) => {
  tipoAuditoriaAtual.value = tipo;
};

const verDetalhesSetor = (setor) => {
  setorSelecionado.value = setor;
};

const fecharModal = () => {
  setorSelecionado.value = null;
};

const exportarSetor = (setor) => {
  console.log("Exportando dados do setor:", setor);
  alert(`Dados do setor ${setor.ClasseProduto} exportados com sucesso!`);
};

// Função simulada (não faz requisição real)
const buscarMetricasLoja = async () => {
  try {
    carregando.value = true;
    erro.value = null;

    // Simular delay de carregamento
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("✅ Dados mockados carregados com sucesso!");

  } catch (error) {
    console.error("❌ Erro ao buscar métricas da loja:", error);
    erro.value = "Erro ao carregar métricas. Tente novamente mais tarde.";
  } finally {
    carregando.value = false;
  }
};

// Inicialização
onMounted(() => {
  console.log("Componente TesteMetricas montado com DADOS MOCKADOS");
  buscarMetricasLoja();
});
</script>

<style scoped>
.metricas-setor-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin: 1rem 0;
}

/* Loading e Erro */
.loading-container,
.erro-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 300px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container p {
  color: #718096;
  font-size: 1rem;
}

.erro-container {
  color: #f44336;
}

.erro-mensagem {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.metricas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.metricas-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.metricas-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  background: #e2e8f0;
  border: none;
  border-radius: 6px;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  border: 2px solid transparent;
}

.action-btn:hover {
  background: #cbd5e0;
  transform: translateY(-1px);
}

.action-btn.active {
  background: #667eea;
  color: white;
  border-color: #5a6fd8;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.metricas-table-container {
  padding: 1.5rem;
}

.metricas-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.metricas-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  border-bottom: 1px solid #e2e8f0;
}

.metricas-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.metricas-table tr:last-child td {
  border-bottom: none;
}

.metricas-table tr.linha-destaque {
  background: rgba(76, 175, 80, 0.05);
}

.metricas-table tr.linha-atencao {
  background: rgba(244, 67, 54, 0.05);
}

.setor-cell .setor-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setor-icon {
  font-size: 1.2rem;
}

.progress-bar {
  position: relative;
  height: 24px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill.excelente {
  background: #4caf50;
}
.progress-fill.bom {
  background: #ff9800;
}
.progress-fill.atencao {
  background: #ffeb3b;
}
.progress-fill.critico {
  background: #f44336;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.meta-cell,
.conformidade-cell,
.ruptura-cell {
  font-weight: 600;
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.excelente {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.status-badge.bom {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.status-badge.atencao {
  background: rgba(255, 235, 59, 0.1);
  color: #fbc02d;
}

.status-badge.critico {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.acoes-cell {
  display: flex;
  gap: 0.5rem;
}

.acao-btn {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.acao-btn:hover {
  background: #f8fafc;
  transform: scale(1.1);
}

.resumo-estatistico {
  padding: 1.5rem;
  background: #f8fafc;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.estatisticas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.estatistica-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.estatistica-valor {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.estatistica-label {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-close:hover {
  background: #f8fafc;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.secondary {
  background: #718096;
  color: white;
}

.setor-detalhes {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detalhe-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.setor-icone-grande {
  font-size: 3rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 1rem;
}

.setor-info-grande h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.metricas-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metrica-item {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.metrica-label {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.metrica-valor {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.progress-bar-small {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-small .progress-fill {
  height: 100%;
  border-radius: 3px;
}

.colaboradores-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
}

.colaboradores-section h5 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.colaboradores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.colaborador-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #667eea;
}

.colaborador-avatar {
  font-size: 2rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.colaborador-foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.colaborador-iniciais {
  font-size: 1rem;
  font-weight: 700;
  color: #667eea;
}

.colaborador-info {
  flex: 1;
}

.colaborador-nome {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.colaborador-funcao {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.colaborador-conquistas {
  font-size: 0.75rem;
  color: #667eea;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.colaborador-ranking {
  font-size: 0.7rem;
  color: #4a5568;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.colaborador-status {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  display: inline-block;
}

.colaborador-status.ativo {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.colaborador-status.ausente {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.colaborador-metricas {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: center;
}

.colaborador-metrica {
  display: flex;
  flex-direction: column;
}

.colaborador-metrica .metrica-valor {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0;
}

.colaborador-metrica .metrica-label {
  font-size: 0.7rem;
  color: #718096;
  margin-bottom: 0;
}

.custo-cell.sem-custo {
  color: #4caf50;
  font-weight: 600;
}

.custo-cell.baixo {
  color: #ff9800;
  font-weight: 600;
}

.custo-cell.medio {
  color: #ff5722;
  font-weight: 600;
}

.custo-cell.alto {
  color: #f44336;
  font-weight: 700;
}

.presenca-cell {
  font-weight: 600;
  color: #2c3e50;
}

.atualizados-cell {
  font-weight: 600;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .metricas-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .metricas-actions {
    justify-content: center;
  }

  .metricas-table-container {
    padding: 1rem;
    overflow-x: auto;
  }

  .estatisticas-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .metricas-grid {
    grid-template-columns: 1fr;
  }

  .colaboradores-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }

  .modal-footer {
    flex-direction: column;
  }

  .colaborador-card {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .estatisticas-grid {
    grid-template-columns: 1fr;
  }

  .metricas-actions {
    flex-direction: column;
  }

  .action-btn {
    text-align: center;
  }
}
</style>
