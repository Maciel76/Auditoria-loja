<template>
  <div class="botoes-acao">
    <v-row dense>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="botao in botoes"
        :key="botao.titulo"
      >
        <v-card class="pa-3 d-flex align-center" outlined>
          <v-icon class="mr-3" color="primary">{{ botao.icone }}</v-icon>
          <div>
            <div class="font-weight-bold">{{ botao.titulo }}</div>
            <div class="text--secondary text-caption">
              {{ botao.descricao }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const botoes = [
  {
    titulo: "Agendar Nova Auditoria",
    descricao: "Botão para abrir modal/formulário de agendamento.",
    icone: "mdi-calendar-plus",
  },
  {
    titulo: "Baixar Relatório",
    descricao:
      "Download rápido do relatório da última auditoria ou do período filtrado.",
    icone: "mdi-file-download",
  },
  {
    titulo: "Notificar Equipe",
    descricao:
      "Enviar alerta para responsáveis de setores com não conformidades.",
    icone: "mdi-bell-alert",
  },
  {
    titulo: "Corrigir Não Conformidades",
    descricao:
      "Link direto para tela/lista de pendências ou para registrar ações corretivas.",
    icone: "mdi-alert-circle",
  },
  {
    titulo: "Ver Auditorias Pendentes",
    descricao:
      "Atalho para visualizar e filtrar apenas as auditorias em aberto.",
    icone: "mdi-format-list-bulleted",
  },
  {
    titulo: "Adicionar Observação",
    descricao:
      "Botão para registrar uma observação rápida sobre a loja ou setor.",
    icone: "mdi-note-plus",
  },
  {
    titulo: "Exportar Dados",
    descricao: "Exportação em Excel/CSV dos dados exibidos.",
    icone: "mdi-file-export",
  },
  {
    titulo: "Comparar com Período Anterior",
    descricao: "Ação para exibir comparação rápida de KPIs.",
    icone: "mdi-chart-line",
  },
];
</script>

<style scoped>
.botoes-acao {
  margin-top: 32px;
}

.botoes-acao .v-card {
  border-radius: 18px !important;
  box-shadow: 0 4px 24px rgba(67, 97, 238, 0.1) !important;
  background: linear-gradient(135deg, #f7fafc 0%, #e6fffa 100%) !important;
  border: 1.5px solid #e2e8f0 !important;
  transition: box-shadow 0.22s, transform 0.18s, background 0.22s;
  cursor: pointer;
}
.botoes-acao .v-card:hover {
  box-shadow: 0 8px 32px rgba(67, 97, 238, 0.18) !important;
  background: linear-gradient(135deg, #e6fffa 0%, #f7fafc 100%) !important;
  transform: scale(1.035) translateY(-2px);
}
.botoes-acao .v-icon {
  font-size: 2.1rem !important;
  filter: drop-shadow(0 2px 4px rgba(67, 97, 238, 0.1));
}
.botoes-acao .font-weight-bold {
  font-size: 1.08rem;
  font-weight: 700 !important;
  color: #2d3748;
  margin-bottom: 2px;
}
.botoes-acao .text--secondary {
  color: #4a5568 !important;
  font-size: 0.97rem !important;
  opacity: 0.85;
}
</style>
