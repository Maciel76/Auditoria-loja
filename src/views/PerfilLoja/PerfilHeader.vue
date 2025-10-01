<template>
  <div class="perfil-header">
    <div class="perfil-cover">
      <div class="cover-pattern"></div>
      <div class="cover-overlay">
        <div class="loja-status" :class="statusAuditoria.classe">
          <i class="fas" :class="statusAuditoria.icone"></i>
          {{ statusAuditoria.texto }}
          <span
            v-if="statusAuditoria.contagem !== null"
            class="contagem-regressiva"
          >
            {{ statusAuditoria.contagem }}
          </span>
        </div>
      </div>
    </div>

    <div class="perfil-info">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <img
            v-if="loja.imagem"
            :src="loja.imagem"
            :alt="loja.nome"
            class="avatar-img"
          />
          <div v-else class="avatar-placeholder">
            {{ loja.iniciais }}
          </div>
          <div class="avatar-badge" v-if="loja.premium">
            <span class="icon">⭐</span>
          </div>
          <span class="avatar-codigo">#{{ loja.codigo }}</span>
        </div>
      </div>

      <div class="perfil-details">
        <div class="loja-header">
          <h1 class="loja-nome">
            {{ loja.nome }}
            <span
              v-if="loja.nomeCompleto && loja.nomeCompleto !== loja.nome"
              class="loja-nome-completo"
              >-
              {{
                loja.nomeCompleto.replace("Loja " + loja.codigo + " ", "")
              }}</span
            >
          </h1>
        </div>
        <p class="loja-endereco">
          <i class="fas fa-map-marker-alt"></i>
          {{ loja.endereco }} • {{ loja.cidade }}
        </p>
        <p class="loja-contato">
          <i class="fas fa-phone"></i>
          {{ loja.telefone }} •
          <i class="fas fa-user-tie"></i>
          Gerente: {{ loja.gerente }}
        </p>

        <div class="loja-horario">
          <i class="fas fa-clock"></i>
          <span v-if="auditoriaHoje">
            Próxima auditoria hoje: das {{ auditoriaHoje.inicio }} às
            {{ auditoriaHoje.fim }}
          </span>
          <span v-else-if="auditoriaRolando">
            Auditoria rolando: termina em {{ tempoRestante }}
          </span>
          <span v-else>
            Próxima auditoria {{ proximaDescricao }}: das
            {{ proximaHorario.inicio }} às {{ proximaHorario.fim }}
          </span>
        </div>
      </div>

      <div class="perfil-stats">
        <div class="stat-item">
          <span class="stat-number">
            <template v-if="auditoriaRolando">Auditoria ativa</template>
            <template v-else-if="auditoriaHoje">Auditoria de hoje</template>
            <template v-else>Próx. auditoria</template>
          </span>
          <span class="stat-label">
            <template v-if="auditoriaRolando || auditoriaHoje">
              {{ auditoriaNome }}
            </template>
            <template v-else>
              {{ proximaAuditoriaNome }}
            </template>
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-number">2%</span>
          <span class="stat-label">Meta</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ progressoAtual }}%</span>
          <span class="stat-label">Progresso atual</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PerfilHeaderLoja",
  props: {
    loja: {
      type: Object,
      required: true,
      default: () => ({
        nome: "Nome da Loja",
        nomeCompleto: "",
        codigo: "000",
        endereco: "Endereço da Loja",
        cidade: "Cidade",
        telefone: "(00) 00000-0000",
        gerente: "Nome do Gerente",
        horarioFuncionamento: "08:00 - 18:00",
        imagem: null,
        iniciais: "NL",
        premium: false,
        status: "ativa",
        totalAuditorias: 0,
        setoresAtivos: 0,
        percentualDesempenho: 0,
      }),
    },
  },
  data() {
    return {
      statusAuditoria: {
        texto: "Verificando status...",
        classe: "verificando",
        icone: "fa-sync-alt",
        contagem: null,
      },
      auditoriaHoje: null,
      auditoriaRolando: false,
      tempoRestante: "",
      proximaDescricao: "",
      proximaHorario: { inicio: "", fim: "" },
      intervalo: null,
    };
  },
  computed: {
    horariosAuditoria() {
      return {
        1: { nome: "Segunda-feira", inicio: "11:00", fim: "17:00" },
        2: { nome: "Terça-feira", inicio: "08:00", fim: "18:00" },
        3: { nome: "Quarta-feira", inicio: "08:00", fim: "12:00" },
        4: { nome: "Quinta-feira", inicio: "11:00", fim: "17:00" },
      };
    },
    diasSemana() {
      return [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ];
    },
    auditoriaNome() {
      const diaSemana = new Date().getDay();
      const info = this.horariosAuditoria[diaSemana];
      return info ? info.nome : "";
    },
    proximaAuditoriaNome() {
      const hoje = new Date();
      let prox = (hoje.getDay() + 1) % 7;
      for (let i = 0; i < 7; i++) {
        if (this.horariosAuditoria[prox]) {
          const info = this.horariosAuditoria[prox];
          return info.nome;
        }
        prox = (prox + 1) % 7;
      }
      return "";
    },
    progressoAtual() {
      // Valor fixo para exibição, pode ser alterado depois
      return 0;
    },
  },
  methods: {
    atualizarStatusAuditoria() {
      const agora = new Date();
      const diaSemana = agora.getDay(); // 0=Domingo, 1=Segunda, etc.
      const horarioHoje = this.horariosAuditoria[diaSemana];
      this.auditoriaHoje = null;
      this.auditoriaRolando = false;
      this.tempoRestante = "";
      // Se hoje é dia de auditoria
      if (horarioHoje) {
        const [inicioH, inicioM] = horarioHoje.inicio.split(":").map(Number);
        const [fimH, fimM] = horarioHoje.fim.split(":").map(Number);
        const inicioAuditoria = new Date(agora);
        inicioAuditoria.setHours(inicioH, inicioM, 0, 0);
        const fimAuditoria = new Date(agora);
        fimAuditoria.setHours(fimH, fimM, 0, 0);
        if (agora < inicioAuditoria) {
          // Próxima auditoria hoje
          this.auditoriaHoje = horarioHoje;
          // Status: pré-auditoria (contagem regressiva)
          const diffMs = inicioAuditoria - agora;
          const minutosParaInicio = Math.floor(diffMs / (1000 * 60));
          this.statusAuditoria = {
            texto: "Auditoria começa em",
            classe: "pre-auditoria",
            icone: "fa-clock",
            contagem:
              minutosParaInicio >= 60
                ? `${Math.floor(minutosParaInicio / 60)} horas`
                : `${minutosParaInicio} min`,
          };
        } else if (agora >= inicioAuditoria && agora <= fimAuditoria) {
          // Auditoria rolando
          this.auditoriaRolando = true;
          // Calcular tempo restante
          const diffMs = fimAuditoria - agora;
          const horas = Math.floor(diffMs / (1000 * 60 * 60));
          const minutos = Math.floor((diffMs / (1000 * 60)) % 60);
          this.tempoRestante = `${horas > 0 ? horas + "h " : ""}${minutos}min`;
          // Status: em andamento
          this.statusAuditoria = {
            texto: "Auditoria em andamento",
            classe: "em-andamento",
            icone: "fa-play-circle",
            contagem: null,
          };
        } else {
          // Já passou do horário de auditoria hoje
          this.statusAuditoria = {
            texto: "Auditoria encerrada",
            classe: "encerrada",
            icone: "fa-check-circle",
            contagem: null,
          };
        }
      } else {
        // Não é dia de auditoria
        this.statusAuditoria = {
          texto: "Nenhuma auditoria hoje",
          classe: "sem-auditoria",
          icone: "fa-calendar-times",
          contagem: null,
        };
      }
      // Se não é dia de auditoria ou já passou, buscar próximo dia
      if (!this.auditoriaHoje && !this.auditoriaRolando) {
        let diasProx = 1;
        let proxDia = (diaSemana + 1) % 7;
        while (diasProx <= 7) {
          if (this.horariosAuditoria[proxDia]) {
            this.proximaDescricao = this.diasSemana[proxDia];
            this.proximaHorario = this.horariosAuditoria[proxDia];
            break;
          }
          proxDia = (proxDia + 1) % 7;
          diasProx++;
        }
      }
    },

    calcularProximaAuditoria(diaAtual) {
      // Encontrar o próximo dia com auditoria
      let diasParaProxima = 1;
      let proximoDia = (diaAtual + 1) % 7;

      while (diasParaProxima <= 7) {
        if (this.horariosAuditoria[proximoDia]) {
          const diasSemana = [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
          ];
          this.proximaAuditoria = `${diasSemana[proximoDia]} ${this.horariosAuditoria[proximoDia].inicio}`;
          return;
        }
        proximoDia = (proximoDia + 1) % 7;
        diasParaProxima++;
      }

      this.proximaAuditoria = "";
    },
  },
  mounted() {
    this.atualizarStatusAuditoria();
    // Atualizar a cada minuto
    this.intervalo = setInterval(() => {
      this.atualizarStatusAuditoria();
    }, 60000);
  },
  beforeUnmount() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  },
};
</script>

<style scoped>
.perfil-header {
  background: rgb(255, 255, 255);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: -20px;
  position: relative;
}

.perfil-cover {
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.cover-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0px,
    rgba(255, 255, 255, 0.1) 16px,
    transparent 16px,
    transparent 32px
  );
  opacity: 0.7;
  pointer-events: none;
}

.cover-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
}

.loja-status {
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

/* Status: Em andamento (bolinha piscando verde) */
.loja-status.em-andamento {
  background: rgba(76, 175, 80, 0.25);
  color: #2e7d32;
  animation: pulse-green 2s infinite;
}

.loja-status.em-andamento::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4caf50;
  margin-right: 5px;
  animation: pulse-dot 2s infinite;
}

/* Status: Pré-auditoria (contagem regressiva) */
.loja-status.pre-auditoria {
  background: #fff;
  color: #757575;
  position: relative;
  padding-left: 28px;
}

.loja-status.pre-auditoria::before {
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #bdbdbd;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  animation: pulse-gray 1.5s infinite;
}

@keyframes pulse-gray {
  0% {
    box-shadow: 0 0 0 0 rgba(189, 189, 189, 0.5);
    opacity: 0.8;
  }
  70% {
    box-shadow: 0 0 0 10px rgba(189, 189, 189, 0);
    opacity: 1;
  }
  100% {
    box-shadow: 0 0 0 0 rgba(189, 189, 189, 0);
    opacity: 0.8;
  }
}

.contagem-regressiva {
  background: rgba(255, 152, 0, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 700;
  margin-left: 5px;
}

/* Status: Auditoria encerrada */
.loja-status.encerrada {
  background: #e0e0e0;
  color: #e99b3c;
}

/* Status: Sem auditoria */
.loja-status.sem-auditoria {
  background-color: #e9ecef;
  color: #c93a16;
  position: relative;
  padding-left: 28px;
}

.loja-status.sem-auditoria::before {
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #c62828;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  animation: pulse-red 1.5s infinite;
}

@keyframes pulse-red {
  0% {
    box-shadow: 0 0 0 0 rgba(198, 40, 40, 0.5);
    opacity: 0.8;
  }
  70% {
    box-shadow: 0 0 0 10px rgba(198, 40, 40, 0);
    opacity: 1;
  }
  100% {
    box-shadow: 0 0 0 0 rgba(198, 40, 40, 0);
    opacity: 0.8;
  }
}

/* Status: Verificando */
.loja-status.verificando {
  background: rgba(33, 150, 243, 0.15);
  color: #1565c0;
}

.loja-status.verificando .fa-sync-alt {
  animation: spin 1.5s linear infinite;
}

/* Animações */
@keyframes pulse-green {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

@keyframes pulse-dot {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.perfil-info {
  padding: 0 30px 30px;
  margin-top: -40px;
  display: flex;
  align-items: flex-end;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.avatar-container {
  position: relative;
}

.avatar-wrapper {
  position: relative;
}

.avatar-codigo {
  position: absolute;
  top: 0px;
  right: 1px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 4px 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.05rem;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.13);
  z-index: 5;
  letter-spacing: 0.5px;
  border: 2px solid #fff;
}

.avatar-img {
  width: 160px;
  height: 160px;
  border-radius: 20px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.avatar-img:hover {
  transform: scale(1.05);
}

.avatar-placeholder {
  width: 160px;
  height: 160px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 3.5rem;
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.avatar-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #8a6d00;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.perfil-details {
  flex: 1;
  min-width: 300px;
}

.loja-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.loja-nome {
  font-size: 2.5rem;

  margin: 10;

  margin-top: -20px;
  font-weight: 800;
  position: relative;
  z-index: 10;
  background: linear-gradient(90deg, #667eea 10%, #764ba2 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(102, 126, 234, 0.18), 0 1px 0 #fff;
  letter-spacing: 1px;
  border-radius: 8px;
  padding: 2px 12px 2px 6px;
  box-shadow: 0 2px 12px 0 rgba(102, 126, 234, 0.1), 0 1.5px 0 #fff;
  transition: color 0.2s;
}

.loja-endereco {
  color: #7f8c8d;
  margin-bottom: 8px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.loja-contato {
  color: #7f8c8d;
  margin-bottom: 12px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.loja-horario {
  color: #7f8c8d;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  display: inline-flex;
  flex-wrap: wrap;
}

.proxima-auditoria {
  color: #667eea;
  font-weight: 600;
}

.perfil-stats {
  display: flex;
  gap: 14px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 10px 8px;
  border-radius: 10px;
  min-width: 180px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.stat-item {
  text-align: center;
  align-items: center;
  flex: 1;
  padding: 4px 0;
}

.stat-number {
  margin-left: 10px;
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsividade */
@media (max-width: 968px) {
  .perfil-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 25px;
  }

  .loja-header {
    justify-content: center;
  }

  .perfil-details {
    text-align: center;
  }

  .loja-endereco,
  .loja-contato {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .perfil-cover {
    height: 150px;
  }

  .perfil-info {
    padding: 0 20px 25px;
    margin-top: -30px;
  }

  .avatar-img,
  .avatar-placeholder {
    width: 120px;
    height: 120px;
  }

  .loja-nome {
    font-size: 2rem;
    z-index: 10;
  }

  .perfil-stats {
    flex-direction: column;
    gap: 20px;
    width: 100%;
    min-width: auto;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }

  .stat-number {
    font-size: 1.8rem;
    margin-bottom: 0;
  }

  .loja-status {
    font-size: 0.85rem;
    padding: 8px 14px;
  }
}

@media (max-width: 480px) {
  .loja-header {
    flex-direction: column;
    gap: 10px;
  }

  .loja-nome {
    font-size: 1.8rem;
    z-index: 10;
  }

  .loja-endereco,
  .loja-contato {
    font-size: 0.9rem;
  }

  .perfil-stats {
    padding: 20px;
    flex-direction: column;
    gap: 14px;
  }

  .avatar-img,
  .avatar-placeholder {
    width: 110px;
    height: 110px;
    font-size: 2.5rem;
    box-shadow: 0 4px 24px 0 rgba(102, 126, 234, 0.18), 0 2px 0 #fff;
    border: 4px solid #fff;
    background: #f8f8fa;
    z-index: 10;
    position: relative;
  }

  .perfil-info {
    padding: 0 8px 16px;
    margin-top: -18px;
    gap: 12px;
  }

  .perfil-details {
    min-width: 0;
  }

  .stat-number {
    font-size: 1.8rem;
  }
  .stat-label {
    font-size: 0.8rem;
  }

  .loja-status {
    font-size: 0.75rem;
    padding: 6px 10px;
    flex-direction: column;
    gap: 4px;
  }
  .contagem-regressiva {
    font-size: 0.7rem;
  }
}
</style>
