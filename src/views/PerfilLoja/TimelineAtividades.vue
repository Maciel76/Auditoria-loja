<template>
  <div class="timeline-atividades-container">
    <div class="icon-area">⏳</div>
    <div class="titulo">Linha do Tempo de Atividades</div>
    <div class="descricao">
      Acompanhe as principais ações realizadas na loja ao longo do tempo.<br />Em
      breve, uma timeline interativa será exibida aqui.
    </div>
  </div>
</template>

<style scoped>
.timeline-atividades-container {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(67, 97, 238, 0.08);
  padding: 2.5rem 1.5rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  margin: 1.5rem auto;
  max-width: 480px;
}
.icon-area {
  font-size: 3.2rem;
  margin-bottom: 1.1rem;
}
.titulo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.7rem;
}
.descricao {
  font-size: 1.08rem;
  color: #444;
  text-align: center;
}
</style>
