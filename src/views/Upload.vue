<!-- Upload.vue - Menu de Seleção de Auditoria -->
<template>
  <div class="upload-menu-container">
    <!-- Header com informações -->
    <div class="menu-header">
      <h1>Selecionar Tipo de Auditoria</h1>
      <p class="menu-description">
        Escolha o tipo de auditoria que deseja realizar para fazer o upload da
        planilha correspondente
      </p>
    </div>

    <!-- Cards de tipos de auditoria -->
    <div class="audit-types-grid">
      <!-- Auditoria de Etiquetas -->
      <div @click="navegarPara('etiqueta')" class="audit-card etiqueta">
        <div class="card-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              fill="#667eea"
              d="m21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42M13 20l-9-9V4h7l9 9M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5"
            />
          </svg>
        </div>
        <div class="card-content">
          <h3>Auditoria de Etiquetas</h3>
          <p>
            Upload de planilhas para verificação de preços e informações de
            etiquetas dos produtos
          </p>
          <span class="card-action">Clique para continuar →</span>
        </div>
      </div>

      <!-- Auditoria de Presença -->
      <div @click="navegarPara('presenca')" class="audit-card presenca">
        <div class="card-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="#48bb78"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path d="m16 16l2 2l4-4" />
              <path
                d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14M7.5 4.27l9 5.15"
              />
              <path d="M3.29 7L12 12l8.71-5M12 22V12" />
            </g>
          </svg>
        </div>
        <div class="card-content">
          <h3>Auditoria de Presença</h3>
          <p>
            Upload de planilhas para controle de presença e disponibilidade de
            produtos em estoque
          </p>
          <span class="card-action">Clique para continuar →</span>
        </div>
      </div>

      <!-- Auditoria de Ruptura -->
      <div @click="navegarPara('ruptura')" class="audit-card ruptura">
        <div class="card-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              fill="#3da1f3"
              d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5M11 7h2v6h-2m0 2h2v2h-2"
            />
          </svg>
        </div>
        <div class="card-content">
          <h3>Auditoria de Ruptura</h3>
          <p>
            Upload de planilhas para identificação e controle de produtos em
            falta no estoque
          </p>
          <span class="card-action">Clique para continuar →</span>
        </div>
      </div>
    </div>

    <!-- Informações adicionais -->
    <div class="info-section">
      <div class="info-card">
        <h4>💡 Como funciona?</h4>
        <ul>
          <li>Selecione o tipo de auditoria desejada</li>
          <li>Faça upload da planilha correspondente (.xlsx, .xls, .csv)</li>
          <li>O sistema processará os dados automaticamente</li>
          <li>
            Visualize os resultados na área Correspondente no menu lateral
          </li>
        </ul>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useLojaStore } from "../store/lojaStore";

const router = useRouter();
const lojaStore = useLojaStore();

const navegarPara = (tipo) => {
  router.push(`/upload/${tipo}`);
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

.upload-menu-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  font-family: "Inter", sans-serif;
}

/* Header */
.menu-header {
  text-align: center;
  margin-bottom: 3rem;
}

.menu-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.menu-description {
  font-size: 1.2rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Grid de cards */
.audit-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 3rem;
}

/* Cards de auditoria */
.audit-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.audit-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  transition: transform 0.3s ease;
  transform: scaleX(0);
}

.audit-card.etiqueta::before {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.audit-card.presenca::before {
  background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
}

.audit-card.ruptura::before {
  background: linear-gradient(90deg, #3da1f3 0%, #2563eb 100%);
}

.audit-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.audit-card:hover::before {
  transform: scaleX(1);
}

.audit-card.etiqueta:hover {
  border-color: #667eea;
}

.audit-card.presenca:hover {
  border-color: #48bb78;
}

.audit-card.ruptura:hover {
  border-color: #3da1f3;
}

/* Ícone do card */
.card-icon {
  text-align: center;
  margin-bottom: 1.5rem;
}

.card-icon svg {
  transition: transform 0.3s ease;
}

.audit-card:hover .card-icon svg {
  transform: scale(1.1);
}

/* Conteúdo do card */
.card-content {
  text-align: center;
}

.card-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.card-content p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.card-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.audit-card.presenca .card-action {
  color: #48bb78;
}

.audit-card.ruptura .card-action {
  color: #3da1f3;
}

.audit-card:hover .card-action {
  transform: translateX(5px);
}

/* Seção de informações */
.info-section {
  max-width: 600px;
  margin: 0 auto;
}

.info-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  text-align: left;
}

.info-card h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  color: #64748b;
  margin-bottom: 0.75rem;
  position: relative;
  padding-left: 1.5rem;
  line-height: 1.5;
}

.info-card li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #48bb78;
  font-weight: bold;
}

/* Responsivo */
@media (max-width: 768px) {
  .upload-menu-container {
    padding: 1rem;
  }

  .menu-header h1 {
    font-size: 2rem;
  }

  .menu-description {
    font-size: 1.1rem;
  }

  .audit-types-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .audit-card {
    padding: 1.5rem;
  }

  .card-content h3 {
    font-size: 1.3rem;
  }

  .info-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .menu-header h1 {
    font-size: 1.75rem;
  }

  .card-content h3 {
    font-size: 1.2rem;
  }

  .card-content p {
    font-size: 0.95rem;
  }
}
</style>
