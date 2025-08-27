<template>
  <div class="relatorios-container">
    <div class="header-section">
      <h1 class="header-title">
        <span class="icon">📊</span> Relatórios de Auditoria
      </h1>
      <p class="header-subtitle">Análise consolidada por período</p>
    </div>

    <div class="filtros-section">
      <div class="filtro-group">
        <label>Período:</label>
        <select v-model="periodo" @change="carregarRelatorio">
          <option value="diario">Diário</option>
          <option value="semanal">Semanal</option>
          <option value="mensal">Mensal</option>
        </select>
      </div>

      <div class="filtro-group" v-if="periodo === 'diario'">
        <label>Data específica:</label>
        <select v-model="dataEspecifica" @change="carregarRelatorio">
          <option value="">Hoje</option>
          <option v-for="data in datasAuditoria" :key="data" :value="data">
            {{ formatarData(data) }}
          </option>
        </select>
      </div>

      <button @click="carregarRelatorio" class="btn btn-primary">
        <i class="fas fa-sync-alt"></i> Atualizar
      </button>
    </div>

    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando relatório...</p>
    </div>

    <div v-else-if="relatorio" class="relatorio-content">
      <div class="estatisticas-grid">
        <div class="estatistica-card">
          <div class="estatistica-icon">
            <i class="fas fa-cubes"></i>
          </div>
          <div class="estatistica-info">
            <h3>{{ relatorio.totalItens }}</h3>
            <p>Total de Itens</p>
          </div>
        </div>

        <div class="estatistica-card">
          <div class="estatistica-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="estatistica-info">
            <h3>{{ relatorio.totalItensLidos }}</h3>
            <p>Itens Lidos</p>
          </div>
        </div>

        <div class="estatistica-card">
          <div class="estatistica-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="estatistica-info">
            <h3>{{ relatorio.taxaConclusao }}%</h3>
            <p>Taxa de Conclusão</p>
          </div>
        </div>

        <div class="estatistica-card">
          <div class="estatistica-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="estatistica-info">
            <h3>{{ relatorio.colaboradores.length }}</h3>
            <p>Colaboradores</p>
          </div>
        </div>
      </div>

      <div class="tabela-section">
        <h3>Desempenho por Colaborador</h3>
        <div class="table-responsive">
          <table class="tabela-desempenho">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Itens Verificados</th>
                <th>Percentual</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="colab in relatorio.colaboradores" :key="colab.nome">
                <td>{{ colab.nome }}</td>
                <td>{{ colab.itens }}</td>
                <td>
                  <div class="percentual-bar">
                    <div
                      class="percentual-fill"
                      :style="{ width: colab.percentual + '%' }"
                    ></div>
                    <span>{{ colab.percentual }}%</span>
                  </div>
                </td>
                <td>
                  <router-link :to="'/perfil/' + colab.id" class="btn-small">
                    <i class="fas fa-eye"></i> Ver
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else-if="!carregando" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-chart-bar"></i>
      </div>
      <h3>Nenhum dado disponível</h3>
      <p>Selecione um período para gerar o relatório</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "Relatorios",
  setup() {
    const periodo = ref("diario");
    const dataEspecifica = ref("");
    const relatorio = ref(null);
    const carregando = ref(false);
    const datasAuditoria = ref([]);

    const carregarDatasAuditoria = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/datas-auditoria"
        );
        datasAuditoria.value = data;
      } catch (error) {
        console.error("Erro ao carregar datas:", error);
      }
    };

    const carregarRelatorio = async () => {
      try {
        carregando.value = true;
        let url = "http://localhost:3000/relatorios?periodo=" + periodo.value;

        if (periodo.value === "diario" && dataEspecifica.value) {
          url += "&data=" + dataEspecifica.value;
        }

        const { data } = await axios.get(url);
        relatorio.value = data;
      } catch (error) {
        console.error("Erro ao carregar relatório:", error);
      } finally {
        carregando.value = false;
      }
    };

    const formatarData = (dataString) => {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR");
    };

    onMounted(() => {
      carregarDatasAuditoria();
      carregarRelatorio();
    });

    return {
      periodo,
      dataEspecifica,
      relatorio,
      carregando,
      datasAuditoria,
      carregarRelatorio,
      formatarData,
    };
  },
};
</script>

<style scoped>
.relatorios-container {
  max-width: auto;
  margin: 0 auto;
  padding: 2px;
}

.filtros-section {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: center;
}

.filtro-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filtro-group label {
  font-weight: 600;
}

.estatisticas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.estatistica-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.estatistica-icon {
  width: 50px;
  height: 50px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.estatistica-info h3 {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e50;
}

.estatistica-info p {
  margin: 5px 0 0 0;
  color: #7f8c8d;
}

.tabela-section {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table-responsive {
  overflow-x: auto;
}

.tabela-desempenho {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.tabela-desempenho th,
.tabela-desempenho td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.tabela-desempenho th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.percentual-bar {
  width: 100px;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.percentual-fill {
  height: 100%;
  background: #51cf66;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.percentual-bar span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  color: #2c3e50;
  font-weight: 600;
}

.btn-small {
  padding: 6px 12px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.8rem;
}

.btn-small:hover {
  background: #5a67d8;
}

.loading-container {
  text-align: center;
  padding: 40px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}
</style>
